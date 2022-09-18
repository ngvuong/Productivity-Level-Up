import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTimer } from '../../contexts/timerContext';

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
import Clock from './Clock';

export default function Navbar() {
  const [{ time, run }] = useTimer();

  return (
    <>
      <nav className={styles.navbar}>
        <Link href='/home'>
          <a draggable='false'>
            <RiHome4Fill />
          </a>
        </Link>
        <Link href='/pomodoro'>
          <a draggable='false'>
            {run ? <Clock time={time} /> : <RiTimerFill />}
          </a>
        </Link>
        <Link href='/garden'>
          <a draggable='false'>
            <RiPlantFill />
          </a>
        </Link>
        <Link href='/todo'>
          <a draggable='false'>
            <RiCalendarTodoFill />
          </a>
        </Link>
        <Link href='/stats'>
          <a draggable='false'>
            <RiNumbersFill />
          </a>
        </Link>
        <Link href='/settings'>
          <a draggable='false'>
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
