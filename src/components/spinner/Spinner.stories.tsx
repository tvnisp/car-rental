import type {Meta, StoryObj} from '@storybook/react';

import {Spinner} from './Spinner';

const meta: Meta<typeof Spinner> = {
	/* 👇 The title prop is optional.
	 * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
	 * to learn how to generate automatic titles
	 */
	title: 'Spinner',
	component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
	render: () => <Spinner />,
};

// export const Primary: Story = {
// 	args: {
// 		primary: true,
// 		label: 'Button',
// 	},
// };
