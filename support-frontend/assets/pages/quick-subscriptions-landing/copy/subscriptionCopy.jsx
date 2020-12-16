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
import GridPicture from 'components/gridPicture/gridPicture';
import GridImage from 'components/gridImage/gridImage';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';
import PaperAndDigitalPackshot
  from 'components/packshots/paper-and-digital-packshot';
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

import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import PaperPackshot from 'components/packshots/paper-packshot';

import DigitalSubscriptionDetails from '../components/product-content/digitalSubscription';
import WeeklySubscriptionDetails from '../components/product-content/weeklySubscription';

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
  detail?: React.Node
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

const getDigitalImage = () => (<GridPicture
  sources={[
          {
            gridId: 'editionsPackshot',
            srcSizes: [500, 140],
            imgType: 'png',
            sizes: '100%',
            media: '(max-width: 739px)',
          },
          {
            gridId: 'editionsPackshot',
            srcSizes: [500],
            imgType: 'png',
            sizes: '(min-width: 740px) 500px',
            media: '(min-width: 740px)',
          },
        ]}
  fallback="editionsPackshot"
  fallbackSize={500}
  altText=""
  fallbackImgType="png"
/>);

const digital = (countryGroupId: CountryGroupId, priceCopy: PriceCopy): ProductCopy => ({
  title: 'Digital Subscription',
  subtitle: getDisplayPrice(countryGroupId, priceCopy.price),
  description: countryGroupId === AUDCountries
    ? 'The Guardian Editions app including Australia Weekend, Premium access to The Guardian Live app and ad-free reading on theguardian.com'
    : 'The Guardian Editions app, Premium access to The Guardian Live app and ad-free reading on theguardian.com',
  productImage: getDigitalImage(),
  offer: priceCopy.discountCopy,
  buttons: [{
    ctaButtonText: 'Subscribe now for £5.99/month',
    link: `${getOrigin()}/subscribe/digital/checkout?period=Monthly&promoCode=DK0NT24WG`,
    analyticsTracking: sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', abTest, 'digital-subscription'),
  },
  {
    ctaButtonText: 'See gift options',
    link: `${getOrigin()}/subscribe/digital/gift`,
    analyticsTracking: sendTrackingEventsOnClick('digipack_cta_gift', 'DigitalPack', abTest, 'digital-subscription'),
    modifierClasses: '',
  }],
  detail: <DigitalSubscriptionDetails />,
});

const getWeeklyImage = () => (<GridImage
  gridId="subscriptionGuardianWeeklyPackShot"
  srcSizes={[500, 140]}
  sizes="(max-width: 739px) 140px,
         (max-width: 979px) 500px,
         (max-width: 1140px) 500px,
         500px"
  imgType="png"
/>);

const guardianWeekly = (countryGroupId: CountryGroupId, priceCopy: PriceCopy): ProductCopy => ({
  title: 'The Guardian Weekly',
  subtitle: getDisplayPrice(countryGroupId, priceCopy.price, Quarterly),
  description: 'A weekly, global magazine from The Guardian, with delivery worldwide',
  offer: getGuardianWeeklyOfferCopy(countryGroupId, priceCopy.discountCopy),
  buttons: [
    {
      ctaButtonText: 'Subscribe now for just £6',
      link: `${getOrigin()}/subscribe/weekly/checkout?period=SixWeekly`,
      analyticsTracking: sendTrackingEventsOnClick('weekly_cta', 'GuardianWeekly', abTest),
    },
    {
      ctaButtonText: 'See gift options',
      link: `${getOrigin()}/subscribe/weekly/gift`,
      analyticsTracking: sendTrackingEventsOnClick('weekly_cta_gift', 'GuardianWeekly', abTest),
      modifierClasses: '',
    },
  ],
  productImage: getWeeklyImage(),
  detail: <WeeklySubscriptionDetails />,
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
    ctaButtonText: 'Find out more',
    link: `${getOrigin()}/subscribe/paper`,
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
      ctaButtonText: 'Find out more',
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
      digital(countryGroupId, state.page.pricingCopy[DigitalPack]),
      guardianWeekly(countryGroupId, state.page.pricingCopy[GuardianWeekly]),
      paper(countryGroupId, state.page.pricingCopy[Paper], false),
      paperAndDigital(countryGroupId, state.common.referrerAcquisitionData, state.common.abParticipations),
      premiumApp(countryGroupId),
    ];
  } else if (countryGroupId === EURCountries) {
    return [
      guardianWeekly(countryGroupId, state.page.pricingCopy[GuardianWeekly]),
      digital(countryGroupId, state.page.pricingCopy[DigitalPack]),
      premiumApp(countryGroupId),
    ];
  }
  return [
    digital(countryGroupId, state.page.pricingCopy[DigitalPack]),
    guardianWeekly(countryGroupId, state.page.pricingCopy[GuardianWeekly]),
    premiumApp(countryGroupId),
  ];

};

const getSubscriptionCopy = (state: State) =>
  orderedProducts(state);

export { getSubscriptionCopy };
