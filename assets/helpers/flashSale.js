// @flow

import { getQueryParameter } from 'helpers/url';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { fixDecimals } from 'helpers/subscriptions';

import type { SubscriptionProduct } from './subscriptions';

export type SaleCopy = {
  featuredProduct: {
    heading: string,
    subHeading: string,
    description: string,
  },
  landingPage: {
    heading: string,
    subHeading: string,
  },
  bundle: {
    heading: string,
    subHeading: string,
    description: string,
  },
}

type SaleDetails = {
  [CountryGroupId]: {
    promoCode: string,
    intcmp: string,
    price: number,
    saleCopy: SaleCopy,
  },
};

type Sale = {
  subscriptionProduct: SubscriptionProduct,
  activeRegions: CountryGroupId[],
  startTime: number,
  endTime: number,
  saleDetails: SaleDetails,
};

// Days are 1 based, months are 0 based
const Sales: Sale[] = [
  {
    subscriptionProduct: 'DigitalPack',
    activeRegions: ['GBPCountries'],
    startTime: new Date(2018, 11, 20).getTime(), // 20 Dec 2018
    endTime: new Date(2019, 0, 3).getTime(), // 3 Jan 2019
    saleDetails: {
      GBPCountries: {
        promoCode: 'DDPCS99X',
        intcmp: '',
        price: 8.99,
        saleCopy: {
          featuredProduct: {
            heading: 'Digital Pack',
            subHeading: 'Save 25% for a year',
            description: 'Read The Guardian ad-free on all devices, including the Premium App and Daily Edition iPad app. £8.99/month for your first year.',
          },
          landingPage: {
            heading: 'Digital Pack',
            subHeading: 'Save 25% - £8.99/month for a year, then £11.99/month',
          },
          bundle: {
            heading: 'Digital Pack',
            subHeading: '£8.99/month for a year then £11.99/month',
            description: 'The Premium App and the daily edition iPad app in one pack, plus ad-free reading on all your devices',
          },
        },
      },
    },
  },
];

function sortSalesByStartTimesDescending(a: Sale, b: Sale) {
  return b.startTime - a.startTime;
}

function getSales(product: SubscriptionProduct, countryGroupId: CountryGroupId = detect()): Sale[] {
  return Sales.filter(sale =>
    sale.subscriptionProduct === product &&
    sale.activeRegions.includes(countryGroupId)).sort(sortSalesByStartTimesDescending);
}

function flashSaleIsActive(product: SubscriptionProduct, countryGroupId: CountryGroupId = detect()): boolean {
  const now = Date.now();
  const sales = getSales(product, countryGroupId).filter(sale =>
    (now > sale.startTime && now < sale.endTime) ||
    getQueryParameter('flash_sale') === 'true');

  return sales.length > 0;
}

function getPromoCode(
  product: SubscriptionProduct,
  countryGroupId?: CountryGroupId = detect(),
  defaultCode: string,
): string {
  if (flashSaleIsActive(product, countryGroupId)) {
    const sale = getSales(product, countryGroupId)[0];
    return sale && sale.saleDetails[countryGroupId].promoCode;
  }
  return defaultCode;
}

function getIntcmp(
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId = detect(),
  intcmp: ?string,
  defaultIntcmp: string,
): string {
  if (flashSaleIsActive(product)) {
    const sale = getSales(product, countryGroupId)[0];
    return (sale && sale.saleDetails[countryGroupId].intcmp) || intcmp || defaultIntcmp;
  }
  return intcmp || defaultIntcmp;
}

function getEndTime(product: SubscriptionProduct, countryGroupId: CountryGroupId) {
  const sale = getSales(product, countryGroupId)[0];
  return sale && sale.endTime;
}

function getSaleCopy(product: SubscriptionProduct, countryGroupId: CountryGroupId): SaleCopy {
  const emptyCopy = {
    featuredProduct: {
      heading: '',
      subHeading: '',
      description: '',
    },
    landingPage: {
      heading: '',
      subHeading: '',
    },
    bundle: {
      heading: '',
      subHeading: '',
      description: '',
    },
  };
  if (flashSaleIsActive(product, countryGroupId)) {
    const sale = getSales(product, countryGroupId)[0];
    return sale.saleDetails[countryGroupId].saleCopy;
  }
  return emptyCopy;
}

function getFormattedFlashSalePrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const sale = getSales(product, countryGroupId)[0];
  return fixDecimals(sale.saleDetails[countryGroupId].price);
}

export {
  flashSaleIsActive,
  getPromoCode,
  getIntcmp,
  getEndTime,
  getSaleCopy,
  getFormattedFlashSalePrice,
};
