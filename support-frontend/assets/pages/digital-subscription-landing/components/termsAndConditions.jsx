// @flow
import React from 'react';
// styles
import './digitalSubscriptionLanding.scss';
import { promotionTermsUrl } from 'helpers/routes';
import { getPromotion } from 'helpers/productPrice/promotions';
import { connect } from 'react-redux';
import type { State } from 'pages/digital-subscription-landing/digitalSubscriptionLandingReducer';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly, Quarterly } from 'helpers/billingPeriods';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { Option } from 'helpers/types/option';

type PropTypes = {productPrices: ProductPrices, country: IsoCountry, orderIsAGift: boolean}

const mapStateToProps = (state: State) => ({
  country: state.common.internationalisation.countryId,
  productPrices: state.page.productPrices,
  orderIsAGift: state.page.orderIsAGift,
});

const getPromoUrl = (
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
): Option<string> => {
  const promotion = getPromotion(
    productPrices,
    country,
    billingPeriod,
    NoFulfilmentOptions,
    NoProductOptions,
  );
  return promotion ? promotionTermsUrl(promotion.promoCode) : null;
};

type LinkTypes = {
  productPrices: ProductPrices,
  country: IsoCountry,
}

const MaybeLink = (props: {href: Option<string>, text: string}) =>
  (props.href ? <a href={props.href}>{props.text}</a> : null);

const RegularLinks = (props: LinkTypes) => {
  const annualUrl = getPromoUrl(props.productPrices, props.country, Annual);
  const monthlyUrl = getPromoUrl(props.productPrices, props.country, Monthly);
  const multipleOffers: boolean = !!(annualUrl && monthlyUrl);
  return (
    <span>
      <MaybeLink href={monthlyUrl} text="monthly" />{multipleOffers ? ' and ' : ''}
      <MaybeLink href={annualUrl} text="annual" />
    &nbsp;offer{multipleOffers ? 's' : ''}
    </span>
  );
};

const GiftLinks = (props: LinkTypes) => {
  const annualUrl = getPromoUrl(props.productPrices, props.country, Annual);
  const quarterlyUrl = getPromoUrl(props.productPrices, props.country, Quarterly);
  const multipleOffers: boolean = !!(annualUrl && quarterlyUrl);
  return (
    <span>
      <MaybeLink href={quarterlyUrl} text="quarterly" />{multipleOffers ? ' and ' : ''}
      <MaybeLink href={annualUrl} text="annual" />
    &nbsp;offer{multipleOffers ? 's' : ''}
    </span>
  );
};

const TermsAndConditions = (props: PropTypes) => (
  <div className="hope-is-power__terms">
    <div className="hope-is-power--centered">
      <h3>Promotion terms and conditions</h3>
      <p>Offer subject to availability. Guardian News and Media Ltd
          (&quot;GNM&quot;) reserves the right to withdraw this promotion at any
          time. Full promotion terms and conditions for our&nbsp;
        {props.orderIsAGift ?
          <GiftLinks productPrices={props.productPrices} country={props.country} /> :
          <RegularLinks productPrices={props.productPrices} country={props.country} />
          }.
      </p>
    </div>
  </div>);

export default connect(mapStateToProps)(TermsAndConditions);
