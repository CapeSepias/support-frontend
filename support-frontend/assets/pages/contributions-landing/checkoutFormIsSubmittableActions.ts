// ----- Imports ----- //
import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { Action as UserAction } from 'helpers/user/userActions';
import { amountOrOtherAmountIsValid, checkEmail, checkFirstName, checkLastName, checkStateIfApplicable } from 'helpers/forms/formValidation';
import { ContributionType, OtherAmounts, SelectedAmounts, contributionTypeIsRecurring } from 'helpers/contributions';
import { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { StateProvince } from 'helpers/internationalisation/country';
import { State } from './contributionsLandingReducer';
import { Action as ContributionsLandingAction, setFormIsValid } from './contributionsLandingActions';
import { stripeCardFormIsIncomplete } from 'helpers/forms/stripe';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import { LocalCurrencyCountry } from '../../helpers/internationalisation/localCurrencyCountry';
// ----- Types ----- //
type Action = ContributionsLandingAction | UserAction;

// ----- Functions ----- //
const enableOrDisablePayPalExpressCheckoutButton = (formIsSubmittable: boolean) => {
  if (formIsSubmittable && window.enablePayPalButton) {
    window.enablePayPalButton();
  } else if (window.disablePayPalButton) {
    window.disablePayPalButton();
  }
};

const setFormIsSubmittable = (formIsSubmittable: boolean, payPalButtonReady: boolean): Action => {
  if (payPalButtonReady) {
    enableOrDisablePayPalExpressCheckoutButton(formIsSubmittable);
  }

  return {
    type: 'SET_FORM_IS_SUBMITTABLE',
    formIsSubmittable,
  };
};

export type FormIsValidParameters = {
  selectedAmounts: SelectedAmounts;
  otherAmounts: OtherAmounts;
  countryGroupId: CountryGroupId;
  contributionType: ContributionType;
  billingState: StateProvince | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  stripeCardFormOk: boolean;
  amazonPayFormOk: boolean;
  localCurrencyCountry?: LocalCurrencyCountry;
  useLocalCurrency?: boolean;
};

const getFormIsValid = (formIsValidParameters: FormIsValidParameters) => {
  const {
    selectedAmounts,
    otherAmounts,
    countryGroupId,
    contributionType,
    billingState,
    firstName,
    lastName,
    email,
    stripeCardFormOk,
    amazonPayFormOk,
    localCurrencyCountry,
    useLocalCurrency,
  } = formIsValidParameters;
  const hasNameFields = contributionType !== 'ONE_OFF';
  return (hasNameFields ? checkFirstName(firstName) && checkLastName(lastName) : true) && checkEmail(email) && stripeCardFormOk && amazonPayFormOk && checkStateIfApplicable(billingState, countryGroupId, contributionType) && amountOrOtherAmountIsValid(selectedAmounts, otherAmounts, contributionType, countryGroupId, localCurrencyCountry, useLocalCurrency);
};

const amazonPayFormOk = (state: State): boolean => {
  if (state.page.form.paymentMethod === AmazonPay) {
    const {
      orderReferenceId,
      amazonBillingAgreementId,
      amazonBillingAgreementConsentStatus,
      paymentSelected,
    } = state.page.form.amazonPayData;

    const oneOffOk = () => !!orderReferenceId;

    const recurringOk = () => !!amazonBillingAgreementId && amazonBillingAgreementConsentStatus;

    return paymentSelected && (state.page.form.contributionType === 'ONE_OFF' ? oneOffOk() : recurringOk());
  }

  return true;
};

const formIsValidParameters = (state: State) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
  billingState: state.page.form.formData.billingState,
  firstName: state.page.form.formData.firstName,
  lastName: state.page.form.formData.lastName,
  email: state.page.form.formData.email,
  stripeCardFormOk: !stripeCardFormIsIncomplete(state.page.form.paymentMethod, state.page.form.stripeCardFormData.formComplete),
  amazonPayFormOk: amazonPayFormOk(state),
  localCurrencyCountry: state.common.internationalisation.localCurrencyCountry,
  useLocalCurrency: state.common.internationalisation.useLocalCurrency,
});

function enableOrDisableForm() {
  return (dispatch: (...args: Array<any>) => any, getState: () => State): void => {
    const state = getState();
    const {
      isRecurringContributor,
    } = state.page.user;
    const shouldBlockExistingRecurringContributor = isRecurringContributor && contributionTypeIsRecurring(state.page.form.contributionType);
    const userCanContributeWithoutSigningIn = canContributeWithoutSigningIn(state.page.form.contributionType, state.page.user.isSignedIn, state.page.form.userTypeFromIdentityResponse);
    const formIsValid = getFormIsValid(formIsValidParameters(state));
    dispatch(setFormIsValid(formIsValid));
    const recaptchaRequired = window.guardian.recaptchaEnabled && state.page.form.paymentMethod === 'Stripe' && !state.page.user.isPostDeploymentTestUser;
    const recaptchaVerified = state.page.form.contributionType !== 'ONE_OFF' ? state.page.form.stripeCardFormData.recurringRecaptchaVerified : !!state.page.form.oneOffRecaptchaToken;
    const shouldEnable = formIsValid && !shouldBlockExistingRecurringContributor && userCanContributeWithoutSigningIn && (!recaptchaRequired || recaptchaVerified);
    dispatch(setFormIsSubmittable(shouldEnable, state.page.form.payPalData.buttonReady));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: (...args: Array<any>) => any): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue, enableOrDisableForm };
