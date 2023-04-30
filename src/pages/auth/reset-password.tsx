import type {NextPage} from 'next';

import {ResetPasswordForm} from '@/components/forms/auth/ResetPasswordForm';
import {AuthLayout} from '@/layouts/AuthLayout';

const ResetPassword: NextPage = (): JSX.Element => {
	return (
		<AuthLayout>
			<ResetPasswordForm />
		</AuthLayout>
	);
};

export default ResetPassword;
