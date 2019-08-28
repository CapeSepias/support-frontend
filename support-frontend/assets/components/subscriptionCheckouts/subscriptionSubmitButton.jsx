// @flow

// ----- Imports ----- //

import React from 'react';

import Button from 'components/button/button';
import { type Option } from 'helpers/types/option';
import { type PaymentMethod, DirectDebit } from 'helpers/paymentMethods';
import { type FormError } from 'helpers/subscriptionsForms/validation';
import { type FormField } from 'helpers/subscriptionsForms/formFields';
import { ErrorSummary } from './submitFormErrorSummary';

import 'components/forms/customFields/error.scss';
import './subscriptionSubmitButton.scss';

// ----- Types ----- //

type PropTypes = {|
  paymentMethod: Option<PaymentMethod>,
  allErrors: FormError<FormField>[],
  className?: Option<string>,
|};

// ----- Render ----- //


function SubscriptionSubmitButton(props: PropTypes) {
  return (
    <span className={props.paymentMethod === props.className ? 'show' : 'hide'}>
      <div className="component-submit-button">
        <div className={props.paymentMethod === DirectDebit ? 'component-submit-button--margin' : ''}>
          <Button
            id="qa-submit-button"
            type="submit"
          >
            Start your free trial now
          </Button>
        </div>
        <span>{props.allErrors.length > 0 && <ErrorSummary errors={props.allErrors} />}</span>
      </div>
    </span>
  );
}

SubscriptionSubmitButton.defaultProps = {
  className: '',
};

export { SubscriptionSubmitButton };
