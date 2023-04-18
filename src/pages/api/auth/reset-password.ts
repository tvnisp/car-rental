import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  generateResetPasswordToken,
  resetPassword,
} from '@/lib/server/controllers/authControllers';
import User from '@/lib/server/db/models/user.model';
import clientPromise from '@/lib/server/db/mongoose';
import type { IResponse } from '@/types/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
): Promise<any> {
  const { method, query } = req;

  await clientPromise;
  await User.init();

  switch (method) {
    case 'POST':
      // If there is query (token) reset the password
      if (!_.isEmpty(query)) {
        resetPassword(req, res);
        return;
      }
      generateResetPasswordToken(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).json({
        error: `Method ${method} Not Allowed`,
      });
  }
}
