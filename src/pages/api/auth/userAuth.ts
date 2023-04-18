import type { NextApiRequest, NextApiResponse } from 'next';

import User from '@/lib/server/db/models/user.model';
import clientPromise from '@/lib/server/db/mongoose';
import type { IResponse } from '@/types/server';

import { authenticateUser } from '../../../lib/server/controllers/authControllers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse<any>>
): Promise<any> {
  const { method } = req;

  await clientPromise;
  await User.init();

  switch (method) {
    case 'POST':
      authenticateUser(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).json({
        error: `Method ${method} Not Allowed`,
      });
  }
}
