import { createContext, useReducer, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import Overlay from '../components/layout/Overlay';
import Spinner from '../components/layout/Spinner';

const userContext = createContext();

const userReducer = (state, action) => {
  const { type, user, exp, vExp, streak, streakDate } = action;

  switch (type) {
    case 'SET_EXP': {
      let { level, expRate, expMin, expReq } = state;
      let expNext = expMin + expReq;
      let levelUp = exp >= expNext;

      while (exp >= expNext) {
        level++;
        expRate = +(expRate + 0.2).toFixed(2);
        expMin = expNext;
        expReq = Math.ceil(+(expReq * 1.1).toFixed(2));
        expNext += expReq;
      }

      return {
        ...state,
        exp,
        ...(levelUp && { level, expRate, expMin, expReq }),
        change: true,
      };
    }
    case 'SET_VIRTUAL_EXP': {
      let { vLevel, vExpRate, vExpMin, vExpReq } = state;
      let expNext = vExpMin + vExpReq;
      let levelUp = vExp >= expNext;

      while (vExp >= expNext) {
        vLevel++;
        vExpRate = +(vExpRate + 0.2).toFixed(2);
        vExpMin = expNext;
        vExpReq = Math.ceil(+(vExpReq * 1.1).toFixed(2));
        expNext += vExpReq;
      }

      return {
        ...state,
        vExp,
        ...(levelUp && { vLevel, vExpRate, vExpMin, vExpReq }),
        change: true,
      };
    }
    case 'SET_STREAK':
      return {
        ...state,
        streak: streak || 0,
        streakDate: streakDate || null,
        change: true,
      };
    case 'SET_USER':
      return user;
    case 'CLEAR_CHANGE':
      return {
        ...state,
        change: false,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export function UserProvider({ children }) {
  const { data: session, status } = useSession();

  const [state, dispatch] = useReducer(userReducer, { loading: true });

  useEffect(() => {
    if (status !== 'loading') {
      const user = session ? { ...session.user, loading: false } : undefined;

      dispatch({ type: 'SET_USER', user });
    }
  }, [session, status]);

  useEffect(() => {
    if (state && state.change) {
      (async function update() {
        const data = [
          'level',
          'vLevel',
          'exp',
          'vExp',
          'expRate',
          'vExpRate',
          'expMin',
          'vExpMin',
          'expReq',
          'vExpReq',
          'streak',
          'streakDate',
        ].reduce((a, c) => ((a[c] = state[c]), a), {});

        const body = JSON.stringify(data);

        const result = await fetch(`api/user/${state.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        }).then((res) => res.json());

        if (result.error) console.error(result.error);

        if (result.success) dispatch({ type: 'CLEAR_CHANGE' });
      })();
    }
  }, [state]);

  if (state && state.loading) {
    return (
      <Overlay>
        <Spinner />
      </Overlay>
    );
  }

  const value = [state, dispatch];

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
