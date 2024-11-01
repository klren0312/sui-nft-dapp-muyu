import muyu from './assets/muyu.svg'
import muyugun from './assets/muyugun.svg'
import soundMp3 from './assets/sound.mp3'
import { Howl } from 'howler'
import { useState } from 'react'
import { TransactionBlock } from "@mysten/sui.js/transactions"
import { PACKAGEID } from './constants'
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit'
import { toast } from 'react-toastify'

interface ImgObj {
  [key: string]: {
    name: string,
    url: string
  }
}

const obj: ImgObj = {
  1: {
    name: '赛博功德记录本',
    url: 'https://bafybeibigwt5csazd3f2fzycxfx2q7i7vna4linuqdlwr5fbaxsjgb45ai.ipfs.nftstorage.link/ipfs/bafybeibigwt5csazd3f2fzycxfx2q7i7vna4linuqdlwr5fbaxsjgb45ai/111.png',
  },
  166: {
    name: '赛博功德：166',
    url: 'https://bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde.ipfs.nftstorage.link/ipfs/bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde/166.png',
  },
  288: {
    name: '赛博功德：288',
    url: 'https://bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde.ipfs.nftstorage.link/ipfs/bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde/288.png',
  },
  588: {
    name: '赛博功德：588',
    url: 'https://bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde.ipfs.nftstorage.link/ipfs/bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde/588.png',
  },
  1888: {
    name: '赛博功德：1888',
    url: 'https://bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde.ipfs.nftstorage.link/ipfs/bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde/1888.png',
  },
  2888: {
    name: '赛博功德：2888',
    url: 'https://bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde.ipfs.nftstorage.link/ipfs/bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde/2888.png',
  },
  8888: {
    name: '赛博功德：8888',
    url: 'https://bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde.ipfs.nftstorage.link/ipfs/bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde/8888.png',
  },
  zzes: {
    name: '赛博功德无量',
    url: 'https://bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde.ipfs.nftstorage.link/ipfs/bafybeickygqtbkdpip7snru6gduxvf4thlrbom6l3qz3gvpkzph2sw6tde/zzes.png'
  },
}

const sound = new Howl({
  src: [soundMp3],
  html5: true
})
export function GameBlock() {
  const [showGun, setShowGun] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [num, setNum] = useState(0)
  const { mutate } = useSignAndExecuteTransactionBlock()
  const account = useCurrentAccount()
  const doIt = () => {
    sound.play()
    console.log(showGun)
    setShowGun(true)
  }
  const cancelIt = () => {
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 2000)
    sound.stop()
    setShowGun(false)
    setNum(num + 1)
    const txb = new TransactionBlock()
    
    let imgObj: {
      name: string,
      url: string
    } | undefined = undefined
    const index = num + 1 + ''
    if (Object.keys(obj).includes(index)) {
      imgObj = obj[index]
    }
    if (index.substring(1) && index.substring(1).split('').length > 5 && index.substring(1).split('').every(str => str === '8')) {
      imgObj = obj['zzes']
    }
    if (account && imgObj) {
      txb.moveCall({
        target: `${PACKAGEID}::my_zpet::transfer`,
        arguments: [
          txb.pure(imgObj.name),
          txb.pure(imgObj.url),
          txb.pure('赛博功德纪念NFT'),
          txb.pure(account.address)
        ]
      })
      mutate(
        {
          transactionBlock: txb
        },
        {
          onError: (err) => {
            toast.error(err.message)
          },
          onSuccess: (result) => {
            toast.success(`赛博功德纪念NFT领取成功: ${result.digest}`)
          },
        }
      )
    }

  }
  return (
    <div className="game-block" onMouseDown={doIt} onMouseUp={cancelIt}>
      <img className="muyu" src={muyu} />
      { showGun && (<img className="gun" src={muyugun} />) }
      <div className="gd">赛博功德：{num}</div>
      {
        showToast && (<h1 className="gd-toast">赛博功德加一</h1>)
      }
    </div>
  );
}
