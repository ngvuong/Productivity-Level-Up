import { createContext, useReducer, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import Overlay from '../components/layout/Overlay';
import Spinner from '../components/layout/Spinner';

const userContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LEVEL':
      return {
        ...state,
        level: action.level,
        change: 'level',
      };
    case 'SET_EXP':
      return {
        ...state,
        exp: action.exp,
        change: 'exp',
      };
    case 'SET_STREAK':
      return {
        ...state,
        streak: action.streak,
        change: 'streak',
      };
    case 'SET_USER':
      return {
        ...action.user,
      };
    case 'CLEAR_CHANGE':
      return {
        ...state,
        change: '',
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export function UserProvider({ children }) {
  const { data: session, status } = useSession();

  const [state, dispatch] = useReducer(userReducer, {});

  useEffect(() => {
    if (session) {
      dispatch({ type: 'SET_USER', user: session.user });
    }
  }, [session]);

  useEffect(() => {
    if (state.change && state.id) {
      const update = async () => {
        console.log(state.change, state[state.change]);
        const result = await fetch(`api/user/${state.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [state.change]: state[state.change],
          }),
        }).then((res) => res.json());

        if (result.error) console.error(result.error);

        if (result.success) dispatch({ type: 'CLEAR_CHANGE' });
      };

      update();
    }
  }, [state]);

  if (status === 'loading') {
    return (
      <Overlay>
        <Spinner />
      </Overlay>
    );
  }

  const value = [
    status === 'authenticated' ? session.user : undefined,
    dispatch,
  ];

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
