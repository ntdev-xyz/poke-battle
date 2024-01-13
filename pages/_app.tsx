// pages/_app.tsx

import '@radix-ui/themes/styles.css';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Theme, ThemePanel, Container, Flex } from '@radix-ui/themes';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      {/* <Theme appearance="dark"> */}
      <Theme appearance="light">
        <Flex align="center" justify="center">
          <Container p="5" size={{
            initial: "1",
            md: "4"
          }}>
            <Component {...pageProps} />
          </Container>
        </Flex>
        {/* <ThemePanel/> */}
      </Theme>
    </Provider>
  );
};

export default App;
