// @flow

// ----- Imports ----- //

import React from 'react';

import './textArea.scss';

// ----- Component ----- //

function TextArea(props: {}) {
  console.log({ props });
  return <textarea className="component-textarea" {...props} />;
}


// ----- Exports ----- //

export { TextArea };
