import { useState, useEffect } from 'react';
import Stat from '../ui/Stat';
import Session from './Session';
import usePomodoros from '../../hooks/usePomodoros';
import { useUser } from '../../contexts/userContext';

import { GiFruitTree } from 'react-icons/gi';
import styles from '../../styles/Plum.module.scss';

export default function Plum({ userId, date }) {
  const [plum, setPlum] = useState();
  const [claim, setClaim] = useState(false);

  const [{ exp: currentExp }, dispatch] = useUser();

  const { pomodoros, setPomodoros } = usePomodoros(userId, date);

  const {
    claimedTime = 0,
    claimedExp = 0,
    unclaimedTime = 0,
    unclaimedExp = 0,
    unclaimedBonus = 0,
  } = plum || {};

  const scale = (mult) => 1 + Math.floor(claimedTime / 5) * mult;

  const transform = `scale(${scale(0.005)}, ${scale(0.01)})`;

  useEffect(() => {
    if (pomodoros) {
      setPlum(
        pomodoros.reduce((acc, { claimed, duration, exp, bonus }) => {
          const {
            claimedTime = 0,
            claimedExp = 0,
            unclaimedTime = 0,
            unclaimedExp = 0,
            unclaimedBonus = 0,
          } = acc;
          const minutes = duration / 60;

          if (claimed) {
            acc.claimedTime = claimedTime + minutes;
            acc.claimedExp = +(claimedExp + exp + bonus).toFixed(2);
          } else {
            acc.unclaimedTime = unclaimedTime + minutes;
            acc.unclaimedExp = +(unclaimedExp + exp).toFixed(2);
            acc.unclaimedBonus = +(unclaimedBonus + bonus).toFixed(2);
          }

          return acc;
        }, {})
      );
    }
  }, [pomodoros]);

  const claimTime = async (session) => {
    const { id, exp, bonus } = session || {
      id: 'date',
      exp: unclaimedExp,
      bonus: unclaimedBonus,
    };
    const body = !session && JSON.stringify({ date });
    const result = await fetch(`api/pomodoros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      ...(body && { body }),
    }).then((res) => res.json());

    if (result.error) console.error(result.error);

    if (!claim || claim.exp) {
      const { exp, bonus } = claim.exp ? claim : session;

      setExp({ exp, bonus });

      const expGained = +(currentExp + exp + bonus).toFixed(2);

      dispatch({ type: 'SET_EXP', exp: expGained });
    }
  };

  return (
    <div className={styles.plum}>
      {plum && (
        <div className={styles.stats}>
          <Stat stat={unclaimedTime} label='available minute' />
          <Stat stat={claimedTime} label='claimed minute' />
          <Stat stat={claimedExp} label='gained exp' singular />
        </div>
      )}

      <button onClick={() => (!claim ? setClaim(true) : null)} disabled={claim}>
        CLAIM ALL
      </button>

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
                    i === 0 && { exp: unclaimedExp, bonus: unclaimedBonus }) ||
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
