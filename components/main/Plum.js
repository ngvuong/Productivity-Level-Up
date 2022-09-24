import { useState, useEffect } from 'react';
import Stat from '../ui/Stat';
import Session from './Session';
import usePomodoros from '../../hooks/usePomodoros';

import { GiFruitTree } from 'react-icons/gi';
import styles from '../../styles/Plum.module.scss';

export default function Plum({ userId, date }) {
  const [plum, setPlum] = useState({
    timeAvailable: 0,
    timeClaimed: 0,
    expGained: 0,
    unClaimedExp: 0,
    unClaimedBonus: 0,
  });
  const [claim, setClaim] = useState(false);

  const { pomodoros, setPomodoros } = usePomodoros(userId, date);

  const {
    timeAvailable,
    timeClaimed,
    expGained,
    unClaimedExp,
    unClaimedBonus,
  } = plum;

  const transform = `scale(${1 + Math.floor(timeClaimed / 5) * 0.005}, ${
    1 + Math.floor(timeClaimed / 5) * 0.01
  })`;

  useEffect(() => {
    if (pomodoros) {
      const init = {
        timeAvailable: 0,
        timeClaimed: 0,
        expGained: 0,
        unClaimedExp: 0,
        unClaimedBonus: 0,
      };

      const plum = pomodoros.reduce((acc, curr) => {
        const { claimed, duration, exp, bonus } = curr;

        if (claimed) {
          acc.timeClaimed += duration / 60;
          acc.expGained += exp + bonus;
          acc.expGained = +acc.expGained.toFixed(2);
        } else {
          acc.timeAvailable += duration / 60;
          acc.unClaimedExp += exp;
          acc.unClaimedExp = +acc.unClaimedExp.toFixed(2);
          acc.unClaimedBonus += bonus;
          acc.unClaimedBonus = +acc.unClaimedBonus.toFixed(2);
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
          <Stat stat={timeAvailable} label='available minute' />
          <Stat stat={timeClaimed} label='claimed minute' />
          <Stat stat={expGained} label='gained exp' pluralize={false} />
        </div>
      )}

      <button onClick={() => setClaim(true)}>CLAIM ALL</button>

      {pomodoros && (
        <div className={styles.sessions}>
          {pomodoros
            .filter((pomo) => !pomo.claimed)
            .map((pomo, i) => (
              <Session
                key={pomo.id}
                session={pomo}
                claim={
                  (claim &&
                    i === 0 && { exp: unClaimedExp, bonus: unClaimedBonus }) ||
                  claim
                }
                setPomodoros={setPomodoros}
              />
            ))}
        </div>
      )}

      <div className={styles.plant} style={{ transform }}>
        <svg width='0' height='0'>
          <linearGradient id='gradient' x1='0%' y1='100%' x2='0%' y2='50%'>
            <stop stopColor='#742' offset='0%' />
            <stop stopColor='#9ea' offset='100%' />
          </linearGradient>
        </svg>

        <GiFruitTree style={{ fill: 'url(#gradient)' }} />
      </div>
    </div>
  );
}
