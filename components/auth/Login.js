import {
  FaGithub,
  FaGoogle,
  FaFacebook,
  FaUserPlus,
  FaUser,
} from 'react-icons/fa';
import styles from '../../styles/Login.module.scss';

export default function Login({ setIsLogin }) {
  return (
    <div className={styles.login}>
      <h2>Log In</h2>
      <hr />
      <div className={styles.loginBtns}>
        <button className={styles.github}>
          <FaGithub />
          GitHub
        </button>
        <button className={styles.google}>
          <FaGoogle />
          Google
        </button>
        <button className={styles.facebook}>
          <FaFacebook />
          Facebook
        </button>
      </div>
      <span>
        <hr />
        Or
        <hr />
      </span>
      <button className={styles.signup} onClick={() => setIsLogin(false)}>
        <FaUserPlus />
        Sign up
      </button>
      <button className={styles.demo}>
        <FaUser />
        Try Demo
      </button>
    </div>
  );
}
