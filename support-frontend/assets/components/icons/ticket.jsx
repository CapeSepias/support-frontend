import React from 'react';
import { css } from '@emotion/core';
import { background } from '@guardian/src-foundations/palette';

const icon = css`
  display: flex;
  height: 38px;
  width: 38px;
  border-radius: 50%;
  background-color: ${background.ctaPrimary};
  align-items: center;
  justify-content: center;
`;

export const SvgTicket = () => (
  <div css={icon}>
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M21.3536 12.9753V10.5453C19.7272 10.313 18.477 8.91447 18.477 7.22393C18.477 5.53339 19.7272 4.13486 21.3536 3.90254V1.47159L20.3949 0.512939H1.22194L0.26329 1.47159V3.90274C1.88934 4.13529 3.13932 5.53369 3.13932 7.22405C3.13932 8.9144 1.88934 10.3128 0.26329 10.5454V12.9753L1.22194 13.934H20.3949L21.3536 12.9753ZM12.7305 8.12794L13.6154 10.8302L13.3014 11.0586L10.9988 9.37442L8.69612 11.0586L8.40115 10.8302L9.26703 8.12794L6.97388 6.44376L7.08806 6.08219H9.93309L10.799 3.3894H11.1986L12.074 6.08219H14.9095L15.0237 6.44376L12.7305 8.12794Z" fill="white" />
    </svg>
  </div>
);
