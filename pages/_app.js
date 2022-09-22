import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '../contexts/userContext';
import { SettingsProvider } from '../contexts/settingsContext';
import { TimerProvider } from '../contexts/timerContext';
import Layout from '../components/layout/Layout';

import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
          errorRetryCount: 3,
        }}
      >
        <UserProvider>
          <SettingsProvider>
            <TimerProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </TimerProvider>
          </SettingsProvider>
        </UserProvider>
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
