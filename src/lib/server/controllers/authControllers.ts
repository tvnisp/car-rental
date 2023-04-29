import jwt from 'jsonwebtoken';
import type {NextApiRequest, NextApiResponse} from 'next';

import type {IUser} from '@/lib/server/db/models/user.model';
import User from '@/lib/server/db/models/user.model';
import type {IResponse} from '@/types/server';

import {sendEmail} from '../nodemailer/nodemailer';
import {getResetPassTemplate} from '../nodemailer/templates/reset-password';

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/userAuth
 * @access  Public
 */
export const authenticateUser = async (
	req: NextApiRequest,
	res: NextApiResponse<IResponse<any>>
) => {
	try {
		const {email, password} = req.body;

		// Check for missing fields
		if (!email || !password)
			return res.status(400).json({error: 'Missing fields'});

		const user = await User.findOne<IUser>({email});

		// Check if user exists in the database
		if (!user) {
			console.log('User not found');
			return res.status(401).json({error: 'Invalid Credentials'});
		}

		const isPasswordValid = await user?.comparePassword(password);
		// Check if password is valid
		if (!isPasswordValid)
			return res.status(401).json({
				data: {isPasswordValid, message: 'Authentication'},
			});

		const secret = process.env.NEXTAUTH_SECRET as string;
		const accessToken = jwt.sign(
			{id: user.id, name: `${user.firstName} ${user.lastName}`},
			secret,
			{expiresIn: '1h'}
		);

		return res.status(200).json({
			data: {
				id: user.id,
				name: `${user.firstName} ${user.lastName}`,
				email: user.email,
				role: user.role,
				accessToken,
			},
		});
	} catch (err) {
		return res.status(500).json({error: 'Internal Server Error'});
	}
};

/**
 * @desc    Generate reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const generateResetPasswordToken = async (
	req: NextApiRequest,
	res: NextApiResponse<IResponse<any>>
) => {
	try {
		const {email} = req.body;
		// Check for missing fields
		if (!email) return res.status(400).json({error: 'Provide an email'});

		// Check if user exists in the database
		const user = await User.findOne<IUser>({email});

		if (!user) {
			console.log('The user was not found');
			// Status code 200 because we don't want the user to know if the email was incorrect
			return res.status(200).json({
				error: 'Reset token creation',
			});
		}

		try {
			// Generate reset password token and send email
			const token = await user?.generateResetPasswordToken();
			const emailBody = getResetPassTemplate(token);
			await sendEmail(email, 'Reset Password Token', emailBody);

			return res.status(200).json({
				data: {
					message: 'Reset token creation',
				},
			});
		} catch (error) {
			console.log('Email not sent', error);
			throw new Error('Email was not send');
		}
		// Return success response to client
	} catch (err) {
		return res.status(500).json({error: 'Internal Server Error'});
	}
};

/**
 * @desc    Reset user's password
 * @route   PUT /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (
	req: NextApiRequest,
	res: NextApiResponse<IResponse<any>>
) => {
	try {
		const {password, confPassword, token} = req.body;

		// Check if required values are missing
		if (!token || !password || !confPassword)
			return res.status(400).json({error: 'Values are missing'});

		const passwordMatch = password === confPassword;

		if (!passwordMatch)
			return res.status(400).json({error: 'Passwords do not match'});

		// Check if reset token is valid and not expired
		const user = await User.findOne<IUser>({
			resetPasswordToken: token,
			resetPasswordExpire: {$gt: new Date(Date.now())},
		});

		if (!user) {
			console.log('Token expired');
			return res.status(404).json({error: 'Unexpected error'});
		}

		// Check if the new password is different from the old one
		const passwordExists = await user?.comparePassword(password);
		if (passwordExists)
			return res.status(409).json({
				error: 'Password cannot be the same as the old one',
			});

		// Reset the user's password
		const reset = await user?.resetPassword(password);

		if (reset?.passwordChanged)
			return res.status(200).json({
				data: {
					message: reset?.message,
				},
			});

		return res.status(401).json({
			error: reset?.message,
		});
	} catch (err) {
		return res.status(500).json({error: 'Internal Server Error'});
	}
};
