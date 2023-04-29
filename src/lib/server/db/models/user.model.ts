/* eslint-disable func-names */
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type {Document, Model} from 'mongoose';
import {model, models, Schema} from 'mongoose';

const passwordValidator = (v: string) => {
	return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/gm.test(
		v
	);
};

export interface IUser extends Document {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	password: string;
	driversLicense?: string;
	dateOfBirth: Date;
	address: string;
	role?: 'admin' | 'editor' | 'viewer';
	paymentInfo?: {
		cardNumber: string;
		expiryDate: Date;
		cvv: string;
	};
	resetPasswordToken?: String | null;
	resetPasswordExpire?: Date | null;
	[key: string]: any;
}

const userSchema = new Schema(
	{
		firstName: {type: String, required: true},
		lastName: {type: String, required: true},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: (v: string) => {
					return /\S+@\S+\.\S+/.test(v);
				},
				message: 'Please enter a valid email address',
			},
		},
		phone: {type: String},
		password: {
			type: String,
			required: true,
			validate: {
				validator: passwordValidator,
				message:
					'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+-=[]{};:\'",./<>?)',
			},
		},
		driversLicense: {type: String},
		dateOfBirth: {
			type: Date,
			required: true,
			validate: {
				validator: (v: Date) => {
					const ageDiffMs = Date.now() - v.getTime();
					const ageDate = new Date(ageDiffMs);
					const age = Math.abs(ageDate.getUTCFullYear() - 1970);
					return age >= 18; // Require user to be at least 18 years old
				},
				message: 'You must be at least 18 years old',
			},
		},
		address: {type: String, required: true},
		role: {
			type: String,
			enum: ['admin', 'viewer', 'editor'],
			default: 'viewer',
		},
		paymentInfo: {
			cardNumber: {type: String},
			expiryDate: {type: Date},
			cvv: {type: String},
		},
		resetPasswordToken: {type: String, default: null},
		resetPasswordExpire: {type: Date, default: null},
	},
	{timestamps: true}
);

// Hashes the password before saving it to the db
userSchema.pre<IUser>('save', async function hashPassword(next) {
	if (!this.isModified('password')) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(this.password, salt);
	this.password = hash;
	return next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

// Generates a password token to reset code
userSchema.methods.generateResetPasswordToken = function (): string {
	const user = this as IUser;
	const resetToken = crypto.randomBytes(20).toString('hex');
	const hashedToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	user.resetPasswordToken = hashedToken;
	user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // Token valid for 10 minutes
	user.save();
	return hashedToken;
};

// Compare password method
userSchema.methods.resetPassword = async function (password: string) {
	if (passwordValidator(password) === false)
		return {
			passwordChanged: false,
			message:
				'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+-=[]{};:\'",./<>?)',
		};
	const user = this as IUser;
	user.password = password;
	// Allows to change password only once per token
	user.resetPasswordToken = null;
	user.resetPasswordExpire = null;
	user.save();
	return {passwordChanged: true, message: 'Password succesfully changed'};
};

const User: Model<IUser> = models.User || model<IUser>('User', userSchema);

export default User;
