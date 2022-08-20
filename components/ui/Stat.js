import styles from '../../styles/Stat.module.scss';

export default function Stat({ stat, label }) {
  return (
    <div className={styles.stat}>
      {stat} {label + (stat !== 1 ? 's' : '')}
    </div>
  );
}
