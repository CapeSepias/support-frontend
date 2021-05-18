// @flow

// ----- Imports ----- //

import { renderPage } from 'helpers/render';
import React from 'react';
import { Provider } from 'react-redux';
import { css } from '@emotion/core';
import { from, until } from '@guardian/src-foundations/mq';

import {
  AUDCountries,
  Canada,
  type CountryGroupId,
  EURCountries,
  GBPCountries,
  International,
  NZDCountries,
  UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { routes } from 'helpers/routes';
import { useHasBeenSeen } from 'helpers/useHasBeenSeen';

import Page from 'components/page/page';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';

import { getPromotionCopy } from 'helpers/productPrice/promotions';

import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import { DigitalHero } from './components/hero/hero';
import ProductBlock from './components/productBlock/productBlock';
import ProductBlockAus from './components/productBlock/productBlockAus';
import digitalSubscriptionLandingReducer, { type State }
  from './digitalSubscriptionLandingReducer';
import Prices from './components/prices';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import { StatelessFooter } from 'components/footerCompliant/DigitalFooter';
import FeedbackWidget from 'pages/digital-subscription-landing/components/feedbackWidget/feedbackWidget';
import { getHeroCtaProps } from './components/paymentSelection/helpers/paymentSelection';

import { digitalLandingProps, type DigitalLandingPropTypes } from './digitalSubscriptionLandingProps';

// ----- Styles ----- //
import 'stylesheets/skeleton/skeleton.scss';

const productBlockContainer = css`
  ${until.tablet} {
    margin-top: 0;
    padding-top: 0;
  }

  ${from.tablet} {
    margin-top: 66px;
  }
`;

// ----- Redux Store ----- //

const store = pageInit(() => digitalSubscriptionLandingReducer, true);

const { common }: State = store.getState();
const { internationalisation, abParticipations } = common;
const showPriceCardsInHero = abParticipations.priceCardsInHeroTest === 'variant';

// ----- Internationalisation ----- //

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'digital-subscription-landing-page-uk',
  UnitedStates: 'digital-subscription-landing-page-us',
  AUDCountries: 'digital-subscription-landing-page-au',
  EURCountries: 'digital-subscription-landing-page-eu',
  NZDCountries: 'digital-subscription-landing-page-nz',
  Canada: 'digital-subscription-landing-page-ca',
  International: 'digital-subscription-landing-page-int',
};


// ----- Render ----- //
function DigitalLandingPage({
  countryGroupId,
  currencyId,
  productPrices,
  promotionCopy,
  orderIsAGift,
}: DigitalLandingPropTypes) {
  if (!productPrices) {
    return null;
  }

  const isGift = orderIsAGift || false;

  const path = orderIsAGift ? routes.digitalSubscriptionLandingGift : routes.digitalSubscriptionLanding;
  const giftNonGiftLink = orderIsAGift ? routes.digitalSubscriptionLanding : routes.digitalSubscriptionLandingGift;
  const sanitisedPromoCopy = getPromotionCopy(promotionCopy);

  // For CTAs in hero test
  const heroPriceList = getHeroCtaProps(
    productPrices,
    internationalisation.currencyId,
    internationalisation.countryGroupId,
  );

  const CountrySwitcherHeader = headerWithCountrySwitcherContainer({
    path,
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
    trackProduct: 'DigitalPack',
  });

  const [widgetShouldDisplay, setElementToObserve] = useHasBeenSeen({
    threshold: 0.3,
    debounce: true,
  });

  const footer = (
    <div className="footer-container">
      <div className="footer-alignment">
        <StatelessFooter
          country={countryGroupId}
          orderIsAGift={isGift}
          productPrices={productPrices}
          centred
        />
      </div>
    </div>);

  return (
    <Provider store={store}>
      <Page
        header={<CountrySwitcherHeader />}
        footer={footer}
      >
        <DigitalHero
          orderIsAGift={isGift}
          countryGroupId={countryGroupId}
          promotionCopy={sanitisedPromoCopy}
          showPriceCards={showPriceCardsInHero}
          priceList={heroPriceList}
        />
        <FullWidthContainer>
          <CentredContainer>
            <Block cssOverrides={productBlockContainer}>
              <div ref={setElementToObserve}>
                {countryGroupId === AUDCountries ?
                  <ProductBlockAus
                    countryGroupId={countryGroupId}
                  /> :
                  <ProductBlock
                    countryGroupId={countryGroupId}
                  />
              }
              </div>
            </Block>
          </CentredContainer>
        </FullWidthContainer>
        <FullWidthContainer theme="dark" hasOverlap>
          <CentredContainer>
            <Prices
              countryGroupId={countryGroupId}
              currencyId={currencyId}
              productPrices={productPrices}
              orderIsAGift={isGift}
            />
          </CentredContainer>
        </FullWidthContainer>
        <FullWidthContainer theme="white">
          <CentredContainer>
            <GiftNonGiftCta product="digital" href={giftNonGiftLink} orderIsAGift={isGift} />
          </CentredContainer>
        </FullWidthContainer>
        <FeedbackWidget display={widgetShouldDisplay} />
      </Page>
    </Provider>
  );

}

renderPage(<DigitalLandingPage {...digitalLandingProps} />, reactElementId[digitalLandingProps.countryGroupId]);
