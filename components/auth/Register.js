import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Overlay from '../layout/Overlay';
import Spinner from '../layout/Spinner';

import { FaGithub, FaGoogle, FaFacebook, FaSignInAlt } from 'react-icons/fa';
import styles from '../../styles/Register.module.scss';

export default function Register({ setIsLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = (method) => {
    setIsLoading(true);
    signIn(method);
  };

  return (
    <div className={styles.register}>
      {isLoading && (
        <Overlay>
          <Spinner />
        </Overlay>
      )}
      <h2>Sign Up</h2>
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
      <button className={styles.login} onClick={() => setIsLogin(true)}>
        <FaSignInAlt />
        Log in
      </button>
    </div>
  );
}
