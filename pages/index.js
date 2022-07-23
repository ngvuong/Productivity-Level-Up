import { useState } from 'react';
import { getSession } from 'next-auth/react';
import router from 'next/router';
import Head from 'next/head';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

import styles from '../styles/Welcome.module.scss';

export default function Welcome({ user }) {
  const [isLogin, setIsLogin] = useState(true);

  if (user) {
    router.replace('/home');
  } else {
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
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (session) {
//     return {
//       redirect: {
//         destination: '/home',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
