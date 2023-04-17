import type { Mongoose } from 'mongoose';

declare global {
  let isConnected: Promise<Mongoose>;
}
