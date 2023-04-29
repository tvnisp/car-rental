import type {NextApiRequest, NextApiResponse} from 'next';

import {
	createUser,
	deleteUser,
	getUsers,
	updateUser,
} from '@/lib/server/controllers/userControllers';
import User from '@/lib/server/db/models/user.model';
import clientPromise from '@/lib/server/db/mongoose';
import type {IResponse} from '@/types/server';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<IResponse<any>>
): Promise<any> {
	const {method} = req;

	await clientPromise;
	await User.init();

	switch (method) {
		case 'POST':
			await createUser(req, res);
			break;
		case 'GET':
			await getUsers(res);
			break;
		case 'PUT':
			await updateUser(req, res);
			break;
		case 'DELETE':
			await deleteUser(req, res);
			break;
		default:
			res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
			res.status(405).json({
				error: `Method ${method} Not Allowed`,
			});
	}
}
