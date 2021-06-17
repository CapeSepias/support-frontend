import { Monthly } from 'helpers/productPrice/billingPeriods';
import { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { ProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { CountryGroupPrices, ProductPrice, ProductPrices } from 'helpers/productPrice/productPrices';
import { finalPrice as genericFinalPrice, getProductPrice as genericGetProductPrice } from 'helpers/productPrice/productPrices';
import { applyDiscount, getAppliedPromo } from 'helpers/productPrice/promotions';

const country = 'GB';
const billingPeriod = Monthly;

function getProductPrice(productPrices: ProductPrices, fulfilmentOption: FulfilmentOptions | null | undefined, productOption: ProductOptions | null | undefined): ProductPrice {
  return genericGetProductPrice(productPrices, country, billingPeriod, fulfilmentOption, productOption);
}

function finalPrice(productPrices: ProductPrices, fulfilmentOption: FulfilmentOptions | null | undefined, productOption: ProductOptions | null | undefined): ProductPrice {
  return genericFinalPrice(productPrices, country, billingPeriod, fulfilmentOption, productOption);
}

function getSavingsForFulfilmentOption(prices: CountryGroupPrices, fulfilmentOption: FulfilmentOptions) {
  return ActivePaperProductTypes.map((productOption) => {
    const price = prices[fulfilmentOption][productOption].Monthly.GBP;
    return price.savingVsRetail || 0;
  });
}

function getMaxSavingVsRetail(productPrices: ProductPrices): number {
  const countryPrices = productPrices['United Kingdom'];
  const allSavings = getSavingsForFulfilmentOption(countryPrices, Collection).concat(getSavingsForFulfilmentOption(countryPrices, HomeDelivery));
  return Math.max(...allSavings);
}

function getPriceWithDiscount(productPrices: ProductPrices, fulfilmentOption: FulfilmentOptions, productOption: ProductOptions) {
  const basePrice = getProductPrice(productPrices, fulfilmentOption, productOption);
  return applyDiscount(basePrice, getAppliedPromo(basePrice.promotions));
}

export { getProductPrice, finalPrice, getMaxSavingVsRetail, getPriceWithDiscount };
