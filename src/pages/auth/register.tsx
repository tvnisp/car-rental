import type {NextPage} from 'next';

import {RegisterForm} from '@/components/forms/auth/RegisterForm';
import {AuthLayout} from '@/layouts/AuthLayout';

const NewUser: NextPage = (): JSX.Element => {
	return (
		<AuthLayout>
			<RegisterForm />
		</AuthLayout>
	);
};

export default NewUser;
