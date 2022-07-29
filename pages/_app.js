import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '../contexts/userContext';
import { SWRConfig } from 'swr';
import Layout from '../components/layout/Layout';

import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <SWRConfig
          value={{
            fetcher: (...args) => fetch(...args).then((res) => res.json()),
            errorRetryCount: 3,
            revalidateOnMount: false,
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SWRConfig>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
