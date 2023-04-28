import classNames from 'classnames';
import type { NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

import { CustomButton } from '@/components/buttons/CustomButton';
import { Spinner } from '@/components/spinner/Spinner';

const SignIn: NextPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const { status } = useSession();

  React.useEffect(() => {
    if (status === 'authenticated') Router.replace('/');
  }, [status]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { target } = e;
    const { value } = target;
    const { name } = target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = React.useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault();
      const res = await signIn('credentials', {
        redirect: false,
        ...userInfo,
      });
      if (res && !res.ok) setError(res?.error || '');
    },
    [userInfo]
  );

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div
            className={classNames(
              'relative space-y-4 p-6 sm:p-8 md:space-y-6',
              { 'blur-sm': status === 'loading' }
            )}
          >
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Sign in to your account
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
                  value={userInfo.email}
                  onChange={handleOnChange}
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>

                <label
                  htmlFor="Reset password"
                  className="text-sm font-light text-gray-500 dark:text-gray-300"
                >
                  <Link className="font-medium" href="/auth/reset-password">
                    Forgot password?
                  </Link>
                </label>
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <CustomButton type="dark" htmlType="submit">
                Sign in
              </CustomButton>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <Link href="/auth/register" className="font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
          {status === 'loading' && (
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignIn;
