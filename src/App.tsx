import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Box, Container, Flex, Heading } from '@radix-ui/themes'
import { WalletStatus } from './WalletStatus'
import { ToastContainer } from 'react-toastify'
import './css/index.css'
import 'react-toastify/dist/ReactToastify.css'
function App() {
  const account = useCurrentAccount();
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
          <Heading className="app-title">链上功德</Heading>
        </Box>

        <Box>
          <ConnectButton className="wallet-btn" connectText="接受赛博佛光" />
        </Box>
      </Flex>
      {account ? 
        (<Container>
          <Container
            mt="5"
            pt="2"
            px="4"
            style={{ background: "linear-gradient(to right, #ffffff05, #ffeb000f)", minHeight: 500 }}
          >
            <WalletStatus />
          </Container>
        </Container>) : (
          <div className="error-info">赛博佛光还未到达</div>
        )
      }
    </>
  );
}

export default App;
