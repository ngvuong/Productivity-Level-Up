import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '../contexts/userContext';
import Layout from '../components/layout/Layout';

import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
