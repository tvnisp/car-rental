import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, body: string) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.NODEMAILER_EMAIL as string, // generated ethereal user
			pass: process.env.NODEMAILER_PASSWORD as string, // generated ethereal password
		},
	});
	try {
		const info = await transporter.sendMail({
			from: process.env.NODEMAILER_EMAIL as string,
			to,
			subject,
			html: body,
		});
		console.log(`Email sent: ${info.messageId}`);
	} catch (error) {
		console.error('the error is', error);
	}
}
