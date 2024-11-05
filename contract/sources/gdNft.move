module GdAddress::gdNft {
    use std::string::{utf8, String};

    use sui::tx_context::{sender, TxContext};
    use sui::transfer;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::package::{claim};
    use sui::display;

    // 允许作为全局存储中的键值，允许值存在于全局存储的某个结构体中
    struct Gd has key, store {
        id: UID,
        type: u8, // 类型, 0:记录本，1:收藏
        name: String, // 名称
        image_url: String, // 图片地址
        description: String, // 描述
        count: u64 // 功德数
    }

    // 允许被复制和丢弃
    struct GdMint has copy, drop {
        object_id: ID,
        type: u8, // 类型, 0:记录本，1:收藏
        creator: address, // 创建者
        name: String, // 名称
        image_url: String, // 图片地址
        description: String, // 描述
        count: u64 // 功德数
    }

    struct GDNFT has drop {}

    // 类型, 0:记录本，1:收藏
    public fun type(nft: &Gd): &u8 {
        &nft.type
    }
    // 功德数
    public fun count(nft: &Gd): &u64 {
        &nft.count
    }


    // 初始化
    fun init (otw: GDNFT, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"type"),
            utf8(b"name"),
            utf8(b"link"), // 应用中的链接，不需要使用
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"count"),
            utf8(b"project_url"), // 项目链接
            utf8(b"creator"),
        ];

        let values = vector[
            utf8(b"{type}"),
            utf8(b"{name}"),
            utf8(b""),
            utf8(b"{image_url}"),
            utf8(b"{description}"),
            utf8(b"{count}"),
            utf8(b"https://github.com/klren0312/sui-nft-dapp-muyu"),
            utf8(b"zcdc")
        ];

        // 认领 publisher
        let publisher = claim(otw, ctx);

        // 获取一个新的display对象
        let display = display::new_with_fields<Gd>(
            &publisher, keys, values, ctx
        );
        // 发布更新
        display::update_version(&mut display);

        transfer::public_transfer(publisher, sender(ctx));
        transfer::public_transfer(display, sender(ctx));
    }

    // 创建nft
    fun create_nft (
        type: u8,
        name: String,
        image_url: String,
        description: String,
        count: u64,
        ctx: &mut TxContext
    ): Gd {
        let sender = sender(ctx);
        let id = object::new(ctx);
        let nft = Gd { type, id, name, image_url, description, count };

        event::emit(GdMint {
            object_id: object::id(&nft),
            creator: sender,
            type: nft.type,
            name: nft.name,
            image_url: nft.image_url,
            description: nft.description,
            count: nft.count
        });
        nft
    }


    // 转发nft到指定地址
    public entry fun transfer(
        type: u8,
        name: String,
        image_url: String,
        description: String,
        count: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        transfer::public_transfer(create_nft(type, name, image_url, description, count, ctx), recipient)
    }

    // 增加功德
    public entry fun add_count(
        nft: &mut Gd,
        count: u64,
        description: String,
        _: &mut TxContext
    ) {
        if (count > nft.count) {
            nft.count =  count;
            nft.description = description;
        }
    }

    // 销毁nft
    public entry fun burn(nft: Gd, _: &mut TxContext) {
        let Gd {
            id,
            type: _,
            name: _,
            image_url: _,
            description: _,
            count: _
        } = nft;
        object::delete(id)
    }
}