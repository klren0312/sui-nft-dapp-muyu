import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import type { SuiObjectResponse } from '@mysten/sui/client'
import { Avatar, Box, Card, Flex, Heading, Text } from '@radix-ui/themes'
import { UpdateIcon } from '@radix-ui/react-icons'
import { useNetworkVariable } from './utils/networkConfig'
import Event from './utils/event'

export function OwnedObjects() {
  const packageId = useNetworkVariable('packageId')
  const account = useCurrentAccount()
  if (!account) {
    return
  }
  const { data, isPending, error, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address as string,
      options: {
        showType: true,
        showDisplay: true,
        showContent: true
      },
      filter: {
        MatchAll: [
          {
            StructType: `${packageId}::gdNft::Gd`,
          },
          {
            AddressOwner: account?.address || '',
          },
        ],
      },
    },
    {
      enabled: !!account,
    }
  );
  // 监听刷新事件
  Event.on('Event:Refresh', () => {
    refetch()
  })

  let nfts: SuiObjectResponse[] = []
  
  if (!account) {
    return;
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return <Flex>正在连线佛祖...</Flex>;
  }

  if (data) {
    const arr = data.data.filter(item => item.data?.type === `${packageId}::gdNft::Gd`)
    // 查找记录本
    const recordBook = arr.find(item => item.data?.display?.data?.type === '0')
    if (recordBook) {
      Event.emit('Event:RecordBook', recordBook)
    }
    nfts = arr
    console.log(arr)
  }

  return (
    <Flex className="nft-list" direction="column" my="2">
      <Heading size="4" className="conn-text">
        <span>功德记录</span>
        <UpdateIcon className="refresh-btn" onClick={() => refetch()} width="16" height="16" />
      </Heading>
      <Flex >
      {nfts.map((object) => (
        <Card key={object.data?.objectId} style={{ minWidth: 150, maxWidth: 150 }}>
          <Flex gap="5" align="center" direction="column">
            <Avatar
              size="6"
              src={object.data?.display?.data?.image_url}
              radius="large"
              fallback="A"
            />
            <Box>
              <Text as="div" size="2" weight="bold" align={'center'}>
                { object.data?.display?.data?.name }
              </Text>
              <Text as="div" size="2" color="gray" align={'center'}>
                { object.data?.display?.data?.description }
              </Text>
            </Box>
          </Flex>
        </Card>
      ))}
      </Flex>
    </Flex>
  );
}
