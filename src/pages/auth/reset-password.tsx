import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

import { CustomButton } from '@/components/buttons/CustomButton';

const ResetPassword: NextPage = (): JSX.Element => {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState({ data: '', error: '' });

  const handleSubmit = React.useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault();
      const query = {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      };
      const res = await fetch('/api/auth/reset-password', query);
      const data = await res.json();
      if (data.error) return setMessage({ data: '', error: data.error });
      return setMessage({
        data: 'Check your e-mail inbox for resetting your password',
        error: '',
      });
    },
    [email]
  );
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Reset your password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <CustomButton type="dark" htmlType="submit">
                Reset password
              </CustomButton>
              {message.error && (
                <p className="text-sm text-red-500">{message.error}</p>
              )}
              {message.data && (
                <p className="text-sm text-green-500">{message.data}</p>
              )}
              <div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="font-medium">
                    Login here
                  </Link>
                </p>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{' '}
                  <Link href="/auth/register" className="font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
