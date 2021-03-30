// @flow

// $FlowIgnore - required for hooks
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { fetchJson, requestOptions } from 'helpers/fetch';
import { useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';
import { routes } from 'helpers/routes';
import {
  type Action,
  paymentFailure,
  paymentWaiting as setPaymentWaiting,
  onThirdPartyPaymentAuthorised,
  setStripeSetupIntentClientSecret,
  setCreateStripePaymentMethod,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { ErrorReason } from 'helpers/errorReasons';
import { type PaymentResult } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/paymentMethods';
import { logException } from 'helpers/logger';

const IBAN_ELEMENT_OPTIONS = {
  supportedCountries: ['SEPA'],
  placeholderCountry: 'FR',
};

type StripeSepaCardFormProps = {|
  stripeKey: string,
  csrf: CsrfState,
  setStripeSetupIntentClientSecret: (clientSecret: string) => Action,
  setPaymentWaiting: (isWaiting: boolean) => Action,
  paymentFailure: (paymentError: ErrorReason) => Action,
  setCreateStripePaymentMethod: ((clientSecret: string | null) => void) => Action,
  onPaymentAuthorised: (paymentMethodId: string) => Promise<PaymentResult>,
|}

const mapStateToProps = (state: State) => ({
  csrf: state.page.csrf,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised: (paymentMethodId: string) =>
    dispatch(onThirdPartyPaymentAuthorised({
      paymentMethod: Stripe,
      stripePaymentMethod: 'StripeCheckout',
      paymentMethodId,
    })),
  setStripeSetupIntentClientSecret: (clientSecret: string) => dispatch(setStripeSetupIntentClientSecret(clientSecret)),
  paymentFailure: (paymentError: ErrorReason) => dispatch(paymentFailure(paymentError)),
  setPaymentWaiting: (isWaiting: boolean) =>
    dispatch(setPaymentWaiting(isWaiting)),
  setCreateStripePaymentMethod: (createStripePaymentMethod: (clientSecret: string | null) => void) =>
    dispatch(setCreateStripePaymentMethod(createStripePaymentMethod)),
});


function StripeSepaCardForm(props: StripeSepaCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetchJson(
      routes.stripeSetupIntentRecaptcha,
      requestOptions(
        { token: 'token', stripePublicKey: props.stripeKey, isTestUser: true },
        'same-origin',
        'POST',
        props.csrf,
      ),
    )
      .then((json) => {
        if (json.client_secret) {
          props.setStripeSetupIntentClientSecret(json.client_secret);
        } else {
          throw new Error(`Missing client_secret field in server response: ${JSON.stringify(json)}`);
        }
      })
      .catch(() => {
        props.paymentFailure('internal_error');
        props.setPaymentWaiting(false);
      });

  }, []);

  const handleStripeError = (errorData: any): void => {
    props.setPaymentWaiting(false);

    logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);

    if (errorData.type === 'validation_error') {
      // This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
      // happen then display a generic error about card details
      props.paymentFailure('payment_details_incorrect');
    } else {
      // This is probably a Stripe or network problem
      props.paymentFailure('payment_provider_unavailable');
    }
  };

  const handleCardSetupForRecurring = (clientSecret: string): void => {
    const iban = elements.getElement(IbanElement);

    stripe.confirmSepaDebitSetup(clientSecret, {
      payment_method: {
        sepa_debit: iban,
        billing_details: {
          name: 'test user',
          email: 'test.user@guardian.co.uk',
        },
      },
    })
      .then((result) => {
        if (result.error) {
          handleStripeError(result.error);
        } else {
          props.onPaymentAuthorised(result.setupIntent.payment_method);
        }
      });
  };

  const setupRecurringHandler = () => {
    props.setCreateStripePaymentMethod((clientSecret: string | null) => {
      props.setPaymentWaiting(true);

      if (clientSecret) {
        handleCardSetupForRecurring(clientSecret);
      }
    });
  };

  useEffect(() => {
    if (stripe && elements) {
      setupRecurringHandler();
    }
  }, [stripe, elements]);

  return (
    <div>
      <IbanElement options={IBAN_ELEMENT_OPTIONS} />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StripeSepaCardForm);
