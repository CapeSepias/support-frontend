// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline } from '@guardian/src-foundations/typography';

import CentredContainer from 'components/containers/centredContainer';
// import GridImage from 'components/gridImage/gridImage';
import PageTitle from 'components/page/pageTitle';
import Hero from 'components/page/hero';
import DigitalPackshotHero
  from 'components/packshots/digital-packshot-hero';

const heroCopy = css`
  padding: 0 ${space[3]}px ${space[3]}px;
`;

const heroTitle = css`
  ${headline.medium({ fontWeight: 'bold' })};
  margin-bottom: ${space[3]}px;

  ${from.tablet} {
    ${headline.large({ fontWeight: 'bold' })};
  }
`;

const heroParagraph = css`
  ${body.medium({ lineHeight: 'loose' })}
  margin-bottom: ${space[9]}px;
  max-width: 75%;
`;

function SubscriptionHero() {
  return (
    <PageTitle
      title="Subscribe to The Guardian"
      theme="showcase"
    >
      <CentredContainer>
        <Hero
          image={<DigitalPackshotHero countryGroupId="GBPCountries" />}
        >
          <section css={heroCopy}>
            <h2 css={heroTitle}>A subscription option<br />to suit every reader</h2>
            <p css={heroParagraph}>
              {`Read on the go with our mobile apps, see the news that's shaped the week with the Guardian Weekly,
              or have The Guardian and The Observer delivered to your door up to seven days a week.`}
            </p>
          </section>
        </Hero>
      </CentredContainer>
    </PageTitle>
  );
}

export default SubscriptionHero;
