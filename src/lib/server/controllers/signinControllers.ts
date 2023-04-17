import type { NextApiRequest, NextApiResponse } from 'next';

import type { IResponse } from '@/types/server';

import type { IUser } from '../db/models/user.model';
import User from '../db/models/user.model';

// @desc    Authenticate a user
// @route   POST /api/signin
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
