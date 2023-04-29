import type { NextPage } from 'next';

import { NewPasswordForm } from '@/components/forms/auth/NewPasswordForm';

const NewPassword: NextPage = (): JSX.Element => {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <NewPasswordForm />
      </div>
    </section>
  );
};

export default NewPassword;
