// @flow

import React from 'react';
import type { Node } from 'react';
import { css } from '@emotion/core';
import cx from 'classnames';
import { type Option } from 'helpers/types/option';

import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';

type PropTypes = {
  title: string,
  subtitle: string,
  description: string,
  buttons: ProductButton[],
  productImage: Node,
  offer?: Option<string>,
  isFeature?: Option<boolean>,
  classModifier: string[],
  detail?: Node,
}

const subProduct = css`
  background-color: white;

  .subscriptions__copy-wrapper {
    padding: 0 12px 12px;
  }
`;

const SubscriptionsProduct = ({
  classModifier, productImage, isFeature, ...props
}: PropTypes) => (
  <div
    className={cx('subscriptions__product', { 'subscriptions__product--feature': isFeature }, classModifier)}
    css={subProduct}
    id={props.title.replace(/\s/g, '')}
  >

    <div className={cx('subscriptions__image-container', { 'subscriptions__product--feature': isFeature })}>
      <div className={isFeature ? 'subscriptions__feature-image-wrapper' : 'subscriptions-packshot'}>
        {productImage}
      </div>
    </div>

    <div className={cx('subscriptions__copy-container', { 'subscriptions__product--feature': isFeature })} >
      <div className="subscriptions__copy-wrapper">
        <SubscriptionsProductDescription
          {...props}
          isFeature={isFeature}
        />
        {props.detail}
      </div>
    </div>
  </div>
);

SubscriptionsProduct.defaultProps = {
  offer: null,
  isFeature: false,
  detail: null,
};

export default SubscriptionsProduct;
