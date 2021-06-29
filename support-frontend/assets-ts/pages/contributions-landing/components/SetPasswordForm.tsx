// ----- Imports ----- //
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import { ContributionType } from 'helpers/contributions';
import { setPasswordGuest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import SvgPasswordKey from 'components/svgs/passwordKey';
import SvgEnvelope from 'components/svgs/envelope';
import SvgExclamationAlternate from 'components/svgs/exclamationAlternate';
import { checkEmail, emailRegexPattern } from 'helpers/forms/formValidation';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import Button from 'components/button/button';
import TrackableButton from 'components/button/trackableButton';
import ContributionTextInput from './ContributionTextInput';
import { ThankYouPageStage } from '../contributionsLandingReducer';
import {
	setThankYouPageStage,
	setPasswordHasBeenSubmitted,
	setPasswordError,
	updatePassword,
	Action,
} from '../contributionsLandingActions';

const passwordErrorHeading = 'Account set up failure';
const passwordErrorMessage =
	'Sorry, we are unable to register you at this time. We are working hard to fix the problem and hope to be back up and running soon. Please come back later to complete your registration. Thank you.';
// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
	email: string;
	password: string;
	guestAccountCreationToken: string;
	setThankYouPageStage: (arg0: ThankYouPageStage) => void;
	setPasswordHasBeenSubmitted: () => void;
	passwordHasBeenSubmitted: boolean;
	updatePassword: (arg0: Event) => void;
	csrf: CsrfState;
	passwordError: boolean;
	setPasswordError: (arg0: boolean) => void;
	contributionType: ContributionType;
};

/* eslint-enable react/no-unused-prop-types */
// ----- State Maps ----- //
const mapStateToProps = (state) => ({
	email: state.page.form.formData.email,
	password: state.page.form.setPasswordData.password,
	passwordHasBeenSubmitted:
		state.page.form.setPasswordData.passwordHasBeenSubmitted,
	guestAccountCreationToken: state.page.form.guestAccountCreationToken,
	csrf: state.page.csrf,
	passwordError: state.page.form.setPasswordData.passwordError,
	contributionType: state.page.form.contributionType,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setThankYouPageStage: (thankYouPageStage: ThankYouPageStage) => {
			dispatch(setThankYouPageStage(thankYouPageStage));
		},
		setPasswordHasBeenSubmitted: () => {
			dispatch(setPasswordHasBeenSubmitted());
		},
		updatePassword: (event: Event) => {
			if (event.target instanceof HTMLInputElement) {
				dispatch(updatePassword(event.target.value));
			}
		},
		setPasswordError: (passwordError: boolean) => {
			dispatch(setPasswordError(passwordError));
		},
	};
}

// ----- Functions ----- //
function onSubmit(props: PropTypes): (arg0: Event) => void {
	return (event) => {
		props.setPasswordHasBeenSubmitted();
		event.preventDefault();
		trackComponentClick(`set-password-${props.contributionType}`);

		if (!(event.target as any).checkValidity()) {
			return;
		}

		// TODO: send user to thank you page with error if password was not set
		setPasswordGuest(
			props.password,
			props.guestAccountCreationToken,
			props.csrf,
		).then((response) => {
			if (response === true) {
				props.setThankYouPageStage('thankYouPasswordSet');
			} else {
				props.setPasswordError(true);
			}
		});
	};
}

// ----- Render ----- //
function SetPasswordForm(props: PropTypes) {
	return (
		<div className="set-password__form">
			<form
				onSubmit={onSubmit(props)}
				className={classNameWithModifiers('form', ['contribution'])}
				noValidate={true}
			>
				<ContributionTextInput
					id="email"
					name="contribution-email"
					label="Email address"
					value={props.email}
					isValid={checkEmail(props.email)}
					pattern={emailRegexPattern}
					icon={<SvgEnvelope />}
					autoComplete="email"
					type="email"
					errorMessage="Please enter a valid email address"
					required={true}
					disabled={true}
				/>
				<ContributionTextInput
					id="password"
					type="password"
					name="contribution-password"
					label="Set a password"
					icon={<SvgPasswordKey />}
					autoComplete="off"
					value={props.password}
					onInput={props.updatePassword}
					pattern="^.{6,20}$"
					isValid={props.password.length >= 6 && props.password.length <= 20}
					formHasBeenSubmitted={props.passwordHasBeenSubmitted}
					errorMessage="Please enter a password between 6 and 20 characters long"
					required={true}
				/>
				<TrackableButton
					appearance="secondary"
					modifierClasses={['create-account']}
					aria-label="Create a guardian account"
					type="submit"
					trackingEvent={() => {
						trackComponentLoad(`set-password-loaded-${props.contributionType}`);
					}}
				>
					Create a Guardian account
				</TrackableButton>
				<Button
					appearance="greyHollow"
					aria-label="No thank you"
					onClick={() => {
						trackComponentClick(
							`decline-to-set-password-${props.contributionType}`,
						);
						props.setThankYouPageStage('thankYouPasswordDeclinedToSet');
					}}
				>
					No thank you
				</Button>
			</form>
			{props.passwordError === true ? (
				<div className="component-password-failure-message component-general-error-message">
					<SvgExclamationAlternate />
					<span className="component-general-error-message__error-heading">
						{passwordErrorHeading}
					</span>
					<span className="component-general-error-message__small-print">
						{passwordErrorMessage}
					</span>
				</div>
			) : null}
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPasswordForm);
