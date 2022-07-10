import Head from 'next/head';
import Navbar from './Navbar';

import styles from '../../styles/Layout.module.scss';

export default function Layout({ children }) {
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
      <div className={styles.container}>{children}</div>
      <Navbar />
    </>
  );
}
