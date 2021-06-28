// ----- Imports ----- //
import { combineReducers } from 'redux';
import { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
export type PriceCopy = {
	price: number;
	discountCopy: string;
};
export type PricingCopy = Record<SubscriptionProduct, PriceCopy>;
export type State = {
	common: CommonState;
	page: {
		pricingCopy: PricingCopy;
	};
};

const getPricingCopy = (): PricingCopy | null | undefined =>
	getGlobal('pricingCopy'); // ----- Export ----- //

export default () =>
	combineReducers({
		pricingCopy: getPricingCopy,
	});
