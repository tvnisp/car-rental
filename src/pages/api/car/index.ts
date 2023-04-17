import type { NextApiRequest, NextApiResponse } from 'next';

import Car from '@/lib/server/db/models/car.model';
import clientPromise from '@/lib/server/db/mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { method } = req;

  await clientPromise;
  await Car.init();

  switch (method) {
    case 'POST':
      try {
        const createdCar = await Car.create(req.body);
        res.status(200).json({
          message: 'success',
          data: createdCar,
        });
      } catch (err) {
        res.status(400).json({
          message: err,
        });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({
        message: `Method ${method} Not Allowed`,
      });
  }
}
