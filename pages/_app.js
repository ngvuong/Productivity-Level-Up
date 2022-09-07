import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '../contexts/userContext';
import { TimerProvider } from '../contexts/timerContext';
import { SWRConfig } from 'swr';
import Layout from '../components/layout/Layout';

import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
          errorRetryCount: 3,
          revalidateOnMount: false,
        }}
      >
        <UserProvider>
          <TimerProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </TimerProvider>
        </UserProvider>
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
