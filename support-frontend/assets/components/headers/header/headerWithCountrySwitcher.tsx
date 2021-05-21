// ----- Imports ----- //
import React from 'react';
import countrySwitcherContainer from 'components/countryGroupSwitcher/countryGroupSwitcherContainer';
import { Option } from 'helpers/types/option';
import 'helpers/types/option';
import { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import { SubscriptionProduct } from 'helpers/subscriptions';
import 'helpers/subscriptions';
import Header from './header'; // ------ Component ----- //

export default function ({
  path,
  countryGroupId,
  listOfCountryGroups,
  trackProduct,
}: {
  path: string;
  countryGroupId: CountryGroupId;
  listOfCountryGroups: CountryGroupId[];
  trackProduct?: Option<SubscriptionProduct>;
}) {
  const Switcher = countrySwitcherContainer(
    path,
    listOfCountryGroups,
    trackProduct,
  );
  return () => (
    <Header countryGroupId={countryGroupId} utility={<Switcher />} />
  );
}
