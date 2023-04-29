import {signIn, signOut, useSession} from 'next-auth/react';

import {Meta} from '@/layouts/Meta';

const Index = () => {
	const {status} = useSession();
	return (
		<>
			<Meta title="Home page" description="This is the home page" />
			<div
				className="flex h-screen w-screen items-center justify-center
      "
			>
				<div className="flex space-x-4">
					{status !== 'authenticated' && (
						<button
							className="rounded-lg bg-black p-4 text-white"
							onClick={() => signIn()}
						>
							Login
						</button>
					)}
					{status === 'authenticated' && (
						<button
							className="rounded-lg bg-black p-4 text-white"
							onClick={() => signOut()}
						>
							Log out
						</button>
					)}
				</div>
			</div>
		</>
	);
};

export default Index;
