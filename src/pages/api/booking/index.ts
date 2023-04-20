import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import type { IBooking } from '@/lib/server/db/models/booking.model';
import Booking from '@/lib/server/db/models/booking.model';
import clientPromise from '@/lib/server/db/mongoose';

import { getCarBookings } from './controllers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { method } = req;
  const { car, user, startDate, endDate, totalCost } = req.body as IBooking;

  if (!car || !user || !startDate || !endDate || !totalCost) {
    res.status(400).json({ error: 'Bad Request! - Exit with code 400' });
    return;
  }

  await clientPromise;
  await Booking.init();

  // const userExists = await findUserById(user as string);

  const carBookings = await getCarBookings({
    car: car as string,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  const isCarAvailable = _.isEmpty(carBookings);

  switch (method) {
    case 'POST':
      try {
        if (isCarAvailable) {
          const createdBooking = await Booking.create(req.body);
          res.status(200).json({
            message: 'success',
            data: createdBooking,
          });
        } else {
          res.status(200).json({
            message: 'failed',
            data: 'Car not available',
          });
        }
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
