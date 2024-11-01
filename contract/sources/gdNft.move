module GdAddress::gdNft {
    use std::string::{utf8, String};
    use std::ascii;

    use sui::tx_context::{sender, TxContext};
    use sui::transfer;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::balance::{Self, Supply, Balance};
    use std::option::{Self, Option};
    use sui::url::{Url};
    use sui::vec_map::{Self, VecMap};
    use sui::package::{claim};
    use sui::display;

    // 在大多数情况下，您应该将它创建为一个拥有的对象，然后您可以将其传输到平台的管理员，以便进行访问受限的方法调用
    struct AssetCap<phantom T> has key, store {
        id: UID,
        supply: Supply<T>,
        total_supply: u64,
        burnable: bool
    }

    // 要细分的整个资产的元数据
    struct AssetMetadata<phantom T> has key, store {
        id: UID,
        /// Name of the asset
        name: String,
        // the total max supply allowed to exist at any time
        total_supply: u64,
        /// Symbol for the asset
        symbol: ascii::String,
        /// Description of the asset
        description: String,
        /// URL for the asset logo
        icon_url: Option<Url>
    }

    // 创建时具有一个小于或等于剩余供应量的指定余额。
    // 如果资产的 VecMap 用值填充，表示多个惟一条目，则将其视为 NFT。
    // 相反，如果资产的 VecMap 没有填充，表明没有单独的条目，则将其视为 FT。
    struct TokenizedAsset<phantom T> has key, store {
        id: UID,
        /// The balance of the tokenized asset
        balance: Balance<T>,
        /// If the VecMap is populated, it is considered an NFT, else the asset is considered an FT.
        metadata: VecMap<String, String>,
        /// URL for the asset image (optional)
        image_url: Option<Url>,
    }

    // 授予部署合同的个人的能力。
    // 此功能授予与平台功能相关的特定权限或权限，允许部署人员在已部署的契约中执行某些受控操作或访问权限。
    struct PlatformCap has key, store { id: UID }

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
        _: &mut TxContext
    ) {
        if (count > nft.count) {
            nft.count =  count;
            nft.description = utf8(b"当前功德: {count.to_string()}");
        }
    }


    // Returns the value of the current circulating supply.
    public fun supply<T>(cap: &AssetCap<T>): u64 {
        balance::supply_value(&cap.supply)
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