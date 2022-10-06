import { useState, useRef, useEffect, useCallback } from 'react';
import { useUser } from '../../contexts/userContext';

import { ImArrowUp } from 'react-icons/im';
import { HiSun } from 'react-icons/hi';
import styles from '../../styles/Session.module.scss';

export default function Session({ session, claim, setPomodoros }) {
  const [claimed, setClaimed] = useState(false);
  const [exp, setExp] = useState({ exp: 0, bonus: 0 });
  const [random, setRandom] = useState(Math.random());

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
  console.log(claim);
  useEffect(() => {
    if (!claimed && claim) onClaim();
  }, [claimed, claim, onClaim]);

  useEffect(() => {
    if (claimed) {
      const timeout = setTimeout(() => setPomodoros(), 4000);

      return () => clearTimeout(timeout);
    }
  }, [claimed, setPomodoros]);

  // const onClaim = useCallback(async () => {
  //   setClaimed(true);

  //   const result = await fetch(`api/pomodoros/${session.id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //   }).then((res) => res.json());

  //   if (result.error) console.error(result.error);

  //   if (!claim || claim.exp) {
  //     const { exp, bonus } = claim.exp ? claim : session;

  //     setExp({ exp, bonus });

  //     const expGained = +(user.exp + exp + bonus).toFixed(2);

  //     dispatch({ type: 'SET_EXP', exp: expGained });
  //   }
  // }, [session, user, dispatch, claim]);

  const getRandInt = (max = 1, min = 0) =>
    Math.floor(Math.random() * (max - min + 1) + min);

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
      <style>{animation}</style>
      <div
        className={styles.session}
        onClick={onClaim}
        style={{
          top: claimed ? '100%' : `${getRandInt(80)}%`,
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
        <HiSun />
      </div>

      {claimed && (
        <>
          {exp.exp !== 0 && (
            <span className={styles.exp}>
              <ImArrowUp /> {exp.exp} EXP
            </span>
          )}

          {exp.bonus !== 0 && (
            <span className={styles.bonus}>
              <ImArrowUp /> {exp.bonus} BONUS EXP
            </span>
          )}
        </>
      )}
    </>
  );
}
