import { useState, useEffect } from 'react';

import styles from '../../styles/Stat.module.scss';

export default function Stat({ stat, label, singular = false }) {
  const [current, setCurrent] = useState(stat);
  const [change, setChange] = useState(false);

  useEffect(() => {
    if (stat !== current) {
      setChange(true);

      const timeout = setTimeout(() => {
        setChange(false);
        setCurrent(stat);
      }, 210);

      return () => clearTimeout(timeout);
    }
  }, [stat, current]);

  return (
    <div className={`${styles.stat} ${label ? styles.full : ''}`}>
      <span className={change ? styles.change : undefined}>
        {current +
          (label ? ' ' + label + (current !== 1 && !singular ? 's' : '') : '')}
      </span>

      <span className={change ? styles.change : undefined}>
        {stat +
          (label ? ' ' + label + (stat !== 1 && !singular ? 's' : '') : '')}
      </span>
    </div>
  );
}
