import type {Model} from 'mongoose';
import {model, models, Schema} from 'mongoose';

import type {ICar} from './car.model';
import type {IUser} from './user.model';

export interface IBooking {
	user: Schema.Types.ObjectId | IUser | string;
	car: Schema.Types.ObjectId | ICar | string;
	startDate: Date;
	endDate: Date;
	totalCost: number;
}

const bookingSchema = new Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
		car: {type: Schema.Types.ObjectId, ref: 'Car', required: true},
		startDate: {type: Date, required: true},
		endDate: {type: Date, required: true},
		totalCost: {type: Number, required: true},
	},
	{timestamps: true}
);

const Booking: Model<IBooking> =
	models.Booking || model<IBooking>('booking', bookingSchema);

export default Booking;
