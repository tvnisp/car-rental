import Booking from '@/lib/server/db/models/booking.model';

export const getCarBookings = async (data: {
	car: string;
	startDate: Date;
	endDate: Date;
}) => {
	const {car, startDate, endDate} = data;
	return Booking.find({
		car,
		startDate: {$lt: endDate},
		endDate: {$gt: startDate},
	});
};
