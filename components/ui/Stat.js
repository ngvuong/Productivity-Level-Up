import { useState, useEffect } from 'react';

import styles from '../../styles/Stat.module.scss';

export default function Stat({ stat, label }) {
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
      <span className={change ? styles.change : undefined}>
        {current} {label + (current !== 1 ? 's' : '')}
      </span>
      <span className={change ? styles.change : undefined}>
        {stat} {label + (stat !== 1 ? 's' : '')}
      </span>
    </div>
  );
}
