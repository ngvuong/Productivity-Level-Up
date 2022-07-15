import styles from '../../styles/Login.module.scss';

export default function Login() {
  return (
    <form className={styles.login}>
      <h2>Log In</h2>
      <hr />
      <label>
        <span>Email</span>
        <input type='email' />
      </label>
    </form>
  );
}
