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
  const [percentage, setPercentage] = useState(newPercentage);
  const [levelUp, setLevelUp] = useState(0);

  useEffect(() => {
    if (level !== currentLevel) {
      if (levelUp) {
        setPercentage(100);

        const timeout = setTimeout(() => {
          setPercentage(0);
          setLevelUp((prev) => --prev);
          setCurrentLevel((prev) => ++prev);
        }, 2100);

        return () => clearTimeout(timeout);
      } else setLevelUp(level - currentLevel);
    } else setPercentage(newPercentage);
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
        <div className={styles.streak}>Non-Zero Streak: {streak}</div>
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
          <span>{`${exp - expMin}/${expReq} (${percentage}%)`}</span>
          <span>{expMin + expReq}</span>
        </div>
      </div>
      {/* <button onClick={() => dispatch({ type: 'SET_EXP', exp: 550 })}>
        click
      </button> */}
    </div>
  );
}
