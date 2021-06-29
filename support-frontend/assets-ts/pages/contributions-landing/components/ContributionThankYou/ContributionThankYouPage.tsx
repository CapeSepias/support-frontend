import React from 'react';
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import ContributionThankYou from './ContributionThankYou';

type ContributionThankYouProps = {
	countryGroupId: CountryGroupId;
};

const ContributionThankYouPage = ({
	countryGroupId,
}: ContributionThankYouProps) => (
	<Page
		classModifiers={['contribution-thankyou']}
		header={<RoundelHeader />}
		footer={<Footer disclaimer={true} countryGroupId={countryGroupId} />}
	>
		<ContributionThankYou />
	</Page>
);

export default ContributionThankYouPage;
