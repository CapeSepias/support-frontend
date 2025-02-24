// @flow

// ----- Imports ----- //

import React from 'react';
import CentredContainer from 'components/containers/centredContainer';
import PageTitle from 'components/page/pageTitle';
import Hero from 'components/page/hero';
import HeroRoundel from 'components/page/heroRoundel';
import { promotionHTML, type PromotionCopy } from 'helpers/productPrice/promotions';
import { getTimeboundQuery, getTimeboundCopy } from 'helpers/timeBoundedCopy/timeBoundedCopy';
import { HeroPriceCards } from './heroPriceCards';
import DefaultRoundel from './defaultRoundel';
import {
  AUDCountries,
  UnitedStates,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import {
  heroCopy,
  heroTitle,
  paragraphs,
  yellowHeading,
  circleTextGeneric,
  roundelOverrides,
  embeddedRoundel,
} from './heroWithPriceCardsStyles';

type PropTypes = {
  promotionCopy: PromotionCopy,
  priceList: any[],
  countryGroupId: CountryGroupId,
}

const HeroCopy = () => (
  <>
    <p>
      <strong>With two innovative apps and ad-free reading,</strong> a digital subscription gives
      you the richest experience of Guardian journalism. It also sustains the independent reporting you love.
    </p>
  </>
);

const HeroCopyAus = () => (
  <>
    <p>
      <strong>With two innovative apps and ad-free reading,</strong> a digital subscription gives
      you the richest experience of Guardian journalism, while helping to sustain vital, independent reporting.
    </p>
    <p>
      Start your free trial today and enjoy exclusive access to the new weekly edition, Australia Weekend.
    </p>
  </>);


function HeroWithPriceCards({
  promotionCopy, priceList, countryGroupId,
}: PropTypes) {
  const title = promotionCopy.title || <>Subscribe for stories<br />
    <span css={yellowHeading}>that must be told</span></>;

  const promoCopy = promotionHTML(promotionCopy.description, { tag: 'div' });
  const roundelText = promotionHTML(promotionCopy.roundel, { css: circleTextGeneric }) || <DefaultRoundel />;
  const nonAusCopy = getTimeboundCopy('digitalSubscription', getTimeboundQuery() || new Date()) || <HeroCopy />;
  let defaultCopy;
  if (countryGroupId === AUDCountries) {
    defaultCopy = <HeroCopyAus />;
  } else if (countryGroupId === UnitedStates) {
    defaultCopy = <HeroCopy />;
  } else {
    defaultCopy = nonAusCopy;
  }
  const copy = promoCopy || defaultCopy;

  return (
    <PageTitle
      title="Digital subscription"
      theme="digital"
    >
      <CentredContainer>
        <Hero
          image={
            <HeroPriceCards
              priceList={priceList}
              roundel={
                <HeroRoundel cssOverrides={embeddedRoundel} theme="digital">
                  {roundelText}
                </HeroRoundel>}
            />
          }
          roundelElement={
            <HeroRoundel
              cssOverrides={roundelOverrides}
              theme="digital"
            >
              {roundelText}
            </HeroRoundel>
          }
        >
          <section css={heroCopy}>
            <h2 css={heroTitle}>{title}</h2>
            <div css={paragraphs}>
              {copy}
            </div>
          </section>
        </Hero>
      </CentredContainer>
    </PageTitle>
  );
}

export { HeroWithPriceCards };
