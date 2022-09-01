import { useState } from 'react';
import { useUser } from '../../contexts/userContext';

import { MdWbSunny } from 'react-icons/md';
import styles from '../../styles/Session.module.scss';

export default function Session({ session }) {
  const [claimed, setClaimed] = useState(false);

  const [user, dispatch] = useUser();

  const minutes = session.duration / 60;
  const size = 2 + minutes / 10;

  const onClaim = async () => {
    // const result = await fetch(`api/pomodoros/${session.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    // }).then((res) => res.json());
    // if (result.error) console.error(result.error);

    dispatch({ type: 'SET_EXP', exp: user.exp + 50 });
    setClaimed(true);
  };

  return (
    <div
      className={styles.session}
      onClick={onClaim}
      style={{
        top: claimed
          ? '110%'
          : `min(${Math.floor(Math.random() * 101)}%, 100% - ${size / 2}rem)`,
        left: claimed
          ? `calc(50% - ${size / 2}rem)`
          : `min(${Math.floor(Math.random() * 101)}%, 100% - ${size / 2}rem)`,
        fontSize: `${size}rem`,
        animationDelay: `${Math.floor(Math.random() * 2001)}ms`,
      }}
    >
      <MdWbSunny />
    </div>
  );
}
