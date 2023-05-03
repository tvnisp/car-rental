export function getResetPassTemplate(token: string) {
	const url = process.env.NEXTAUTH_URL as string;
	return `
    <html>
      <body>
        <p>To change your password click the following link:</p>
        <a href="${url}/auth/new-password?token=${token}" style="background-color: black; color: white; padding: 10px; margin: 10px 0; border-radius: 10px; text-decoration: none;">Reset Password</a>
        <p>Or try clicking this link <a href="${url}/auth/new-password?${token}">${url}/auth/new-password?${token}</a></p>
      </body>
    </html>`;
}
