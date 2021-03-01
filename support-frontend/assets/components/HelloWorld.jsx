// @flow
import React from 'react';
import { css } from '@emotion/core';

const makeItRed = css`
  color: red;
`;

const HelloWorld = () => (
  <h1 css={makeItRed}>hello world!</h1>
);

export { HelloWorld };
