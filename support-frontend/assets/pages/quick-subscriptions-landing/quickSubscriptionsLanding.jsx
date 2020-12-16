// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import FooterContainer from 'components/footerCompliant/footerContainer';
import { detect, type CountryGroupId, AUDCountries, Canada, EURCountries, GBPCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';

import { getSubscriptionCopy } from './copy/subscriptionCopy';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import subscriptionsLandingReducer
  from 'pages/subscriptions-landing/subscriptionsLandingReducer';

import Hero from './components/hero/hero';
import SubscriptionsProduct from './components/subscriptionsProduct';
// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();
const store = pageInit(() => subscriptionsLandingReducer(), true);

const state = store.getState();

const subscriptionCopy = getSubscriptionCopy(state);

const Header = headerWithCountrySwitcherContainer({
  path: '/subscribe',
  countryGroupId,
  listOfCountryGroups: [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    Canada,
    NZDCountries,
    International,
  ],
  trackProduct: 'GuardianWeekly',
});


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={
        <FullWidthContainer theme="brand">
          <CentredContainer>
            <FooterContainer faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions" centred />
          </CentredContainer>
        </FullWidthContainer>
      }
    >
      <Hero />
      <FullWidthContainer>
        <CentredContainer>
          <Block>
            {subscriptionCopy.map(product => (
              <SubscriptionsProduct
                title={product.title}
                subtitle={product.subtitle || ''}
                description={product.description}
                productImage={product.productImage}
                buttons={product.buttons}
                offer={product.offer || null}
                isFeature={false}
                classModifier={product.classModifier || []}
              />
          ))}
          </Block>
        </CentredContainer>
      </FullWidthContainer>
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-quick-landing-page');
