import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import type { SuiObjectResponse } from '@mysten/sui.js/client'
import { Avatar, Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes'
import { PACKAGEID } from './constants';
import { UpdateIcon } from '@radix-ui/react-icons';

export function OwnedObjects() {
  const account = useCurrentAccount()
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
            StructType: `${PACKAGEID}::my_zpet::Zpet`,
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

  let nfts: SuiObjectResponse[] = []
  console.log(data)
  
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
    const arr = data.data.filter(item => item.data?.type === `${PACKAGEID}::my_zpet::Zpet`)
    nfts = arr
    console.log(arr)
  }

  return (
    <Flex className="nft-list" direction="column" my="2">
      {data.data.length === 0 ? (
        <Text>你还没有功德记录哦</Text>
      ) : (
        <Heading size="4" className="conn-text">
          <span>功德记录</span>
          <UpdateIcon className="refresh-btn" onClick={() => refetch()} width="16" height="16" />
        </Heading>
      )}
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
