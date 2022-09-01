import { useState, useEffect } from 'react';
import Session from '../ui/Session';
import usePomodoros from '../../hooks/usePomodoros';

import { RiSeedlingFill } from 'react-icons/ri';
import styles from '../../styles/Plum.module.scss';

export default function Plum({ userId, date }) {
  const [timeClaimed, setTimeClaimed] = useState();
  const { pomodoros } = usePomodoros(userId, date, {
    revalidateOnMount: true,
  });

  const timeAvailable =
    pomodoros &&
    pomodoros.reduce(
      (sum, curr) => (!curr.claimed ? sum + curr.duration : sum),
      0
    );

  // let timeClaimed =
  //   pomodoros &&
  //   pomodoros.reduce(
  //     (sum, curr) => (curr.claimed ? sum + curr.duration : sum),
  //     0
  //   );

  useEffect(() => {
    if (pomodoros) {
      setTimeClaimed(
        pomodoros.reduce(
          (sum, curr) => (curr.claimed ? sum + curr.duration : sum),
          0
        )
      );
    }
  }, []);

  return (
    <div className={styles.plum}>
      {timeAvailable !== undefined && (
        <h2>{timeAvailable / 60} Minutes Available</h2>
      )}

      {pomodoros && (
        <div className={styles.sessions}>
          {pomodoros
            .filter((pomo) => !pomo.claimed)
            .map((pomo) => (
              <Session key={pomo.id} session={pomo} />
            ))}
        </div>
      )}

      <div className={styles.plant}>
        <style jsx>{`
          div {
            transform: scale(${1 + Math.floor(timeClaimed / 1800) * 0.5});
          }
        `}</style>

        <RiSeedlingFill />
      </div>
      <button onClick={() => setTimeClaimed(timeClaimed + 1800)}>click</button>
    </div>
  );
}
