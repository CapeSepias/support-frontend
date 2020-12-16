// @flow

// ----- Imports ----- //

import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline, titlepiece } from '@guardian/src-foundations/typography';
import { LinkButton, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';

import CentredContainer from 'components/containers/centredContainer';
// import GridImage from 'components/gridImage/gridImage';
import PageTitle from 'components/page/pageTitle';
import Hero from 'components/page/hero';
import DigitalPackshotHero
  from 'components/packshots/digital-packshot-hero';

const titleOverride = css`
  h1 {
    ${from.desktop} {
      ${titlepiece.medium({ fontWeight: 'bold' })}
    }
  }
`;

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
  margin-bottom: ${space[4]}px;
  max-width: 75%;
`;

const heroButtons = css`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  a {
    margin-bottom: ${space[3]}px;
  }
`;

function SubscriptionHero() {
  return (
    <PageTitle
      title="Support The Guardian with a subscription"
      theme="showcase"
      cssOverrides={titleOverride}
    >
      <CentredContainer>
        <Hero
          image={<DigitalPackshotHero countryGroupId="GBPCountries" />}
        >
          <section css={heroCopy}>
            <h2 css={heroTitle}>A subscription option<br />to suit every reader</h2>
            <p css={heroParagraph}>
              Read on the go with our mobile apps, see the news that&apos;s shaped the week with the Guardian Weekly,
              or have The Guardian and The Observer delivered to your door up to seven days a week.
            </p>
            <p css={heroParagraph}>
              Your subscription helps keep our award-winning, independent journalism open to everyone, while enabling
              you to read in the way that suits you best.
            </p>
            <ThemeProvider theme={buttonBrand}>
              <div css={heroButtons}>
                <LinkButton
                  priority="tertiary"
                  iconSide="right"
                  icon={<SvgArrowDownStraight />}
                  href="#DigitalSubscription"
                >
                Get the digital subscription
                </LinkButton>
                <LinkButton
                  priority="tertiary"
                  iconSide="right"
                  icon={<SvgArrowDownStraight />}
                  href="#TheGuardianWeekly"
                >
                Read The Guardian in print
                </LinkButton>
              </div>
            </ThemeProvider>
          </section>
        </Hero>
      </CentredContainer>
    </PageTitle>
  );
}

export default SubscriptionHero;
