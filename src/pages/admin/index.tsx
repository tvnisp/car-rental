import type {NextPage} from 'next';

import {useCurrentUser} from '@/hooks/useCurrentUser';

const Admin: NextPage = (): JSX.Element => {
	const currentUser = useCurrentUser();
	return (
		<section>
			<h1>Logged in as: {currentUser.name}</h1>
			<p>{currentUser.email}</p>
		</section>
	);
};

export default Admin;
