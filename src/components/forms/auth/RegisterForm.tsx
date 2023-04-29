import Link from 'next/link';
import Router from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

import { CustomButton } from '@/components/buttons/CustomButton';

const formatPhoneNumber = (input: string) => {
  const inputValue = input.replace(/\D/g, '');
  const inputLength = inputValue.length;
  if (inputLength < 4) {
    return inputValue;
  }
  if (inputLength < 7) {
    return `${inputValue.slice(0, 3)}-${inputValue.slice(3)}`;
  }
  return `${inputValue.slice(0, 3)}-${inputValue.slice(
    3,
    6
  )}-${inputValue.slice(6, 10)}`;
};

export function RegisterForm() {
  const { status } = useSession();
  const [errors, setErrors] = React.useState<Array<string>>();
  const [startDate] = React.useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  });

  React.useEffect(() => {
    if (status === 'authenticated') Router.replace('/');
  }, [status]);

  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confPassword: '',
    // driversLicense: '',
    address: '',
    dateOfBirth: '',
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      setUserInfo((prevState) => ({
        ...prevState,
        phone: formatPhoneNumber(value),
      }));
      return;
    }
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = React.useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    async (event) => {
      event.preventDefault();
      const query = {
        method: 'POST',
        body: JSON.stringify(userInfo),
        headers: { 'Content-Type': 'application/json' },
      };
      const res = await fetch('/api/user', query);
      const data = await res.json();
      if (data && data.error) setErrors(data.error);
      if (res.ok)
        signIn('credentials', {
          redirect: false,
          ...userInfo,
        });
    },
    [userInfo]
  );

  return (
    <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 md:max-w-5xl xl:p-0">
      <div className="space-y-6 p-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
          Create an account
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Your email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleOnChange}
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900"
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confPassword"
                  className="mb-2 block text-sm font-medium text-gray-900"
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Phone
                </label>
                <input
                  type="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleOnChange}
                  placeholder="999-999-9999"
                  id="phone"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex-1 space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleOnChange}
                  id="firstName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleOnChange}
                  id="lastName"
                  placeholder="Doe"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Date Of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={userInfo.dateOfBirth}
                  onChange={handleOnChange}
                  id="dateOfBirth"
                  max={startDate}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleOnChange}
                  id="address"
                  placeholder="Street N. Zipcode, City"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
          {errors && (
            <div className="p-6 text-sm text-red-500 sm:p-8">
              <ul className="list-disc">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="h-4 w-4 rounded border border-gray-300 bg-gray-50"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className="text-sm font-light text-gray-500"
              >
                I accept the{' '}
                <a className="font-medium" href="#">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>
          <CustomButton type="dark" htmlType="submit">
            Create an account
          </CustomButton>
          <p className="text-sm font-light text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
