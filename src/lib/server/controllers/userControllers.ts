import type { NextApiRequest, NextApiResponse } from 'next';

import type { IUser } from '@/lib/server/db/models/user.model';
import User from '@/lib/server/db/models/user.model';
import type { IResponse } from '@/types/server';

import authMiddleware from '../middlewares/authMiddleware';
import { verifyToken } from '../utils/auth';

/**
 * @desc Create a new user
 * @route POST /api/user
 * @access Public
 */
export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  try {
    const {
      email,
      confPassword,
      password,
      firstName,
      lastName,
      dateOfBirth,
      address,
      role,
    } = req.body as IUser;

    const errors = [];

    // Check if all required fields are included
    if (
      !email ||
      !confPassword ||
      !password ||
      !firstName ||
      !lastName ||
      !address ||
      !dateOfBirth
    )
      return res.status(400).json({ error: 'Please include all fields' });

    // Check if the user has admin or editor role
    if (role === 'admin' || role === 'editor')
      return res.status(401).json({
        error: `Not authorized to create an account with role:${role}`,
      });

    const alreadyExists = await User.findOne({ email });
    const passwordMatch = password === confPassword;

    if (alreadyExists) errors.push('Email already exists');
    if (!passwordMatch) errors.push('Passwords do not match');

    if (alreadyExists || !passwordMatch)
      return res.status(400).json({ error: errors });

    try {
      const newUser = await User.create(req.body);
      return res.status(200).json({
        data: {
          action: 'New user',
          newUser,
        },
      });
    } catch (error: any) {
      for (const value of Object.values(error.errors)) {
        errors.push(`${value}`);
      }
      // Validation errors
      return res.status(400).json({ error: errors });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * @desc Get all users
 * @route GET /api/user
 * @access Public
 */
export const getUsers = async (res: NextApiResponse<IResponse<any>>) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      data: {
        count: users.length,
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      error: err as string,
    });
  }
};

/**
 * @desc Update a user
 * @route PUT /api/user
 * @access admin/auth
 */
export const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  try {
    const updateObj = req.body as IUser;
    const { id } = updateObj;
    const { authorization } = req.headers;

    const user = await User.findById<IUser>(id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'Unexpected error' });
    }

    const isCurrentLoggedUser = verifyToken(authorization || '', user);

    const isAdmin = user.role === 'admin';
    const isAuthorized = isAdmin || isCurrentLoggedUser;

    if (isAuthorized) {
      await Promise.all(
        Object.keys(updateObj).map(async (key) => {
          user[key] = updateObj[key];
        })
      );
      await user?.save();
      return res.status(200).json({
        data: { message: 'User updated', user },
      });
    }
    return res.status(401).json({ error: 'Not authorized' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * @desc Delete a user
 * @route DELETE /api/user
 * @access admin/auth
 */
export const deleteUser = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  try {
    const { id } = req.query;
    const { authorization } = req.headers;

    const user = await User.findById<IUser>(id);

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Unexpected error' });
    }

    const isCurrentLoggedUser = verifyToken(authorization || '', user);

    const isAdmin = user.role === 'admin';
    const isAuthorized = isAdmin || isCurrentLoggedUser;

    if (isAuthorized) {
      const deletedUser = await User.findByIdAndDelete(id);
      return res.status(200).json({
        data: { message: 'User deleted', deletedUser },
      });
    }

    return res.status(401).json({ error: 'Not authorized' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await authMiddleware('admin')(req, res, async () => {
    await updateUser(req, res);
  });
};

export const deleteUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await authMiddleware('admin')(req, res, async () => {
    await deleteUser(req, res);
  });
};
