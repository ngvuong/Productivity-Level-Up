import { useEffect, cloneElement } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Overlay from './Overlay';
import Spinner from './Spinner';
import Navbar from '../ui/Navbar';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Layout.module.scss';

export default function Layout({ children }) {
  const { user, status } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' && router.pathname !== '/') {
      router.replace('/');
    }

    if (status === 'authenticated' && router.pathname === '/') {
      router.replace('/home');
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <Overlay>
        <Spinner />
      </Overlay>
    );
  }

  return (
    <>
      <Head>
        <title>Plum Tracker</title>
        <meta
          name='description'
          content='A simple experience tracker, level up your productivity'
        />
        <meta
          name='keywords'
          content='web development, nextjs, productivity, level up, experience, exp tracker, time, pomodoro, plum, productivity level up mate'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.container}>
        {router.pathname !== '/'
          ? user && cloneElement(children, { user })
          : status === 'unauthenticated' && children}
      </div>
      {user && <Navbar />}
    </>
  );
}
