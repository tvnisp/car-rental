import type { NextPage } from 'next';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';

const Protected: NextPage = (): JSX.Element => {
  const { status } = useSession();
  const { name, email } = useCurrentUser();

  React.useEffect(() => {
    if (status === 'unauthenticated') Router.replace('/auth/signin');
  }, [status]);

  if (status === 'authenticated')
    return (
      <div>
        <h1>Logged in as {name}</h1>
        <h4>Email: {email}</h4>
      </div>
    );

  return <div>loading</div>;
};

export default Protected;
