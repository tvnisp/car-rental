import type {NextApiRequest, NextApiResponse} from 'next';
import type {DefaultSession} from 'next-auth';
import {getSession} from 'next-auth/react';

interface ICustomSession extends DefaultSession {
	user?: DefaultSession['user'] & {
		role: 'admin' | 'viewer' | 'editor' | undefined;
	};
}

const authMiddleware =
	(role: string) =>
	async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
		const session = (await getSession({req})) as ICustomSession;

		if (!session) {
			return res.status(401).json({
				error: 'Unauthorized access',
			});
		}

		if (session.user && session.user.role !== role) {
			return res.status(403).json({
				error: `Access forbidden. You need to be ${role}`,
			});
		}

		return next();
	};

export default authMiddleware;
