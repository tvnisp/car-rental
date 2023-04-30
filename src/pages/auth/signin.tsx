import type {NextPage} from 'next';

import {LoginForm} from '@/components/forms/auth/LoginForm';
import {AuthLayout} from '@/layouts/AuthLayout';

const SignIn: NextPage = (): JSX.Element => {
	return (
		<AuthLayout>
			<LoginForm />
		</AuthLayout>
	);
};

export default SignIn;
