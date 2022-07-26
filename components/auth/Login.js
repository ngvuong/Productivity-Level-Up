import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Overlay from '../layout/Overlay';
import Spinner from '../layout/Spinner';

import {
  FaGithub,
  FaGoogle,
  FaFacebook,
  FaUserPlus,
  FaUser,
} from 'react-icons/fa';
import styles from '../../styles/Login.module.scss';

export default function Login({ setIsLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = (method) => {
    setIsLoading(true);
    signIn(method);
  };

  return (
    <div className={styles.login}>
      {isLoading && (
        <Overlay>
          <Spinner />
        </Overlay>
      )}
      <h2>Log In</h2>
      <span>
        <hr />
        With
        <hr />
      </span>
      <div className={styles.loginBtns}>
        <button className={styles.github} onClick={() => onSignIn('github')}>
          <FaGithub />
          GitHub
        </button>
        <button className={styles.google} onClick={() => onSignIn('google')}>
          <FaGoogle />
          Google
        </button>
        <button
          className={styles.facebook}
          onClick={() => onSignIn('facebook')}
        >
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
