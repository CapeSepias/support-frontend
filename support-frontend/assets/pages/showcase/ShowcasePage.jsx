// @flow

// ----- Imports ----- //
import React from 'react';
import { Provider } from 'react-redux';
import {
  combineReducers,
  createStore,
} from 'redux';
import { initialState } from './initialState';
import { createCommonReducer } from 'helpers/page/commonReducer';

import Page from 'components/page/page';
import Footer from 'components/footerCompliant/Footer';
// import Heading from 'components/heading/heading';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries, AUDCountries, Canada, EURCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';


// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const CountrySwitcherHeader = headerWithCountrySwitcherContainer({
  path: '/support',
  countryGroupId,
  listOfCountryGroups: [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    NZDCountries,
    Canada,
    International,
  ],
});

export const ShowcasePage = () => {


  const commonReducer = createCommonReducer(initialState);

  const store = createStore(combineReducers({ page: null, common: commonReducer }));

  return (
    <Provider store={store}>
      <Page header={<CountrySwitcherHeader />} footer={<Footer />}>
        <h1>Showcase</h1>
      </Page>
    </Provider>
  );
};
