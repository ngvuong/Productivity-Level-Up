import { useState, useEffect } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import Stat from './Stat';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Level.module.scss';

export default function Level() {
  const [{ level, exp, expMin, expReq, streak, streakDate }, dispatch] =
    useUser();

  const newPercentage = +(((exp - expMin) / expReq) * 100).toFixed(2);

  const [currentLevel, setCurrentLevel] = useState(level);
  const [levelUp, setLevelUp] = useState(0);
  const [percentage, setPercentage] = useState(newPercentage);

  useEffect(() => {
    if (level !== currentLevel) {
      if (levelUp) {
        let timeout;

        setPercentage((prev) => {
          if (prev) return 100;

          timeout = setTimeout(() => setPercentage(100), 500);

          return prev;
        });

        const timeout2 = setTimeout(() => {
          setPercentage(0);
          setLevelUp((prev) => --prev);
          setCurrentLevel((prev) => ++prev);
        }, 2500);

        return () => [timeout, timeout2].forEach(clearTimeout);
      } else setLevelUp(level - currentLevel);
    } else {
      const timeout = setTimeout(() => setPercentage(newPercentage), 500);

      return () => clearTimeout(timeout);
    }
  }, [level, currentLevel, levelUp, newPercentage]);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');

    if (streakDate && streakDate !== today) {
      const streakNextDay = format(
        addDays(parseISO(streakDate), 1),
        'yyyy-MM-dd'
      );

      if (today !== streakNextDay) dispatch({ type: 'SET_STREAK' });
    }
  }, [streakDate, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.level}>
          Level <Stat stat={currentLevel} />
        </div>
        <div className={styles.streak}>
          Non-Zero Streak: <Stat stat={streak} />
        </div>
      </div>
      <div className={styles.exp}>
        <div className={styles.expBar}>
          <div className={styles.expBarFill}>
            <style jsx>{`
              div {
                width: ${percentage}%;
                border: ${percentage === 0 ? 'none' : '.5px solid #bff'};
                border-radius: ${percentage >= 100 ? '1rem' : '1rem 0 0 1rem'};
                transition: ${percentage === 0 ? 'none' : 'all 2s'};
              }
            `}</style>
          </div>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={styles.expInfo}>
          <span>{exp}</span>
          <span>{`${+(exp - expMin).toFixed(
            2
          )}/${expReq} (${percentage}%)`}</span>
          <span>{expMin + expReq}</span>
        </div>
      </div>
    </div>
  );
}
