import type {Meta, StoryObj} from '@storybook/react';

import {CustomButton} from './CustomButton';

const meta: Meta<typeof CustomButton> = {
	/* 👇 The title prop is optional.
	 * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
	 * to learn how to generate automatic titles
	 */
	title: 'CustomButtons',
	component: CustomButton,
};

export default meta;
type Story = StoryObj<typeof CustomButton>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
	args: {
		type: 'primary',
		htmlType: 'submit',
		children: 'Submit',
	},
};

export const Dark: Story = {
	args: {
		type: 'dark',
		htmlType: 'submit',
		children: 'Submit',
	},
};
