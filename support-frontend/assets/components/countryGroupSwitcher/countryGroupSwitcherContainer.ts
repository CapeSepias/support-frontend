// ----- Imports ----- //
import { connect } from 'react-redux';
import { Option } from 'helpers/types/option';
import { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { CommonState } from 'helpers/page/commonReducer';
import {
	sendTrackingEventsOnClick,
	SubscriptionProduct,
} from 'helpers/productPrice/subscriptions';
import CountryGroupSwitcher, { PropTypes } from './countryGroupSwitcher'; // ------ Component ----- //

export default function (
	subPath: string,
	listOfCountries: CountryGroupId[],
	trackProduct?: Option<SubscriptionProduct>,
) {
	function onCountryGroupSelect(cgId: CountryGroupId): void {
		sendTrackingEventsOnClick({
			id: `toggle_country_${cgId}`,
			...(trackProduct
				? {
						product: trackProduct,
				  }
				: {}),
			componentType: 'ACQUISITIONS_OTHER',
		})();
	}

	function mapStateToProps(state: { common: CommonState }): PropTypes {
		return {
			countryGroupIds: listOfCountries,
			selectedCountryGroup: state.common.internationalisation.countryGroupId,
			subPath,
			onCountryGroupSelect,
		};
	}

	return connect(mapStateToProps)(CountryGroupSwitcher);
}
