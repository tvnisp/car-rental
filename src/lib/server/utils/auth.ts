import jwt from 'jsonwebtoken';

import type {IDecodedJWTUser} from '@/types/server';

import type {IUser} from '../db/models/user.model';

export const verifyUserAccess = (authHeader: string, user: IUser) => {
	if (!authHeader) return false;
	const token = authHeader.split(' ')[1] as string;
	const secretKey = process.env.NEXTAUTH_SECRET as string;
	const decoded = jwt.verify(token, secretKey) as IDecodedJWTUser;
	const isValidUser = decoded.id === user.id;
	const isAdmin = user.role === 'admin';
	return isAdmin || isValidUser;
};

export const verifyAdminAccess = (user: IUser) => {
	const isAdmin = user.role === 'admin';
	return isAdmin;
};
