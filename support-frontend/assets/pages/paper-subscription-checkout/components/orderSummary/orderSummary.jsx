// @flow

import React from 'react';
import { connect } from 'react-redux';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import OrderSummary from 'components/orderSummary/orderSummary';
import OrderSummaryProduct from 'components/orderSummary/orderSummaryProduct';

import { paperProductsWithoutDigital, type ProductOptions } from 'helpers/productPrice/productOptions';
import { Collection, type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ActivePaperProducts } from 'helpers/productPrice/productOptions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getPriceWithDiscount, getProductPrice } from 'helpers/productPrice/paperProductPrices';

import { showPrice, type ProductPrices, type ProductPrice } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';

import { getOrderSummaryTitle, getPriceSummary } from 'pages/paper-subscription-checkout/helpers/orderSummaryText';

type PropTypes = {
  fulfilmentOption: FulfilmentOptions,
  productOption: ActivePaperProducts,
  billingPeriod: BillingPeriod,
  productPrices: ProductPrices,
  digiSubPrice: string,
  image: $Call<GridImageType, GridImg>,
  includesDigiSub: boolean,
  changeSubscription?: string | null,
  startDate?: string,
  total: ProductPrice,
};

function getMobileSummaryTitle(
  productOption: ProductOptions,
  fulfilmentOption: FulfilmentOptions,
  includesDigiSub: ?boolean = false,
) {
  return (<>
    {getOrderSummaryTitle(productOption, fulfilmentOption)}
    {includesDigiSub && <> +&nbsp;digital</>}
  </>);
}

function mapStateToProps(state: WithDeliveryCheckoutState) {
  return {
    fulfilmentOption: state.page.checkout.fulfilmentOption,
    productOption: state.page.checkout.productOption,
    billingPeriod: state.page.checkout.billingPeriod,
    productPrices: state.page.checkout.productPrices,
  };
}

function PaperOrderSummary(props: PropTypes) {
  const rawTotal = getPriceSummary(showPrice(props.total, false), props.billingPeriod);
  const cleanedTotal = rawTotal.replace(/\/(.*)/, ''); // removes anything after the /
  const total = `${cleanedTotal} per month`;
  // If the user has added a digi sub, we need to know the price of their selected base paper product separately
  const basePaperPrice = props.includesDigiSub ?
    getPriceWithDiscount(
      props.productPrices,
      props.fulfilmentOption,
      paperProductsWithoutDigital[props.productOption],
    )
    : props.total;
  // This allows us to get the price without promotion, so we can say what the price will revert to
  const paperWithoutPromo = getProductPrice(
    props.productPrices,
    props.fulfilmentOption,
    props.productOption,
  );
  const monthsDiscounted = paperWithoutPromo.promotions &&
    paperWithoutPromo.promotions.length && paperWithoutPromo.promotions[0].numberOfDiscountedPeriods;
  const priceHasPromo = paperWithoutPromo.promotions && paperWithoutPromo.promotions.length > 0;
  const promotionPriceString = priceHasPromo && monthsDiscounted
    ? ` for ${monthsDiscounted} months, then ${showPrice(paperWithoutPromo, false)} per month` : '';
  const rawPrice = getPriceSummary(showPrice(basePaperPrice, false), props.billingPeriod);
  const cleanedPrice = rawPrice.replace(/\/(.*)/, ''); // removes anything after the /
  const accessiblePriceString = `You'll pay ${cleanedPrice} per month`;

  const productInfoHomeDelivery = [
    {
      content: `${accessiblePriceString}${promotionPriceString}`,
    },
  ];
  const productInfoSubsCard = [
    ...productInfoHomeDelivery,
    {
      content: props.startDate ? `Your first payment will be on ${props.startDate}` : '',
      subText: 'Your subscription card will arrive in the post before the payment date',
    },
  ];
  const productInfoPaper = props.fulfilmentOption === Collection ? productInfoSubsCard : productInfoHomeDelivery;

  const productInfoDigiSub = [
    {
      content: `You'll pay ${props.digiSubPrice}`,
    },
  ];

  const mobilePriceStatement = priceHasPromo ? `${total}${promotionPriceString}` : total;

  const mobileSummary = {
    title: getMobileSummaryTitle(
      props.productOption,
      props.fulfilmentOption,
      props.includesDigiSub,
    ),
    price: mobilePriceStatement,
  };

  return (
    <OrderSummary
      image={props.image}
      changeSubscription={props.changeSubscription}
      total={total}
      mobileSummary={mobileSummary}
    >
      <OrderSummaryProduct
        productName={getOrderSummaryTitle(props.productOption, props.fulfilmentOption)}
        productInfo={productInfoPaper}
      />
      {props.includesDigiSub && <OrderSummaryProduct
        productName="Digital subscription"
        productInfo={productInfoDigiSub}
      />}
    </OrderSummary>
  );
}

PaperOrderSummary.defaultProps = {
  changeSubscription: '',
  startDate: '',
};

export default connect(mapStateToProps)(PaperOrderSummary);
