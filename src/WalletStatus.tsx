import { Container, Flex } from '@radix-ui/themes';
import { OwnedObjects } from './OwnedObjects';
import { GameBlock } from './GameBlock';

export function WalletStatus() {
  return (
    <Container my="2">
        <Flex justify="between">
          <OwnedObjects />
          <Flex align="center" justify="center">
            <GameBlock />
          </Flex>
        </Flex>
    </Container>
  );
}
