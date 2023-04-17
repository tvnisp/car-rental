import { useSession } from 'next-auth/react';
import React from 'react';

interface CurrentUser {
  name: string;
  email: string;
}

export const useCurrentUser = (): CurrentUser => {
  const { data } = useSession();

  return React.useMemo(() => {
    return {
      name: data?.user?.name || '',
      email: data?.user?.email || '',
    };
  }, [data]);
};
