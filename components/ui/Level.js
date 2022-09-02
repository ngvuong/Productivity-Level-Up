import { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Level.module.scss';

export default function Level() {
  const [{ level, exp, expMin, expReq, streak, streakDate }, dispatch] =
    useUser();

  const [percent, setPercent] = useState(
    +(((exp - expMin) / expReq) * 100).toFixed(2)
  );

  useEffect(() => {
    const newPercent = +(((exp - expMin) / expReq) * 100).toFixed(2);

    if (percent === 100) {
      const timeout = setTimeout(() => setPercent(0), 2000);

      return () => clearTimeout(timeout);
    } else if (percent === 0) {
      const timeout = setTimeout(() => setPercent(newPercent), 500);

      return () => clearTimeout(timeout);
    } else if (newPercent < percent) {
      setPercent(100);
    } else setPercent(newPercent);
  }, [exp, expMin, expReq, percent]);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');

    if (today !== streakDate) {
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
        <div className={styles.level}>Level {level}</div>
        <div className={styles.streak}>Non-Zero Streak: {streak}</div>
      </div>
      <div className={styles.exp}>
        <div className={styles.expBar}>
          <div className={styles.expBarFill}>
            <style jsx>{`
              div {
                width: ${percent}%;
                border: ${percent === 0 ? 'none' : '.1rem solid #c1a'};
                border-radius: ${percent >= 100 ? '1rem' : '1rem 0 0 1rem'};
                transition: ${percent === 0 ? 'none' : 'all 2s'};
              }
            `}</style>
          </div>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>{`${exp - expMin}/${expReq} (${percent}%)`}</span>
      </div>
    </div>
  );
}
