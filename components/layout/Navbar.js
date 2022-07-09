import Link from 'next/link';

import {
  RiHome4Fill,
  RiTimerFill,
  RiPlantFill,
  RiBarChartFill,
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
        <Link href='/timer'>
          <a>
            <RiTimerFill />
          </a>
        </Link>
        <Link href='/garden'>
          <a>
            <RiPlantFill />
          </a>
        </Link>
        <Link href='/stats'>
          <a>
            <RiBarChartFill />
          </a>
        </Link>
        <Link href='/settings'>
          <a>
            <RiSettings5Fill />
          </a>
        </Link>
        <button>
          <RiLogoutBoxFill />
        </button>
      </nav>
    </>
  );
}
