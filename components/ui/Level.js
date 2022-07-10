import { useState } from 'react';
import styles from '../../styles/Level.module.scss';

export default function Level() {
  const [p, setP] = useState(90);
  return (
    <div className={styles.container}>
      <div className={styles.level}>Level 1</div>
      <div className={styles.exp}>
        <div className={styles.expBar}>
          <div
            className={styles.expBarFill}
            style={{
              width: `${p}%`,
              borderRadius: `${p >= 100 ? '1rem' : '1rem 0 0 1rem'}`,
            }}
          />
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>50/100 ({p + '%'})</span>
      </div>
    </div>
  );
}
