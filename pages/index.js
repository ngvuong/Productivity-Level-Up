import { useState } from 'react';
import Head from 'next/head';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

import styles from '../styles/Welcome.module.scss';

export default function Welcome() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className={styles.welcome}>
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

      <section className={styles.intro}>
        <h1>Plum</h1>
        <h2>Productivity Level Up Mate</h2>
        <p>
          Level up your productivity game today with time and experience
          tracking. Tend to your garden and grow your plum trees.
        </p>
      </section>
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Register setIsLogin={setIsLogin} />
      )}
    </main>
  );
}
