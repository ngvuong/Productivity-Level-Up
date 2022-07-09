import Head from 'next/head';

import styles from '../styles/Welcome.module.scss';

export default function Welcome() {
  return (
    <div className={styles.welcome}>
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
    </div>
  );
}
