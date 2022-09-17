import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/userContext';

import { MdWbSunny } from 'react-icons/md';
import styles from '../../styles/Session.module.scss';

export default function Session({ session, timeClaimed, setPomodoros }) {
  const [claimed, setClaimed] = useState();
  const [random, setRandom] = useState(Math.random());
  const [bonus, setBonus] = useState(0);

  const shimmerRef = useRef(false);

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

    const timeout = setTimeout(() => (shimmerRef.current = true), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const getRandInt = (max = 1, min = 0) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const calculateExp = () => {
    let { exp: expCurrent, expRate, level, expMin, expReq } = user;
    let exp = 0;
    let time = timeClaimed;
    let expBonus = 0;

    for (let i = 0; i < minutes; i++) {
      exp += expRate * (1 + Math.floor(time / 5) * 0.01);

      time++;

      expBonus += getRandInt(100, 1) > 95 ? level : 0;

      if (expCurrent + exp >= expMin + expReq) {
        level++;
        expRate = 1 + level / 5;
        expMin += expReq;
        expReq = Math.ceil(expReq * 1.1);
      }
    }

    setBonus(+expBonus.toFixed(2));

    return +exp.toFixed(2);
  };

  const onClaim = async () => {
    const expClaimed = calculateExp();

    setClaimed(expClaimed);

    const expGained = user.exp + expClaimed + bonus;

    // dispatch({ type: 'SET_EXP', exp: expGained });
    // const result = await fetch(`api/pomodoros/${session.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({expGained})
    // }).then((res) => res.json());

    // if (result.error) console.error(result.error);

    setPomodoros();
  };

  const animation = claimed
    ? `
    @keyframes spin {
      25% {
        transform: scale(1.5) rotate(720deg);
        opacity: 1;
      }
      50% {opacity:.5;}
    }
  `
    : `
    @keyframes shimmer {
      5% {opacity: .5;}
      15% { opacity: 1;}
      50% {
        transform: scale(${+(random * 0.5).toFixed(2) + 1}) 
        rotate(${getRandInt(360) * (getRandInt() ? 1 : -1)}deg);
        opacity: .75;
      }
      75% { opacity: 1;}
      100% {
        transform: scale(1) rotate(0) opacity(.5);
      }
    }
  `;

  return (
    <>
      <style children={animation} />
      <div
        className={styles.session}
        onClick={onClaim}
        style={{
          top: claimed ? '105%' : `${getRandInt(100)}%`,
          left: claimed
            ? `calc(50% - ${size / 2}rem)`
            : `min(${getRandInt(100)}%, 100% - ${size}rem)`,
          fontSize: `${size}rem`,
          animation: claimed
            ? 'spin 2s'
            : `shimmer ${
                [5, 10, 15, 30][getRandInt(3)]
              }s alternate-reverse infinite`,
          opacity: shimmerRef.current ? random : 0,
          ...(claimed && {
            filter: 'contrast(2)',
            opacity: '1',
            visibility: 'hidden',
          }),
          transition: `all ${claimed ? 2 : 30}s cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      >
        <MdWbSunny />
      </div>
      {claimed && <span className={styles.exp}>+{claimed} exp</span>}
      {bonus !== 0 && <span className={styles.bonus}>bonus {bonus} exp</span>}
    </>
  );
}
