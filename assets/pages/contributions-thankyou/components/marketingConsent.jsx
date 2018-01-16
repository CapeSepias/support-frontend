// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import CheckboxInput from 'components/checkboxInput/checkboxInput';

import { connect } from 'react-redux';
import { sendMarketingPreferencesToIdentity } from
  '../contributionsThankyouActions';
import { setGnmMarketing } from '../../../helpers/user/userActions';
import { routes } from '../../../helpers/routes';

// ----- Types ----- //

type PropTypes = {
  onClick: (marketingPreferencesOptIn: boolean, email?: string) => void,
  marketingPreferencesOptIn: boolean,
  marketingPreferenceUpdate: (preference: boolean) => void,
  email?: string,
};


// ----- Component ----- //

function MarketingConsent(props: PropTypes) {

  const params = new URLSearchParams();
  const optInParam = props.marketingPreferencesOptIn === true ? 'yes' : 'no';
  params.append('optIn', optInParam);
  const marketingConfirmUrl = `${routes.contributionsMarketingConfirm}?${params.toString()}`;

  return (
    <div>
      <section className="component-info-section marketing-opt-in">
        <div className="component-info-section__header">
          Stay in touch
        </div>
        <div className="thankyou__wrapper marketing-opt-in__wrapper">
          <h2 id="qa-thank-you-message" className="thankyou__subheading">
            <CheckboxInput
              id="gnm-marketing-preference"
              checked={props.marketingPreferencesOptIn || false}
              onChange={props.marketingPreferenceUpdate}
              labelTitle="Subscriptions, membership and supporting The&nbsp;Guardian"
              labelCopy="Get related news and offers - whether you are a subscriber, member, supporter or would like to become one."
            />
          </h2>
          <CtaLink
            onClick={() => props.onClick(props.marketingPreferencesOptIn, props.email)}
            ctaId="Next"
            text="Next"
            accessibilityHint="Go to the guardian dot com front page"
            url={marketingConfirmUrl}
          />
        </div>
      </section>
    </div>);
}

function mapDispatchToProps(dispatch) {

  return {
    onClick: (marketingPreferencesOptIn: boolean, email?: string) => {
      dispatch(sendMarketingPreferencesToIdentity(marketingPreferencesOptIn, email));
    },
    marketingPreferenceUpdate: (preference: boolean) => {
      dispatch(setGnmMarketing(preference));
    },
  };
}

function mapStateToProps(state) {
  return {
    email: state.page.email,
    marketingPreferencesOptIn: state.page.gnmMarketing,
  };
}


MarketingConsent.defaultProps = {
  email: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
