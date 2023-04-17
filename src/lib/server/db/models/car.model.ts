import type { Model } from 'mongoose';
import { model, models, Schema } from 'mongoose';

export interface ICar {
  make: string;
  model: string;
  year: number;
  color?: string;
  type?: string;
  transmission?: string;
  fuelType?: string;
  dailyRentalRate: number;
  available?: boolean;
}

const carSchema = new Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String },
    type: { type: String },
    transmission: { type: String },
    fuelType: { type: String },
    dailyRentalRate: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Car: Model<ICar> = models.Car || model<ICar>('car', carSchema);

export default Car;
