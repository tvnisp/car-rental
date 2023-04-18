import type { NextApiRequest, NextApiResponse } from 'next';

import type { IResponse } from '@/types/server';

import type { IUser } from '../db/models/user.model';
import User from '../db/models/user.model';

// @desc    Authenticate a user
// @route   POST /api/auth/userAuth
// @access  ---
export const authenticateUser = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne<IUser>({ email });
    const isValid = await user?.comparePassword(password);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!isValid)
      return res.status(200).json({
        data: { isValid, message: 'Authentication' },
      });

    return res.status(200).json({
      data: {
        isValid,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        message: 'Authentication',
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Generate reset token
// @route   POST /api/auth/reset-password
// @access  ---
export const generateResetPasswordToken = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Provide an email' });

    const user = await User.findOne<IUser>({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const token = await user?.generateResetPasswordToken();
    await user?.generateResetPasswordToken();
    // TODO send email with the token

    // Return success response to client
    return res.status(200).json({
      data: {
        message: 'Reset token created successfully',
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Reset user's password
// @route   POST /api/auth/reset-password
// @access  ---
export const resetPassword = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  const { token } = req.query;
  const { password, confPassword } = req.body;
  try {
    if (!token || !password || !confPassword)
      return res.status(400).json({ error: 'Values are missing' });

    // Check if reset token is valid and not expired
    const user = await User.findOne<IUser>({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date(Date.now()) },
    });

    if (!user) {
      return res.status(404).json({ error: 'Token expired' });
    }

    const passwordChanged = await user?.resetPassword(password, confPassword);

    if (passwordChanged)
      return res.status(200).json({
        data: {
          message: 'Password changed succesfully',
        },
      });

    return res.status(200).json({
      data: { message: 'Invalid password' },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
