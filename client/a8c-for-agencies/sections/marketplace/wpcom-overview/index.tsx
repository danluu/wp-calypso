import page from '@automattic/calypso-router';
import { useTranslate } from 'i18n-calypso';
import { useState } from 'react';
import Layout from 'calypso/a8c-for-agencies/components/layout';
import LayoutBody from 'calypso/a8c-for-agencies/components/layout/body';
import LayoutHeader, {
	LayoutHeaderBreadcrumb as Breadcrumb,
	LayoutHeaderActions as Actions,
} from 'calypso/a8c-for-agencies/components/layout/header';
import LayoutTop from 'calypso/a8c-for-agencies/components/layout/top';
import MobileSidebarNavigation from 'calypso/a8c-for-agencies/components/sidebar/mobile-sidebar-navigation';
import {
	A4A_MARKETPLACE_CHECKOUT_LINK,
	A4A_MARKETPLACE_HOSTING_LINK,
	A4A_MARKETPLACE_LINK,
} from 'calypso/a8c-for-agencies/components/sidebar-menu/lib/constants';
import HostingOverview from '../common/hosting-overview';
import useProductAndPlans from '../hooks/use-product-and-plans';
import useShoppingCart from '../hooks/use-shopping-cart';
import { getCheapestPlan } from '../lib/hosting';
import ShoppingCart from '../shopping-cart';
import WPCOMBulkSelector from './bulk-selection';
import wpcomBulkOptions from './lib/wpcom-bulk-options';
import WPCOMPlanCard from './wpcom-card';

import './style.scss';

export default function WpcomOverview() {
	const translate = useTranslate();

	const { selectedCartItems, onRemoveCartItem } = useShoppingCart();

	const [ selectedCount, setSelectedCount ] = useState( wpcomBulkOptions[ 0 ] );

	const onSelectCount = ( count: number ) => {
		setSelectedCount(
			wpcomBulkOptions.find( ( option ) => option.value === count ) ?? wpcomBulkOptions[ 0 ]
		);
	};

	const { wpcomPlans } = useProductAndPlans( {} );

	const cheapestWPCOMPlan = getCheapestPlan( wpcomPlans );

	return (
		<Layout
			className="wpcom-overview"
			title={ translate( 'WordPress.com hosting' ) }
			wide
			withBorder
			compact
			sidebarNavigation={ <MobileSidebarNavigation /> }
		>
			<LayoutTop>
				<LayoutHeader>
					<Breadcrumb
						items={ [
							{
								label: translate( 'Marketplace' ),
								href: A4A_MARKETPLACE_LINK,
							},
							{
								label: translate( 'Hosting' ),
								href: A4A_MARKETPLACE_HOSTING_LINK,
							},
							{
								label: translate( 'WordPress.com hosting' ),
							},
						] }
					/>

					<Actions>
						<ShoppingCart
							items={ selectedCartItems }
							onRemoveItem={ onRemoveCartItem }
							onCheckout={ () => {
								page( A4A_MARKETPLACE_CHECKOUT_LINK );
							} }
						/>
					</Actions>
				</LayoutHeader>
			</LayoutTop>

			<LayoutBody>
				<HostingOverview
					slug="wpcom-hosting"
					title={ translate( 'Powerful WordPress Hosting' ) }
					subtitle={ translate(
						'When you build and host your sites with WordPress.com, everything’s integrated, secure, and scalable.'
					) }
				/>
				<WPCOMBulkSelector selectedCount={ selectedCount } onSelectCount={ onSelectCount } />

				<WPCOMPlanCard
					plan={ cheapestWPCOMPlan }
					quantity={ selectedCount.value }
					discount={ selectedCount.discount }
				/>
			</LayoutBody>
		</Layout>
	);
}
