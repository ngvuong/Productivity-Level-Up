import { useState, useEffect } from 'react';

import styles from '../../styles/Stat.module.scss';

export default function Stat({ stat, label, pluralize = true }) {
  const [current, setCurrent] = useState(stat);
  const [change, setChange] = useState(false);

  useEffect(() => {
    if (stat !== current) {
      setChange(true);

      const timeout = setTimeout(() => {
        setChange(false);

        setCurrent(stat);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [stat, current]);

  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>
        <span className={change ? styles.change : undefined}>{current}</span>
        <span className={change ? styles.change : undefined}>{stat}</span>
      </div>

      <span className={styles.statLabel}>
        {label + (stat !== 1 && pluralize ? 's' : '')}
      </span>
    </div>
  );
}
