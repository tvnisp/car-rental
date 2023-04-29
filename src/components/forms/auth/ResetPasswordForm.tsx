import Link from 'next/link';
import React from 'react';

import {CustomButton} from '@/components/buttons/CustomButton';

export function ResetPasswordForm() {
	const [email, setEmail] = React.useState('');
	const [isSubmitted, setIsSubmitted] = React.useState(false);

	const handleSubmit = React.useCallback<
		React.FormEventHandler<HTMLFormElement>
	>(
		async event => {
			event.preventDefault();
			const query = {
				method: 'POST',
				body: JSON.stringify({email}),
				headers: {'Content-Type': 'application/json'},
			};
			await fetch('/api/auth/reset-password', query);
			setIsSubmitted(true);
		},
		[email]
	);
	return (
		<div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
			<div className="space-y-4 p-6 sm:p-8 md:space-y-6">
				<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
					Reset your password
				</h1>
				<form
					className="space-y-4 md:space-y-6"
					onSubmit={handleSubmit}
				>
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
							value={email}
							onChange={e => setEmail(e.target.value)}
							id="email"
							className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
							placeholder="name@company.com"
							required
						/>
					</div>
					<CustomButton type="dark" htmlType="submit">
						Reset password
					</CustomButton>
					{isSubmitted && (
						<p className="text-sm text-green-500">
							Check your e-mail inbox for resetting your password
						</p>
					)}
					<div>
						<p className="text-sm font-light text-gray-500">
							Already have an account?{' '}
							<Link href="/auth/signin" className="font-medium">
								Login here
							</Link>
						</p>
						<p className="text-sm font-light text-gray-500">
							Don’t have an account yet?{' '}
							<Link href="/auth/register" className="font-medium">
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
