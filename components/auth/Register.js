import { FaGithub, FaGoogle, FaFacebook, FaSignInAlt } from 'react-icons/fa';
import styles from '../../styles/Register.module.scss';

export default function Register({ setIsLogin }) {
  return (
    <div className={styles.register}>
      <h2>Sign Up</h2>
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
      <button className={styles.login} onClick={() => setIsLogin(true)}>
        <FaSignInAlt />
        Log in
      </button>
    </div>
  );
}
