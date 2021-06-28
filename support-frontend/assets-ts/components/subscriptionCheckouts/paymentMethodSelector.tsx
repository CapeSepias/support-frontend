import React, { Node } from 'react';
import { css } from '@emotion/core';
import { RadioGroup, Radio } from '@guardian/src-radio';
import { SvgCreditCard, SvgDirectDebit, SvgPayPal } from '@guardian/src-icons';
import Rows from 'components/base/rows';
import { Option } from 'helpers/types/option';
import {
	DirectDebit,
	PayPal,
	Stripe,
	PaymentMethod,
} from 'helpers/forms/paymentMethods';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import { IsoCurrency } from 'helpers/internationalisation/currency';
import { ErrorMessage } from 'helpers/subscriptionsForms/validation';
type PropTypes = {
	currencyId: IsoCurrency;
	paymentMethod: Option<PaymentMethod>;
	setPaymentMethod: (...args: Array<any>) => any;
	validationError: Option<ErrorMessage>;
};
type RadioWithImagePropTypes = {
	id: string;
	image: Node;
	label: string;
	name: string;
	checked: boolean;
	onChange: (...args: Array<any>) => any;
};
const radioWithImageStyles = css`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
`;
const paymentIcon = css`
	min-width: 30px;
	max-width: 40px;
`;

const RadioWithImage = (props: RadioWithImagePropTypes) => (
	<div css={radioWithImageStyles}>
		<Radio {...props} />
		<div css={paymentIcon}>{props.image}</div>
	</div>
);

function PaymentMethodSelector(props: PropTypes) {
	const paymentMethods = supportedPaymentMethods(props.currencyId);
	return (
		<Rows gap="large">
			<RadioGroup
				id="payment-methods"
				label="How would you like to pay?"
				hideLabel
				error={props.validationError}
				role="radiogroup"
			>
				{paymentMethods.includes(DirectDebit) && (
					<RadioWithImage
						id="qa-direct-debit"
						image={<SvgDirectDebit />}
						label="Direct debit"
						name="paymentMethod"
						checked={props.paymentMethod === DirectDebit}
						onChange={() => props.setPaymentMethod(DirectDebit)}
					/>
				)}
				<RadioWithImage
					id="qa-credit-card"
					image={<SvgCreditCard />}
					label="Credit/Debit card"
					name="paymentMethod"
					checked={props.paymentMethod === Stripe}
					onChange={() => props.setPaymentMethod(Stripe)}
				/>
				<RadioWithImage
					id="qa-paypal"
					image={<SvgPayPal />}
					label="PayPal"
					name="paymentMethod"
					checked={props.paymentMethod === PayPal}
					onChange={() => props.setPaymentMethod(PayPal)}
				/>
			</RadioGroup>
		</Rows>
	);
}

export { PaymentMethodSelector };
