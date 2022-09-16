import { useState, useEffect } from 'react';
import Stat from '../ui/Stat';
import Session from './Session';
import usePomodoros from '../../hooks/usePomodoros';

import { GiFruitTree } from 'react-icons/gi';
import styles from '../../styles/Plum.module.scss';

export default function Plum({ userId, date }) {
  const [plum, setPlum] = useState();

  const { pomodoros, setPomodoros } = usePomodoros(userId, date, {
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (pomodoros) {
      const init = { timeAvailable: 0, timeClaimed: 0, expGained: 0 };

      const plum = pomodoros.reduce((acc, curr) => {
        if (curr.claimed) {
          acc.timeClaimed += curr.duration / 60;

          acc.expGained += curr.expGained;
        } else {
          acc.timeAvailable += curr.duration / 60;
        }

        return acc;
      }, init);

      setPlum(plum);
    }
  }, [pomodoros]);

  return (
    <div className={styles.plum}>
      {plum && (
        <div className={styles.stats}>
          <Stat stat={plum.timeAvailable} label='available minute' />
          <Stat stat={plum.timeClaimed} label='claimed minute' />
          <Stat stat={plum.expGained} label='gained exp' pluralize={false} />
        </div>
      )}

      {pomodoros && (
        <div className={styles.sessions}>
          {pomodoros
            .filter((pomo) => !pomo.claimed)
            .map((pomo) => (
              <Session
                key={pomo.id}
                session={pomo}
                // timeClaimed={timeClaimed}
                // setTimeClaimed={setTimeClaimed}
                setPomodoros={setPomodoros}
              />
            ))}
        </div>
      )}

      <div className={styles.plant}>
        <svg width='0' height='0'>
          <linearGradient id='gradient' x1='0%' y1='100%' x2='0%' y2='50%'>
            <stop stopColor='#742' offset='0%' />
            <stop stopColor='#9ea' offset='100%' />
          </linearGradient>
        </svg>
        <GiFruitTree
          style={{
            fill: 'url(#gradient)',
            transform: `scale(${1 + Math.floor(plum?.timeClaimed / 5) * 0.01})`,
          }}
        />
      </div>
    </div>
  );
}
