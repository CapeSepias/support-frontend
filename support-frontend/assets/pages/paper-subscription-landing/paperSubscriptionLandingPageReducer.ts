// ----- Imports ----- //
import { combineReducers } from 'redux';
import { CommonState } from 'helpers/page/commonReducer';
import {
	Collection,
	PaperFulfilmentOptions,
} from 'helpers/productPrice/fulfilmentOptions';
import { ProductPrices } from 'helpers/productPrice/productPrices';
import { paperHasDeliveryEnabled } from 'helpers/productPrice/subscriptions';
import {
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { PromotionCopy } from 'helpers/productPrice/promotions';
import { TabActions } from './paperSubscriptionLandingPageActions';
// ----- Types ----- //
export type ActiveTabState = PaperFulfilmentOptions;
export type State = {
	common: CommonState;
	page: {
		productPrices: ProductPrices | null | undefined;
		promotionCopy: PromotionCopy | null | undefined;
		tab: ActiveTabState;
	};
};

// ----- Helpers ----- //
const getTabsReducer =
	(initialTab: PaperFulfilmentOptions) =>
	(state: ActiveTabState = initialTab, action: TabActions): ActiveTabState => {
		switch (action.type) {
			case 'SET_TAB':
				return paperHasDeliveryEnabled() ? action.tab : Collection;

			default:
				return state;
		}
	}; // ----- Exports ----- //

export default (initialTab: PaperFulfilmentOptions) =>
	combineReducers({
		productPrices: getProductPrices,
		promotionCopy: getPromotionCopy,
		tab: getTabsReducer(paperHasDeliveryEnabled() ? initialTab : Collection),
	});
