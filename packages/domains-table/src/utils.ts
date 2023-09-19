import { DomainData, SiteDetails } from '@automattic/data-stores';
import { I18N } from 'i18n-calypso';
import { createSiteDomainObject } from './utils/assembler';
import {
	DomainStatusPurchaseActions,
	ResolveDomainStatusReturn,
	resolveDomainStatus,
} from './utils/resolve-domain-status';

export const getSimpleSortFunctionBy =
	( column: keyof DomainData ) => ( first: DomainData, second: DomainData, sortOrder: number ) => {
		if ( ! first.hasOwnProperty( column ) || ! second.hasOwnProperty( column ) ) {
			return -1;
		}

		const firstValue = first[ column ];
		const secondValue = second[ column ];

		if (
			firstValue === secondValue ||
			typeof firstValue !== 'string' ||
			typeof secondValue !== 'string'
		) {
			return 0;
		}

		const comparison = ( firstValue ?? '' ).localeCompare( secondValue ?? '' );

		return comparison * sortOrder;
	};

export const getReverseSimpleSortFunctionBy =
	( column: keyof DomainData ) => ( first: DomainData, second: DomainData, sortOrder: number ) =>
		getSimpleSortFunctionBy( column )( first, second, sortOrder ) * -1;

export const getSiteSortFunctions = () => {
	return [
		( first: DomainData, second: DomainData, sortOrder: number, sites?: SiteDetails[] ) => {
			// sort all domain olny sites after/before the other sites
			const firstSite = sites && sites[ first?.blog_id ];
			const secondSite = sites && sites[ second?.blog_id ];

			if ( firstSite?.options?.is_domain_only && secondSite?.options?.is_domain_only ) {
				return 0;
			}

			if ( firstSite?.options?.is_domain_only ) {
				return 1 * sortOrder;
			}

			if ( secondSite?.options?.is_domain_only ) {
				return -1 * sortOrder;
			}

			return 0;
		},
		( first: DomainData, second: DomainData, sortOrder: number, sites?: SiteDetails[] ) => {
			const firstSite = sites && sites[ first?.blog_id ];
			const secondSite = sites && sites[ second?.blog_id ];

			const firstTitle = firstSite?.title || firstSite?.slug;
			const secondTitle = secondSite?.title || secondSite?.slug;

			return ( firstTitle ?? '' ).localeCompare( secondTitle ?? '' ) * sortOrder;
		},
		getSimpleSortFunctionBy( 'domain' ),
	];
};

export const getStatusSortFunctions = (
	translate: I18N[ 'translate' ],
	domainStatusPurchaseActions?: DomainStatusPurchaseActions
) => {
	const getStatusWeight = ( domain: DomainData ) => {
		const responseDomain = createSiteDomainObject( domain );
		const isPurchased = domainStatusPurchaseActions?.isPurchasedDomain?.( responseDomain );
		const isCreditCardExpiring =
			domainStatusPurchaseActions?.isCreditCardExpiring?.( responseDomain );
		const { listStatusWeight } = resolveDomainStatus( responseDomain, {
			translate,
			isPurchasedDomain: isPurchased,
			isCreditCardExpiring: isCreditCardExpiring,
			getMappingErrors: true,
		} );
		return listStatusWeight ?? 0;
	};

	const compareStatus = ( first: DomainData, second: DomainData, sortOrder: number ) => {
		const firstStatusWeight = getStatusWeight( first );
		const secondStatusWeight = getStatusWeight( second );
		return ( firstStatusWeight - secondStatusWeight ) * sortOrder;
	};

	return [ compareStatus, getReverseSimpleSortFunctionBy( 'domain' ) ];
};

export const shouldHideOwnerColumn = ( domains: DomainData[] ) => {
	return ! domains.some( ( domain ) => domain.owner && ! domain.current_user_is_owner );
};
export const countDomainsRequiringAttention = (
	domainStatutes: ResolveDomainStatusReturn[] | undefined
) =>
	domainStatutes?.filter( ( domainStatus ) =>
		[ 'status-neutral', 'status-alert', 'status-warning', 'status-error' ].includes(
			domainStatus.statusClass
		)
	).length;
