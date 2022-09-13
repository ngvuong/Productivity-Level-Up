import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/userContext';

import { MdWbSunny } from 'react-icons/md';
import styles from '../../styles/Session.module.scss';

export default function Session({ session }) {
  const [claimed, setClaimed] = useState(false);
  const [random, setRandom] = useState({
    top: Math.floor(Math.random() * 101),
    left: Math.floor(Math.random() * 101),
  });

  const [user, dispatch] = useUser();

  const minutes = session.duration / 60;
  const size = 1 + minutes / 20;

  useEffect(() => {
    setRandom({
      top: Math.floor(Math.random() * 101),
      left: Math.floor(Math.random() * 101),
    });

    const interval = setInterval(() => {
      setRandom({
        top: Math.floor(Math.random() * 101),
        left: Math.floor(Math.random() * 101),
      });
    }, 20000);

    return () => clearInterval(interval);
  }, []);

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
        top: claimed ? '110%' : `min(${random.top}%, 100% - ${size / 2}rem)`,
        left: claimed
          ? `calc(50% - ${size / 2}rem)`
          : `min(${random.left}%, 100% - ${size / 2}rem)`,
        fontSize: `${size}rem`,
        transitionDelay: `${Math.floor(Math.random() * 1001)}ms`,
        animationDelay: `${Math.floor(Math.random() * 2001)}ms`,
      }}
    >
      <MdWbSunny />
    </div>
  );
}
