import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContext';

import { MdWbSunny } from 'react-icons/md';
import styles from '../../styles/Session.module.scss';

export default function Session({ session, timeClaimed, setTimeClaimed }) {
  const [claimed, setClaimed] = useState(false);
  const [random, setRandom] = useState(Math.random());
  //   top: Math.floor(Math.random() * 101),
  //   left: Math.floor(Math.random() * 101),
  // });

  const [user, dispatch] = useUser();

  const minutes = session.duration / 60;
  const size = 1 + minutes / 20;

  useEffect(() => {
    const interval = setInterval(
      (function randomize() {
        setRandom(Math.random());

        return randomize;
      })(),
      30000
    );

    return () => clearInterval(interval);
  }, []);
  // const calculateExp = () => {
  //   for (let i = 1; i <= minutes; i++) {}
  // };

  const onClaim = async () => {
    // setTimeClaimed(timeClaimed + minutes)
    setClaimed(true);
    // dispatch({ type: 'SET_EXP', exp: user.exp + 50 });
    // const result = await fetch(`api/pomodoros/${session.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    // }).then((res) => res.json());
    // if (result.error) console.error(result.error);
  };

  const getRandInt = (min = 0, max = 1) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const pulseAnimation = `
    @keyframes pulse {
      50% {
        transform: scale(${+(random * 0.5).toFixed(2) + 1}) 
        rotate(${getRandInt(360) * (getRandInt() ? 1 : -1)}deg);
      }
      100% {
        transform: scale(1) 
        rotate(0);
      }
    }
  `;

  return (
    <>
      <style children={pulseAnimation} />
      <div
        className={styles.session}
        onClick={onClaim}
        style={{
          top: claimed ? '85%' : `min(${getRandInt(100)}% , 80% )`,
          left: claimed
            ? `calc(50% - ${size / 2}rem)`
            : `min(${getRandInt(100)}%, 100% - ${size}rem)`,
          fontSize: `${size}rem`,
          animation: `pulse 10s  alternate-reverse infinite`,
          transition: `all ${claimed ? 2 : 30}s cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      >
        <MdWbSunny />
      </div>
    </>
  );
}
