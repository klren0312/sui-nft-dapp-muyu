import { useCurrentAccount } from '@mysten/dapp-kit';
import { Container, Flex, Text } from '@radix-ui/themes';
import { OwnedObjects } from './OwnedObjects';
import { GameBlock } from './GameBlock';

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <Container my="2">
      {account ? (
        <Flex direction="row">
          <Text className="conn-text">正在接受赛博佛光普照</Text>
        </Flex>
      ) : (
        <Text>无法接受赛博佛光普照</Text>
      )}
      <Flex justify="between">
        <OwnedObjects />
        <Flex align="center" justify="center">
          <GameBlock />
        </Flex>
      </Flex>
    </Container>
  );
}
