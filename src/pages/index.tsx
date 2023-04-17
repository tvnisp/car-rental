import { signIn } from 'next-auth/react';

import { Meta } from '@/layouts/Meta';

const Index = () => {
  return (
    <>
      <Meta title="Home page" description="This is the home page" />
      <button onClick={() => signIn()}>Login</button>
    </>
  );
};

export default Index;
