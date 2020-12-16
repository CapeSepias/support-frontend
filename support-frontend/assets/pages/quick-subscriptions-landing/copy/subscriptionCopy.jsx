// @flow
import * as React from 'react';
// constants
import {
  DigitalPack,
  displayPrice, fixDecimals,
  GuardianWeekly,
  Paper,
  PaperAndDigital,
  sendTrackingEventsOnClick,
  subscriptionPricesForDefaultBillingPeriod,
  type SubscriptionProduct,
} from 'helpers/subscriptions';
import { getCampaign } from 'helpers/tracking/acquisitions';
import {
  androidAppUrl,
  getIosAppUrl,
  getSubsLinks,
} from 'helpers/externalLinks';
import trackAppStoreLink from 'helpers/tracking/appCtaTracking';
// images
import GuardianWeeklyPackShot
  from 'components/packshots/guardian-weekly-packshot';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';
import PaperAndDigitalPackshot
  from 'components/packshots/paper-and-digital-packshot';
import GuardianWeeklyPackShotHero
  from 'components/packshots/guardian-weekly-packshot-hero';
import DigitalPackshotHero
  from 'components/packshots/digital-packshot-hero';
import DigitalPackshot
  from 'components/packshots/digital-packshot';
import PrintFeaturePackshot from 'components/packshots/print-feature-packshot';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  AUDCountries,
  GBPCountries,
  EURCountries,
} from 'helpers/internationalisation/countryGroup';
import type { Option } from 'helpers/types/option';
import {
  flashSaleIsActive,
  getDisplayFlashSalePrice,
  getSaleCopy,
} from 'helpers/flashSale';
import { Monthly, Quarterly } from 'helpers/billingPeriods';
import {
  currencies, detect,
  fromCountryGroupId,
  glyph,
} from 'helpers/internationalisation/currency';
import { getOrigin } from 'helpers/url';

import type { State, PriceCopy } from '../quickSubscriptionsLandingReducer';
import type { BillingPeriod } from 'helpers/billingPeriods';
import {
  digitalSubscriptionLanding,
  guardianWeeklyLanding,
  paperCheckoutUrl,
} from 'helpers/routes';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import PaperPackshot from 'components/packshots/paper-packshot';

// types

export type ProductButton = {
  ctaButtonText: string,
  link: string,
  analyticsTracking: Function,
  hierarchy?: string,
}

export type ProductCopy = {
  title: string,
  subtitle: Option<string>,
  description: string,
  productImage: React.Node,
  offer?: string,
  buttons: ProductButton[],
  classModifier?: string[],
}

const abTest = null;

const getPrice = (countryGroupId: CountryGroupId, product: SubscriptionProduct) => {

  if (flashSaleIsActive(product, countryGroupId)) {
    return getDisplayFlashSalePrice(product, countryGroupId, Monthly);
  }

  if (subscriptionPricesForDefaultBillingPeriod[product][countryGroupId]) {
    return `${displayPrice(product, countryGroupId)}`;
  }

  return '';
};

const getDisplayPrice = (
  countryGroupId: CountryGroupId,
  price: number,
  billingPeriod: BillingPeriod = Monthly,
): string => {
  const currency = currencies[detect(countryGroupId)].glyph;
  return `${currency}${fixDecimals(price)}/${billingPeriod}`;
};

function getGuardianWeeklyOfferCopy(countryGroupId: CountryGroupId, discountCopy: string) {
  if (discountCopy !== '') {
    return discountCopy;
  }
  const currency = glyph(fromCountryGroupId(countryGroupId) || 'GBP');
  return `6 issues for ${currency}6`;
}

const getDigitalImage = (isTop: boolean, countryGroupId: CountryGroupId) => {
  if (isTop) {
    return <DigitalPackshotHero countryGroupId={countryGroupId} />;
  }
  return <DigitalPackshot countryGroupId={countryGroupId} />;
};

const digital = (countryGroupId: CountryGroupId, priceCopy: PriceCopy, isTop: boolean): ProductCopy => ({
  title: 'Digital Subscription',
  subtitle: getDisplayPrice(countryGroupId, priceCopy.price),
  description: countryGroupId === AUDCountries
    ? 'The Guardian Editions app including Australia Weekend, Premium access to The Guardian Live app and ad-free reading on theguardian.com'
    : 'The Guardian Editions app, Premium access to The Guardian Live app and ad-free reading on theguardian.com',
  productImage: getDigitalImage(isTop, countryGroupId),
  offer: priceCopy.discountCopy,
  buttons: [{
    ctaButtonText: 'Subscribe now',
    link: `${getOrigin()}/subscribe/digital/checkout?period=Monthly`,
    analyticsTracking: sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', abTest, 'digital-subscription'),
  },
  {
    ctaButtonText: 'Buy as a gift',
    link: `${getOrigin()}/subscribe/digital/checkout/gift?period=Quarterly`,
    analyticsTracking: sendTrackingEventsOnClick('digipack_cta_gift', 'DigitalPack', abTest, 'digital-subscription'),
    modifierClasses: '',
  }],
});

const getWeeklyImage = (isTop: boolean) => {
  if (isTop) {
    return <GuardianWeeklyPackShotHero />;
  }
  return <GuardianWeeklyPackShot />;
};

const guardianWeekly = (countryGroupId: CountryGroupId, priceCopy: PriceCopy, isTop: boolean): ProductCopy => ({
  title: 'The Guardian Weekly',
  subtitle: getDisplayPrice(countryGroupId, priceCopy.price, Quarterly),
  description: 'A weekly, global magazine from The Guardian, with delivery worldwide',
  offer: getGuardianWeeklyOfferCopy(countryGroupId, priceCopy.discountCopy),
  buttons: [
    {
      ctaButtonText: 'Subscribe now',
      link: `${getOrigin()}/subscribe/weekly/checkout?period=SixWeekly`,
      analyticsTracking: sendTrackingEventsOnClick('weekly_cta', 'GuardianWeekly', abTest),
    },
    {
      ctaButtonText: 'Buy as a gift',
      link: `${getOrigin()}/subscribe/weekly/checkout/gift?period=Quarterly`,
      analyticsTracking: sendTrackingEventsOnClick('weekly_cta_gift', 'GuardianWeekly', abTest),
      modifierClasses: '',
    },
  ],
  productImage: getWeeklyImage(isTop),
});

const getPaperImage = (isTop: boolean) => {
  if (isTop) {
    return <PrintFeaturePackshot />;
  }
  return <PaperPackshot />;
};

const paper = (countryGroupId: CountryGroupId, priceCopy: PriceCopy, isTop: boolean): ProductCopy => ({
  title: 'Paper',
  subtitle: `from ${getDisplayPrice(countryGroupId, priceCopy.price)}`,
  description: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
  buttons: [{
    ctaButtonText: 'Subscribe now',
    link: paperCheckoutUrl('Collection', 'Everyday'),
    analyticsTracking: sendTrackingEventsOnClick('paper_cta', Paper, abTest, 'paper-subscription'),
  }],
  productImage: getPaperImage(isTop),
  offer: priceCopy.discountCopy,
});

const paperAndDigital = (
  countryGroupId: CountryGroupId,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
): ProductCopy => {
  const link = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
    abParticipations,
  ).PaperAndDigital;
  return {
    title: 'Paper+Digital',
    subtitle: `from ${getPrice(countryGroupId, PaperAndDigital)}`,
    description: 'All the benefits of a paper subscription, plus access to the digital subscription',
    buttons: [{
      ctaButtonText: 'Subscribe now',
      link,
      analyticsTracking: sendTrackingEventsOnClick('paper_digital_cta', PaperAndDigital, abTest, 'paper-and-digital-subscription'),
    }],
    productImage: <PaperAndDigitalPackshot />,
    offer: getSaleCopy(PaperAndDigital, countryGroupId).bundle.subHeading,
  };
};

const premiumApp = (countryGroupId: CountryGroupId): ProductCopy => ({
  title: 'Premium access to the Guardian Live app',
  subtitle: '7-day free Trial',
  description: 'Ad-free live news, as it happens',
  buttons: [{
    ctaButtonText: 'Buy in App Store',
    link: getIosAppUrl(countryGroupId),
    analyticsTracking: trackAppStoreLink('premium_tier_ios_cta', 'PremiumTier', abTest),
  }, {
    ctaButtonText: 'Buy on Google Play',
    link: androidAppUrl,
    analyticsTracking: trackAppStoreLink('premium_tier_android_cta', 'PremiumTier', abTest),
    hierarchy: 'first',
  }],
  productImage: <PremiumAppPackshot />,
  classModifier: ['subscriptions__premuim-app'],
});

const orderedProducts = (state: State): ProductCopy[] => {
  const { countryGroupId } = state.common.internationalisation;
  if (countryGroupId === GBPCountries) {
    return [
      digital(countryGroupId, state.page.pricingCopy[DigitalPack], false),
      guardianWeekly(countryGroupId, state.page.pricingCopy[GuardianWeekly], false),
      paper(countryGroupId, state.page.pricingCopy[Paper], false),
      paperAndDigital(countryGroupId, state.common.referrerAcquisitionData, state.common.abParticipations),
      premiumApp(countryGroupId),
    ];
  } else if (countryGroupId === EURCountries) {
    return [
      guardianWeekly(countryGroupId, state.page.pricingCopy[GuardianWeekly], false),
      digital(countryGroupId, state.page.pricingCopy[DigitalPack], false),
      premiumApp(countryGroupId),
    ];
  }
  return [
    digital(countryGroupId, state.page.pricingCopy[DigitalPack], false),
    guardianWeekly(countryGroupId, state.page.pricingCopy[GuardianWeekly], false),
    premiumApp(countryGroupId),
  ];

};

const getSubscriptionCopy = (state: State) =>
  orderedProducts(state);

export { getSubscriptionCopy };
