import { Button } from '@automattic/components';
import formatNumber from '@automattic/components/src/number-formatters/lib/format-number';
import formatCurrency from '@automattic/format-currency';
import { Icon, external } from '@wordpress/icons';
import { useTranslate } from 'i18n-calypso';
import { useCallback } from 'react';
import { getProductPricingInfo } from 'calypso/jetpack-cloud/sections/partner-portal/primary/issue-license/lib/pricing';
import { useDispatch, useSelector } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { APIProductFamilyProduct } from 'calypso/state/partner-portal/types';
import { getProductsList } from 'calypso/state/products-list/selectors';
import SimpleList from '../../common/simple-list';
import getPressablePlan from '../lib/get-pressable-plan';
import getPressableShortName from '../lib/get-pressable-short-name';

type Props = {
	selectedPlan: APIProductFamilyProduct | null;
	onSelectPlan: () => void;
};

export default function PlanSelectionDetails( { selectedPlan, onSelectPlan }: Props ) {
	const translate = useTranslate();
	const dispatch = useDispatch();

	const info = selectedPlan?.slug ? getPressablePlan( selectedPlan?.slug ) : null;

	const customString = translate( 'Custom' );

	const userProducts = useSelector( getProductsList );

	const { discountedCost } = selectedPlan
		? getProductPricingInfo( userProducts, selectedPlan, 1 )
		: { discountedCost: 0 };

	const onChatWithUs = useCallback( () => {
		dispatch( recordTracksEvent( 'calypso_a4a_marketplace_hosting_pressable_chat_with_us_click' ) );
	}, [ dispatch ] );

	const PRESSABLE_CONTACT_LINK = 'https://pressable.com/request-demo';

	return (
		<section className="pressable-overview-plan-selection__details">
			<div className="pressable-overview-plan-selection__details-card">
				<div className="pressable-overview-plan-selection__details-card-header">
					<h3 className="pressable-overview-plan-selection__details-card-header-title">
						{ translate( '%(planName)s plan', {
							args: {
								planName: selectedPlan ? getPressableShortName( selectedPlan.name ) : customString,
							},
							comment: '%(planName)s is the name of the selected plan.',
						} ) }
					</h3>

					{ selectedPlan && (
						<div className="pressable-overview-plan-selection__details-card-header-price">
							<strong className="pressable-overview-plan-selection__details-card-header-price-value">
								{ formatCurrency( discountedCost, selectedPlan.currency ) }
							</strong>
							<span className="pressable-overview-plan-selection__details-card-header-price-interval">
								{ selectedPlan.price_interval === 'day' && translate( 'per plan per day' ) }
								{ selectedPlan.price_interval === 'month' && translate( 'per plan per month' ) }
							</span>
						</div>
					) }
				</div>

				<SimpleList
					items={ [
						info?.install
							? translate(
									'{{b}}%(count)d{{/b}} WordPress install',
									'{{b}}%(count)d{{/b}} WordPress installs',
									{
										args: {
											count: info.install,
										},
										count: info.install,
										components: { b: <b /> },
										comment: '%(count)s is the number of WordPress installs.',
									}
							  )
							: translate( 'Custom WordPress installs' ),
						translate( '{{b}}%(count)s{{/b}} visits per month', {
							args: {
								count: info ? formatNumber( info.visits ) : customString,
							},
							components: { b: <b /> },
							comment: '%(count)s is the number of visits per month.',
						} ),
						translate( '{{b}}%(size)s{{/b}} storage per month', {
							args: {
								size: info ? `${ info.storage }GB` : customString,
							},
							components: { b: <b /> },
							comment: '%(size)s is the amount of storage in gigabytes.',
						} ),
					] }
				/>

				{ selectedPlan && (
					<Button
						className="pressable-overview-plan-selection__details-card-cta-button"
						onClick={ onSelectPlan }
						primary
					>
						{ translate( 'Select %(planName)s plan', {
							args: {
								planName: selectedPlan ? getPressableShortName( selectedPlan.name ) : customString,
							},
							comment: '%(planName)s is the name of the selected plan.',
						} ) }
					</Button>
				) }

				{ ! selectedPlan && (
					<Button
						className="pressable-overview-plan-selection__details-card-cta-button"
						onClick={ onChatWithUs }
						href={ PRESSABLE_CONTACT_LINK }
						target="_blank"
						primary
					>
						{ translate( 'Chat with us' ) } <Icon icon={ external } size={ 16 } />
					</Button>
				) }
			</div>

			<div className="pressable-overview-plan-selection__details-card is-aside">
				<h3 className="pressable-overview-plan-selection__details-card-header-title">
					{ translate( 'All plans include:' ) }{ ' ' }
				</h3>

				<SimpleList
					items={ [
						translate( '24/7 WordPress hosting support' ),
						translate( 'WP Cloud platform' ),
						translate( 'Jetpack Security (optional)' ),
						translate( 'Free site migrations' ),
					] }
				/>
			</div>
		</section>
	);
}
