import { Meta } from '@storybook/react';
import { DomainsTable } from './index';

export default {
	title: 'packages/domains-table/DomainsTable',
	component: DomainsTable,
	parameters: {
		viewport: {
			defaultViewport: 'LARGE',
		},
	},
} as Meta;

const defaultArgs = {
	domains: [ { domain: 'example1.com' }, { domain: 'example2.com' }, { domain: 'example3.com' } ],
};

const storyDefaults = {
	args: defaultArgs,
};

export const TableWithRows = { ...storyDefaults };