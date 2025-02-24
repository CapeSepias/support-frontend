// @flow
import { routes } from 'helpers/urls/routes';
import {
  type AcquisitionABTest,
  type OphanIds,
  type ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import { type ErrorReason } from 'helpers/forms/errorReasons';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import {
  DigitalPack, GuardianWeekly, Paper,
} from 'helpers/productPrice/subscriptions';
import { type BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { type Participations } from 'helpers/abTests/abtest';
import {
  type CaState,
  type IsoCountry,
  type UsState,
} from 'helpers/internationalisation/country';
import { type Option } from 'helpers/types/option';
import { logPromise, pollUntilPromise } from 'helpers/async/promise';
import { logException } from 'helpers/utilities/logger';
import { fetchJson, getRequestOptions, requestOptions } from 'helpers/async/fetch';
import trackConversion from 'helpers/tracking/conversions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';

import { type ThankYouPageStage } from 'pages/contributions-landing/contributionsLandingReducer';
import {
  DirectDebit,
  ExistingCard,
  ExistingDirectDebit,
  PayPal,
  Stripe,
  AmazonPay,
  Sepa,
} from 'helpers/forms/paymentMethods';
import type { Title } from 'helpers/user/details';
import type { ReaderType } from 'helpers/productPrice/readerType';

// ----- Types ----- //

export type StripePaymentMethod = 'StripeCheckout' | 'StripeApplePay' | 'StripePaymentRequestButton' | 'StripeElements';
export type StripePaymentRequestButtonMethod = 'none' | StripePaymentMethod;

type RegularContribution = {|
  productType: 'Contribution',
  amount: number,
  currency: string,
  billingPeriod: BillingPeriod,
|};

export type DigitalSubscription = {|
  productType: typeof DigitalPack,
  currency: string,
  billingPeriod: BillingPeriod,
  readerType: ReaderType,
|};

export type PaperSubscription = {|
  productType: typeof Paper,
  currency: string,
  billingPeriod: BillingPeriod,
  fulfilmentOptions: FulfilmentOptions,
  productOptions: ProductOptions,
|};

export type GuardianWeeklySubscription = {|
  productType: typeof GuardianWeekly,
  currency: string,
  billingPeriod: BillingPeriod,
  fulfilmentOptions: FulfilmentOptions,
|};

export type SubscriptionProductFields = DigitalSubscription | PaperSubscription | GuardianWeeklySubscription

type ProductFields = RegularContribution | SubscriptionProductFields

type RegularPayPalPaymentFields = {| baid: string |};

type RegularStripePaymentIntentFields = {|
  paymentMethod: string, // The ID of the Stripe Payment Method
  stripePaymentType: StripePaymentMethod, // The type of Stripe payment, e.g. Apple Pay
|};

type RegularDirectDebitPaymentFields = {|
  accountHolderName: string,
  sortCode: string,
  accountNumber: string,
|};

type RegularSepaPaymentFields = {|
  accountHolderName: string,
  iban: string,
|}

type CorporateRedemption = {|
  redemptionCode: string,
|}

type RegularExistingPaymentFields = {| billingAccountId: string |};

type RegularAmazonPayPaymentFields = {| amazonPayBillingAgreementId: string |};

export type RegularPaymentFields =
  RegularPayPalPaymentFields |
  RegularStripePaymentIntentFields |
  RegularDirectDebitPaymentFields |
  RegularSepaPaymentFields |
  RegularExistingPaymentFields |
  CorporateRedemption |
  RegularAmazonPayPaymentFields;

export type RegularPaymentRequestAddress = {|
  country: IsoCountry,
  state: UsState | CaState | null,
  lineOne: Option<string>,
  lineTwo: Option<string>,
  postCode: Option<string>,
  city: Option<string>,
|};

type GiftRecipientType = {|
  title?: Option<Title>,
  firstName: string,
  lastName: string,
  email?: Option<string>,
  message: Option<string>,
  deliveryDate: Option<string>,
|};

// The model that is sent to support-workers
export type RegularPaymentRequest = {|
  title?: Option<Title>,
  firstName: string,
  lastName: string,
  billingAddress: RegularPaymentRequestAddress,
  deliveryAddress: Option<RegularPaymentRequestAddress>,
  email: string,
  giftRecipient?: GiftRecipientType,
  product: ProductFields,
  firstDeliveryDate: Option<string>,
  paymentFields: RegularPaymentFields,
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: AcquisitionABTest[],
  telephoneNumber: Option<string>,
  promoCode?: Option<string>,
  deliveryInstructions?: Option<string>,
  debugInfo: string,
|};

export type StripePaymentIntentAuthorisation = {|
  paymentMethod: typeof Stripe,
  stripePaymentMethod: StripePaymentMethod,
  paymentMethodId: string,
|};

export type PayPalAuthorisation = {|
  paymentMethod: typeof PayPal,
  token: string
|};
export type DirectDebitAuthorisation = {|
  paymentMethod: typeof DirectDebit,
  accountHolderName: string,
  sortCode: string,
  accountNumber: string
|};
export type SepaAuthorisation = {|
  paymentMethod: typeof Sepa,
  accountHolderName: string,
  iban: string
|};
export type ExistingCardAuthorisation = {|
  paymentMethod: typeof ExistingCard,
  billingAccountId: string
|};
export type ExistingDirectDebitAuthorisation = {|
  paymentMethod: typeof ExistingDirectDebit,
  billingAccountId: string
|};
export type AmazonPayAuthorisation = {|
  paymentMethod: typeof AmazonPay,
  orderReferenceId?: string,
  amazonPayBillingAgreementId?: string
|}

// Represents an authorisation to execute payments with a given payment method.
// This will generally be supplied by third-party code (Stripe, PayPal, GoCardless).
// It applies both to one-off payments, where it is sent to the Payment API which
// immediately executes the payment, and recurring, where it ultimately ends up in Zuora
// which uses it to execute payments in the future.
export type PaymentAuthorisation =
  StripePaymentIntentAuthorisation |
  PayPalAuthorisation |
  DirectDebitAuthorisation |
  SepaAuthorisation |
  ExistingCardAuthorisation |
  ExistingDirectDebitAuthorisation |
  AmazonPayAuthorisation;

// Represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// The only method/type combination which will not make use of this PayPal one-off,
// because the end of that checkout happens on the backend after the user is redirected to our site.
export type PaymentResult
  = {| paymentStatus: 'success' |}
  | {| paymentStatus: 'success', subscriptionCreationPending: true |}
  | {| paymentStatus: 'failure', error: ErrorReason |};

// ----- Setup ----- //
const PaymentSuccess: PaymentResult = { paymentStatus: 'success' };
const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;

// ----- Functions ----- //

function regularPaymentFieldsFromAuthorisation(authorisation: PaymentAuthorisation): RegularPaymentFields {
  switch (authorisation.paymentMethod) {
    case Stripe:
      if (authorisation.paymentMethodId) {
        return {
          paymentMethod: authorisation.paymentMethodId,
          stripePaymentType: authorisation.stripePaymentMethod,
        };
      }
      throw new Error('Neither token nor paymentMethod found in authorisation data for Stripe recurring contribution');
    case PayPal:
      return { baid: authorisation.token };
    case DirectDebit:
      return {
        accountHolderName: authorisation.accountHolderName,
        sortCode: authorisation.sortCode,
        accountNumber: authorisation.accountNumber,
      };
    case Sepa:
      return {
        accountHolderName: authorisation.accountHolderName,
        iban: authorisation.iban.replace(/ /g, ''),
      };
    case ExistingCard:
    case ExistingDirectDebit:
      return { billingAccountId: authorisation.billingAccountId };
    case AmazonPay:
      if (authorisation.amazonPayBillingAgreementId) {
        return { amazonPayBillingAgreementId: authorisation.amazonPayBillingAgreementId };
      }
      throw new Error('Cant create a regular Amazon Pay authorisation for one off');

    // TODO: what is a sane way to handle such cases?
    default:
      throw new Error('If Flow works, this cannot happen');
  }
}

/**
 * Process the response for a regular payment from the recurring contribution endpoint.
 *
 * If the payment is:
 * - pending, then we start polling the API until it's done or some timeout occurs
 * - failed, then we bubble up an error value
 * - otherwise, we bubble up a success value
 */
function checkRegularStatus(
  participations: Participations,
  csrf: CsrfState,
  setGuestAccountCreationToken: (string) => void,
  setThankYouPageStage: (ThankYouPageStage) => void,
): Object => Promise<PaymentResult> {
  const handleCompletion = (json) => {
    switch (json.status) {
      case 'success':
      case 'pending':
        trackConversion(participations, routes.recurringContribPending);
        return PaymentSuccess;

      default: {
        const failureReason = json.failureReason ? json.failureReason : 'unknown';
        return { paymentStatus: 'failure', error: failureReason };
      }
    }
  };

  // Exhaustion of the maximum number of polls is considered a payment success
  const handleExhaustedPolls = (error) => {
    if (error === undefined) {
      return Promise.resolve({ paymentStatus: 'success', subscriptionCreationPending: true });
    }
    throw error;

  };

  return (json) => {
    if (json.guestAccountCreationToken) {
      setGuestAccountCreationToken(json.guestAccountCreationToken);
      setThankYouPageStage('thankYouSetPassword');
    }
    switch (json.status) {
      case 'pending':
        return logPromise(pollUntilPromise(
          MAX_POLLS,
          POLLING_INTERVAL,
          () => fetchJson(json.trackingUri, getRequestOptions('same-origin', csrf)),
          json2 => json2.status === 'pending',
        ).then(handleCompletion, handleExhaustedPolls));

      default:
        return Promise.resolve(handleCompletion(json));
    }
  };
}

/** Sends a regular payment request to the recurring contribution endpoint and checks the result */
function postRegularPaymentRequest(
  uri: string,
  data: RegularPaymentRequest,
  participations: Participations,
  csrf: CsrfState,
  setGuestAccountCreationToken: (string) => void,
  setThankYouPageStage: (ThankYouPageStage) => void,
): Promise<PaymentResult> {
  return logPromise(fetch(uri, requestOptions(data, 'same-origin', 'POST', csrf)))
    .then((response) => {
      if (response.status === 500) {
        logException(`500 Error while trying to post to ${uri}`);
        return ({ paymentStatus: 'failure', error: 'internal_error' });
      } else if (response.status === 400) {
        logException(`Bad request error while trying to post to ${uri}`);
        return ({ paymentStatus: 'failure', error: 'personal_details_incorrect' });
      }

      return response.json()
        .then(checkRegularStatus(participations, csrf, setGuestAccountCreationToken, setThankYouPageStage));

    })
    .catch(() => {
      logException(`Error while trying to interact with ${uri}`);
      return ({ paymentStatus: 'failure', error: 'unknown' });
    });
}

function setPasswordGuest(
  password: string,
  guestAccountRegistrationToken: string,
  csrf: CsrfState,
): Promise<boolean> {

  const data = { password, guestAccountRegistrationToken };
  return logPromise(fetch(`${routes.contributionsSetPasswordGuest}`, requestOptions(data, 'same-origin', 'PUT', csrf)))
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
      logException('/contribute/set-password-guest endpoint returned an error');
      return false;

    })
    .catch(() => {
      logException('Error while trying to interact with /contribute/set-password-guest');
      return false;
    });
}

export {
  postRegularPaymentRequest,
  regularPaymentFieldsFromAuthorisation,
  PaymentSuccess,
  setPasswordGuest,
};
