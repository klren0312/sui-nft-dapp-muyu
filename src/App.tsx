import { ConnectButton } from '@mysten/dapp-kit'
import { Box, Container, Flex, Heading } from '@radix-ui/themes'
import { WalletStatus } from './WalletStatus'
import { ToastContainer } from 'react-toastify'
import './css/index.css'
import 'react-toastify/dist/ReactToastify.css'
function App() {
  return (
    <>
      <ToastContainer closeButton={false} position="top-center" autoClose={1000} theme="dark" />
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>链上功德</Heading>
        </Box>

        <Box>
          <ConnectButton connectText="连接钱包, 接受赛博佛光" />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
        </Container>
      </Container>
    </>
  );
}

export default App;
