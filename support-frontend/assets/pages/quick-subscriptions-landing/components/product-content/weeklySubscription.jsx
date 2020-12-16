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

function WeeklySubscriptionDetail() {
  return (
    <Accordion hideToggleLabel>
      <AccordionRow label="Find out more">
        <p css={spacer}>
          The Guardian Weekly magazine is a round-up of the world news, opinion and long reads that
          have shaped the week. Inside, the past seven days&apos; most memorable stories are reframed
          with striking photography and insightful companion pieces, all handpicked from The Guardian and The Observer.
        </p>
        <p css={spacer}>
          Start reading for just £6 for the first six issues.
          Your subscription can be cancelled at any time.
        </p>
        <ThemeProvider theme={buttonReaderRevenue}>
          <div css={spacer}>
            <LinkButton
              priority="primary"
              iconSide="right"
              icon={<SvgArrowRightStraight />}
              href={`${getOrigin()}/subscribe/weekly/checkout?period=SixWeekly`}
            >
            Get your first six issues for £6
            </LinkButton>
          </div>
          <div css={spacer}>
            <LinkButton
              priority="primary"
              iconSide="right"
              icon={<SvgArrowRightStraight />}
              href={`${getOrigin()}/subscribe/weekly/checkout?period=Quarterly`}
            >
            Subscribe for £135 for the first year
            </LinkButton>
          </div>
        </ThemeProvider>
      </AccordionRow>
    </Accordion>
  );
}

export default WeeklySubscriptionDetail;
