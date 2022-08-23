import { createContext, useContext, cloneElement } from 'react';
import { useSession } from 'next-auth/react';
import Overlay from '../components/layout/Overlay';
import Spinner from '../components/layout/Spinner';

const userContext = createContext();

export function UserProvider({ children }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Overlay>
        <Spinner />
      </Overlay>
    );
  }

  const value = {
    user: status === 'authenticated' ? session.user : undefined,
    status,
  };

  return (
    <userContext.Provider value={value}>
      {cloneElement(children, { user: value.user })}
    </userContext.Provider>
  );
}

export function useUser() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
