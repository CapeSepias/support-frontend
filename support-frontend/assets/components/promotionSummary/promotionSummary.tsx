// ----- Imports ----- //
import React from 'react';
import {
	ProductPrices,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import {
	billingPeriodNoun,
	BillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import {
	countryGroups,
	fromCountry,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { IsoCountry } from 'helpers/internationalisation/country';
import { fixDecimals } from 'helpers/productPrice/subscriptions';
import { Option } from 'helpers/types/option';

import { getPromotion } from 'helpers/productPrice/promotions';

export type PropTypes = {
	productPrices: ProductPrices;
	country: Option<IsoCountry>;
	billingPeriod: BillingPeriod;
};

const displayPrice = (glyph: string, price: number) =>
	`${glyph}${fixDecimals(price)}`;

const billingPeriodQuantifier = (
	numberOfBillingPeriods: number,
	noun: string,
) =>
	numberOfBillingPeriods > 1
		? `/${noun} for ${numberOfBillingPeriods} ${noun}s`
		: ` for 1 ${noun}`;

function getSummary(
	glyph: string,
	price: number,
	discountedPrice: number,
	numberOfDiscountedPeriods: number | null | undefined,
	billingPeriod: BillingPeriod,
) {
	const noun = billingPeriodNoun(billingPeriod).toLowerCase();

	if (
		numberOfDiscountedPeriods !== undefined &&
		numberOfDiscountedPeriods !== null
	) {
		const discountCopy = `${displayPrice(
			glyph,
			discountedPrice,
		)}${billingPeriodQuantifier(numberOfDiscountedPeriods, noun)}`;
		const standardCopy = `then standard rate (${displayPrice(
			glyph,
			price,
		)}/${noun})`;
		return `${discountCopy}, ${standardCopy}`;
	}

	return null;
}

function discountSummary(
	price: number,
	promoCode: string,
	discountedPrice: number,
	discountAmount: number,
	numberOfDiscountedPeriods: number | null | undefined,
	billingPeriod: BillingPeriod,
	country: IsoCountry,
) {
	const countryGroup = countryGroups[fromCountry(country) || GBPCountries];
	const { glyph } = currencies[countryGroup.currency];
	return (
		<div className="component-promotion-summary">
			<h3 className="component-promotion-summary__heading">
				Promotion applied ({promoCode})
			</h3>
			<p>
				{getSummary(
					glyph,
					price,
					discountedPrice,
					numberOfDiscountedPeriods,
					billingPeriod,
				)}
			</p>
		</div>
	);
}

function PromotionSummary(props: PropTypes) {
	if (props.country) {
		const { country } = props;
		const productPrice = getProductPrice(
			props.productPrices,
			country,
			props.billingPeriod,
		);
		const promotion = getPromotion(
			props.productPrices,
			country,
			props.billingPeriod,
		);

		if (promotion && promotion.discountedPrice && promotion.discount) {
			return discountSummary(
				productPrice.price,
				promotion.promoCode,
				promotion.discountedPrice,
				promotion.discount.amount,
				promotion.numberOfDiscountedPeriods,
				props.billingPeriod,
				country,
			);
		}
	}

	return null;
}

export { PromotionSummary, getSummary };
