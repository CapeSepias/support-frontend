import {
	PaymentMethod,
	DirectDebit,
	PayPal,
	Stripe,
} from 'helpers/forms/paymentMethods';

import { IsoCurrency } from 'helpers/internationalisation/currency';

function supportedPaymentMethods(currencyId: IsoCurrency): PaymentMethod[] {
	const countrySpecific: PaymentMethod[] =
		currencyId === 'GBP' ? [DirectDebit, Stripe, PayPal] : [Stripe, PayPal];
	return countrySpecific;
}

export { supportedPaymentMethods };
