// ----- Imports ----- //
import React, { Node } from 'react';
import { Option } from 'helpers/types/option';
import './error.scss';
import { InlineError } from '@guardian/src-user-feedback';
import { ErrorMessage } from 'helpers/subscriptionsForms/validation';
// ----- Types ----- //
export type PropsForHoc = {
	error: Option<ErrorMessage>;
};
type Props = PropsForHoc & {
	children?: Option<Node>;
};

// ----- Component ----- //
function Error({ error, children }: Props) {
	return (
		<div className={error ? 'component-form-error' : null}>
			{error && <InlineError>{error}</InlineError>}
			{children}
		</div>
	);
}

// ----- Exports ----- //
export { Error };
