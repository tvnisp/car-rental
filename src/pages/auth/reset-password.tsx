import type {NextPage} from 'next';

import {ResetPasswordForm} from '@/components/forms/auth/ResetPasswordForm';

const ResetPassword: NextPage = (): JSX.Element => {
	return (
		<section className="bg-gray-50">
			<div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
				<ResetPasswordForm />
			</div>
		</section>
	);
};

export default ResetPassword;
