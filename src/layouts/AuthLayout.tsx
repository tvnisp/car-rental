export function AuthLayout(props: {children: React.ReactNode}) {
	const {children} = props;
	return (
		<section className="bg-gray-50">
			<div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
				{children}
			</div>
		</section>
	);
}
