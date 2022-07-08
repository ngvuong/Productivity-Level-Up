import Head from 'next/head';

import styles from '../../styles/Layout.module.scss';

export default function Layout(children) {
  return (
    <>
      <Head>
        <title>Productivity Level Up</title>
        <meta
          name='description'
          content='A simple experience tracker, level up your productivity'
        />
        <meta
          name='keywords'
          content='web development, nextjs, productivity, level up, experience, tracker, time, pomodoro'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>{children}</div>
    </>
  );
}
