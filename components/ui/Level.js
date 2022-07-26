import styles from '../../styles/Level.module.scss';

export default function Level({ user }) {
  const percent = +((user.exp / user.expNext) * 100).toFixed(2);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.level}>Level {user.level} </div>
        <div className={styles.streak}>
          Current Non-Zero Streak: {user.streak}
        </div>
      </div>
      <div className={styles.exp}>
        <div className={styles.expBar}>
          <div className={styles.expBarFill}>
            <style jsx>{`
              div {
                width: ${percent}%;
                border: ${percent === 0 ? 'none' : '.1rem solid #c1a'};
                border-radius: ${percent >= 100 ? '1rem' : '1rem 0 0 1rem'};
              }
            `}</style>
          </div>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>{`${user.exp}/${user.expNext} (${percent}%)`}</span>
      </div>
    </div>
  );
}
