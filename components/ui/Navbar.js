import { signOut } from 'next-auth/react';
import Link from 'next/link';

import {
  RiHome4Fill,
  RiTimerFill,
  RiPlantFill,
  RiCalendarTodoFill,
  RiNumbersFill,
  RiSettings5Fill,
  RiLogoutBoxFill,
} from 'react-icons/ri';
import styles from '../../styles/Navbar.module.scss';

export default function Navbar() {
  return (
    <>
      <nav className={styles.navbar}>
        <Link href='/home'>
          <a>
            <RiHome4Fill />
          </a>
        </Link>
        <Link href='/pomodoro'>
          <a>
            <RiTimerFill />
          </a>
        </Link>
        <Link href='/garden'>
          <a>
            <RiPlantFill />
          </a>
        </Link>
        <Link href='/todo'>
          <a>
            <RiCalendarTodoFill />
          </a>
        </Link>
        <Link href='/stats'>
          <a>
            <RiNumbersFill />
          </a>
        </Link>
        <Link href='/settings'>
          <a>
            <RiSettings5Fill />
          </a>
        </Link>
        <button onClick={signOut}>
          <RiLogoutBoxFill />
        </button>
      </nav>
    </>
  );
}
