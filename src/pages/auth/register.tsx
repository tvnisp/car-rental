import type { NextPage } from 'next';

import { RegisterForm } from '@/components/forms/auth/RegisterForm';

const NewUser: NextPage = (): JSX.Element => {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <RegisterForm />
      </div>
    </section>
  );
};

export default NewUser;
