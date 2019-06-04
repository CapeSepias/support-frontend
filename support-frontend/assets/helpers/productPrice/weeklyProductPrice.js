// @flow

import {
  countryGroups,
  fromCountry,
  GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type {
  BillingPeriod,
  WeeklyBillingPeriod,
} from 'helpers/billingPeriods';
import type {
  Price,
  ProductPrices,
  Promotion,
} from 'helpers/productPrice/productPrices';
import {
  getPromotion as genericGetPromotion,
  regularPrice as genericRegularPrice,
} from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';
import { getPromotionWeeklyProductPrice } from 'helpers/subscriptions';
import { currencies, detect } from 'helpers/internationalisation/currency';
import { NoProductOptions } from 'helpers/productPrice/productOptions';

const getPromotionPrice = (country: IsoCountry, period: WeeklyBillingPeriod, promoCode: string) => {
  const countryGroupId = fromCountry(country) || GBPCountries;
  return [
    currencies[detect(countryGroupId)].extendedGlyph,
    getPromotionWeeklyProductPrice(countryGroupId, period, promoCode),
  ].join('');
};

function getPromotion(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
): ?Promotion {
  return genericGetPromotion(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    NoProductOptions,
  );
}

function regularPrice(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
): Price {
  return genericRegularPrice(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    NoProductOptions,
  );
}


const getFulfilmentOption = (country: IsoCountry) =>
  (countryGroups.International.countries.includes(country) ? RestOfWorld : Domestic);

export { getPromotion, regularPrice, getFulfilmentOption, getPromotionPrice };
