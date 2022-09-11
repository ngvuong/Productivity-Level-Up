import Link from 'next/link';
import Image from 'next/image';
import Level from '../components/ui/Level';
import Overview from '../components/main/Overview';

import { FaUser } from 'react-icons/fa';
import styles from '../styles/Home.module.scss';

export default function Home({ user }) {
  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <h1>PLUM</h1>
            <h3>Productivity Level Up Mate</h3>
          </div>
          <Link href='/todo'>
            <a className={styles.user}>
              {user.image ? (
                <Image
                  src={user.image}
                  width='35'
                  height='35'
                  className={styles.avatar}
                  alt='Profile avatar'
                />
              ) : (
                <FaUser />
              )}
              {user.name || user.email}
            </a>
          </Link>
        </div>
        <Level />
      </header>
      <Overview user={user} />
    </main>
  );
}
