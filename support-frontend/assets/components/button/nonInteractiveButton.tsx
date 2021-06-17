// ----- Imports ----- //
import React from 'react';
import SharedButton, { defaultProps, SharedButtonPropTypes } from './_sharedButton';
import './button.scss';

// ----- Render ----- //
const NonInteractiveButton = ({
  modifierClasses,
  ...props
}: SharedButtonPropTypes) => <SharedButton element="div" modifierClasses={['non-interactive', ...modifierClasses]} {...props} />;

NonInteractiveButton.defaultProps = { ...defaultProps };
export default NonInteractiveButton;
