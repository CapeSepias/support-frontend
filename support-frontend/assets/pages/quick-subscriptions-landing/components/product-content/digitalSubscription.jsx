// @flow

import React from 'react';
import { css } from '@emotion/core';
import { Accordion, AccordionRow } from '@guardian/src-accordion';
import { ThemeProvider } from 'emotion-theming';
import { LinkButton, buttonReaderRevenue } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';

import { getOrigin } from 'helpers/url';

const spacer = css`
  margin-bottom: 12px;
`;

function DigitalSubscriptionDetail() {
  return (
    <Accordion hideToggleLabel>
      <AccordionRow label="Find out more">
        <p css={spacer}>
          With two innovative apps and ad-free reading, a digital subscription
          gives you the richest experience of Guardian journalism. It also sustains the independent
          reporting you love.
        </p>
        <p css={spacer}>
          Start with a 14-day free trial and an introductory offer price.
          Your subscription can be cancelled at any time.
        </p>
        <ThemeProvider theme={buttonReaderRevenue}>
          <div css={spacer}>
            <LinkButton
              priority="primary"
              iconSide="right"
              icon={<SvgArrowRightStraight />}
              href={`${getOrigin()}/subscribe/digital/checkout?period=Monthly&promoCode=DK0NT24WG`}
            >
            Subscribe for £5.99 for the first three months
            </LinkButton>
          </div>
          <div css={spacer}>
            <LinkButton
              priority="primary"
              iconSide="right"
              icon={<SvgArrowRightStraight />}
              href={`${getOrigin()}/subscribe/digital/checkout?period=Annual&promoCode=ANNUAL-INTRO`}
            >
            Subscribe for £99 for the first year
            </LinkButton>
          </div>
        </ThemeProvider>
      </AccordionRow>
    </Accordion>
  );
}

export default DigitalSubscriptionDetail;
