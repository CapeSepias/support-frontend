// ----- Imports ----- //
import React from 'react';
import SharedButton, { defaultProps, SharedButtonPropTypes } from './_sharedButton';
import './button.scss';
// ----- Render ----- //
export type PropTypes = SharedButtonPropTypes & {
  'aria-label'?: string | null | undefined;
  href: string;
};

const AnchorButton = (props: PropTypes) => <SharedButton element="a" {...props} />;

AnchorButton.defaultProps = {
  ...defaultProps,
  'aria-label': null,
};
export default AnchorButton;
