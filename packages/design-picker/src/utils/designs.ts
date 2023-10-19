import { isWithinBreakpoint } from '@automattic/viewport';
import { addQueryArgs } from '@wordpress/url';
import { DEFAULT_VIEWPORT_HEIGHT } from '../constants';
import type { Design, DesignPreviewOptions } from '../types';

function encodeParenthesesInText( text: string ) {
	return encodeURIComponent( text ).replace( /\(/g, '%28' ).replace( /\)/g, '%29' );
}

export const getDesignPreviewUrl = (
	design: Design,
	options: DesignPreviewOptions = {}
): string => {
	const { recipe, slug, preview_data } = design;

	//Anchor.fm themes get previews from their starter sites, ${slug}starter.wordpress.com
	if ( [ 'hannah', 'riley', 'gilbert' ].indexOf( slug ) >= 0 ) {
		return `https://${ slug }starter.wordpress.com`;
	}

	let url = addQueryArgs( 'https://public-api.wordpress.com/wpcom/v2/block-previews/site', {
		stylesheet: recipe?.stylesheet,
		pattern_ids: recipe?.pattern_ids?.join( ',' ),
		header_pattern_ids: recipe?.header_pattern_ids
			? recipe?.header_pattern_ids.join( ',' )
			: undefined,
		footer_pattern_ids: recipe?.footer_pattern_ids
			? recipe?.footer_pattern_ids.join( ',' )
			: undefined,
		language: options.language,
		viewport_height: ! options.disable_viewport_height
			? options.viewport_height || DEFAULT_VIEWPORT_HEIGHT
			: undefined,
		...( options.use_screenshot_overrides && {
			use_screenshot_overrides: options.use_screenshot_overrides,
		} ),
		remove_assets: options.remove_assets,
		...( options.style_variation &&
			options.style_variation.slug !== 'default' && {
				style_variation: options.style_variation.title,
			} ),
		...( options.viewport_unit_to_px && {
			viewport_unit_to_px: options.viewport_unit_to_px,
		} ),
	} );

	// The preview url is sometimes used in a `background-image: url()` CSS rule and unescaped
	// parentheses in the URL break it. `addQueryArgs` and `encodeURIComponent` don't escape
	// parentheses so we've got to do it ourselves.
	const siteTitle = options.site_title || preview_data?.site_title || design.title;
	if ( siteTitle ) {
		url += `&site_title=${ encodeParenthesesInText( siteTitle ) }`;
	}

	const siteTagline = options.site_tagline || preview_data?.site_tagline;
	if ( siteTagline ) {
		url += `&site_tagline=${ encodeParenthesesInText( siteTagline ) }`;
	}

	if ( preview_data?.site_logo_url ) {
		url += `&site_logo_url=${ encodeParenthesesInText( preview_data?.site_logo_url ) }`;
	}

	return url;
};

export const isAssemblerDesign = ( design?: Design ) => design?.design_type === 'assembler';

// Go to the assembler only when the viewport width >= 960px as the it doesn't support small
// screen for now.
export const isAssemblerSupported = () => isWithinBreakpoint( '>=960px' );
