import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { CustomButton } from '@/components/buttons/CustomButton';

const NewPassword: NextPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = React.useState({
    password: '',
    confPassword: '',
  });
  const [error, setError] = React.useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = React.useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault();
      const query = {
        method: 'PUT',
        body: JSON.stringify({ ...userInfo, token }),
        headers: { 'Content-Type': 'application/json' },
      };
      const res = await fetch('/api/auth/reset-password', query);
      const data = await res.json();
      if (data && data.error) setError(data.error);
    },
    [userInfo]
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
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={userInfo.password}
                  onChange={handleOnChange}
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confPassword"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confPassword"
                  value={userInfo.confPassword}
                  onChange={handleOnChange}
                  id="confPassword"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <CustomButton type="dark" htmlType="submit">
                Reset password
              </CustomButton>
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

export default NewPassword;
