import type {NextPage} from 'next';

import {NewPasswordForm} from '@/components/forms/auth/NewPasswordForm';
import {AuthLayout} from '@/layouts/AuthLayout';

const NewPassword: NextPage = (): JSX.Element => {
	return (
		<AuthLayout>
			<NewPasswordForm />
		</AuthLayout>
	);
};

export default NewPassword;
