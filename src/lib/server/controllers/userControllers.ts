import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

import type { IResponse } from '@/types/server';

import type { IUser } from '../db/models/user.model';
import User from '../db/models/user.model';

// @desc    Create a new user
// @route   POST /api/user
// @access  ---
export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
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

  if (role === 'admin' || role === 'editor')
    return res
      .status(401)
      .json({ error: `Not authorized to create an account with role:${role}` });

  const alreadyExists = await User.findOne({ email });
  const passwordMatch = password === confPassword;

  try {
    if (alreadyExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const newUser = await User.create(req.body);
    return res.status(200).json({
      data: {
        action: 'new user',
        newUser,
      },
    });
  } catch (err) {
    return res.status(400).json({
      error: err as string,
    });
  }
};

// @desc    Get all users
// @route   POST /api/user
// @access  ---
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

// @desc    Update a user
// @route   PUT /api/user
// @access  ---
export const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  try {
    const { id } = req.query;
    const { role } = req.body;
    const updateObj = req.body;
    const user = await User.findById<IUser>(id);

    if (role === 'admin' || role === 'editor')
      return res.status(401).json({
        error: `Not authorized to update an account with role:${role}`,
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Promise.all(
      Object.keys(updateObj).map(async (key) => {
        if (key === 'password') {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(updateObj.password, salt);
          user.password = hash;
        } else {
          user[key] = updateObj[key];
        }
      })
    );
    await user.save();

    return res.status(200).json({
      data: { message: 'success', action: 'update user', data: user },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/user
// @access  ---
export const deleteUser = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
) => {
  try {
    const { id } = req.query;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({
      data: {
        action: 'delete user',
        user,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: err as string,
    });
  }
};
