// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { ThankYouPageStage } from 'pages/contributions-landing/contributionsLandingReducer';
import type { IsoCountry } from 'helpers/internationalisation/country';
import ausMomentEnabled from 'helpers/ausMoment';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  firstName: string,
  thankYouPageStage: ThankYouPageStage,
  countryId: IsoCountry,
|};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  firstName: state.page.form.formData.firstName,
  thankYouPageStage: state.page.form.thankYouPageStage,
});

// ----- Render ----- //

const ContributionThankYouBlurb = (props: PropTypes) => {
  const { firstName, thankYouPageStage } = props;
  const controlHeaderText = () => (firstName && firstName.length < 10 && firstName.trim() !== '') ?
    `Thank\xa0you\xa0${firstName}\nfor\xa0your\xa0valuable\ncontribution` : 'Thank\xa0you\xa0for\nyour\xa0valuable\ncontribution';

  const ausMomentHeaderText = 'Thank you – you’ve done something powerful';

  const headerText = ausMomentEnabled(props.countryId) ? ausMomentHeaderText : controlHeaderText();

  return (
    <div className="gu-content__blurb gu-content__blurb--thank-you">
      <h1 className="gu-content__blurb-header">{headerText}</h1>
      {thankYouPageStage !== 'thankYouSetPassword' && ausMomentEnabled(props.countryId) &&
      <p className="gu-content__blurb-blurb gu-content__blurb-blurb--thank-you">
        {'Here are some additional ways that you can support us, and improve your experience with the Guardian.'}
      </p>
    }
    </div>);
};

export default connect(mapStateToProps)(ContributionThankYouBlurb);
