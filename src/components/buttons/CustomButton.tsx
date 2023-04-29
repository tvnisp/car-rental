import classNames from 'classnames';
import React from 'react';

interface IButtonProps {
	type: 'primary' | 'secondary' | 'dark';
	children: React.ReactNode;
	htmlType: 'button' | 'submit';
}

function getTypeClassnames(type: IButtonProps['type']) {
	let className = '';

	switch (type) {
		case 'dark':
			className = 'bg-black text-white focus:outline-none focus:ring-4';
			break;
		default:
			className = '';
			break;
	}
	return className;
}

const defaultClassnames =
	'w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium';

export function CustomButton(props: IButtonProps) {
	const {children, type, htmlType} = props;

	const typeClassnames = React.useMemo(() => {
		return getTypeClassnames(type);
	}, [type]);

	return (
		<button
			type={htmlType}
			className={classNames(defaultClassnames, typeClassnames)}
		>
			{children}
		</button>
	);
}
