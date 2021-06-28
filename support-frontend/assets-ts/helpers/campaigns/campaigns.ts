import { ContributionTypes } from 'helpers/contributions';
import { TickerSettings } from 'components/ticker/contributionTicker';

type CampaignCopy = {
	headerCopy?:
		| string
		| React.ReactElement<React.ComponentProps<string>, string>;
	contributeCopy?:
		| string
		| React.ReactElement<React.ComponentProps<string>, string>;
};
export type CampaignSettings = {
	campaignCode: string;
	copy?: (goalReached: boolean) => CampaignCopy;
	formMessage?: React.ReactElement<React.ComponentProps<string>, string>;
	termsAndConditions?: (
		contributionsTermsLink: string,
		contactEmail: string,
	) => React.ReactElement<React.ComponentProps<string>, string>;
	cssModifiers?: string[];
	contributionTypes?: ContributionTypes;
	backgroundImage?: string;
	extraComponent?: React.ReactElement<React.ComponentProps<string>, string>;
	tickerSettings?: TickerSettings;
	goalReachedCopy?: React.ReactElement<React.ComponentProps<string>, string>;
	// If set, the form will be replaced with this if goal reached
	createReferralCodes: boolean;
};
const currentCampaignPath: string | null = 'us/contribute';

const usEndOfYearCampaignCopy = (): CampaignCopy => ({
	headerCopy: 'Help us reach our $1.25m goal!',
	contributeCopy:
		'As America begins a new chapter, the need for robust, fact-based journalism that highlights injustice and offers solutions is as great as ever. Support the Guardian’s open, independent journalism with a year-end gift.',
});

const usEndOfYearCampaignXmasCopy = (): CampaignCopy => ({
	headerCopy: 'Help fund high\xa0impact journalism in\xa02021',
	contributeCopy:
		'As America begins a new chapter, the need for robust, fact-based journalism that highlights injustice and offers solutions is as great as ever. Support the Guardian’s open, independent journalism with a gift today.',
});

const DEC_29 = Date.parse('2020-12-29');
export const campaign: CampaignSettings = {
	campaignCode: 'us_eoyappeal_2020',
	copy:
		Date.now() < DEC_29 ? usEndOfYearCampaignCopy : usEndOfYearCampaignXmasCopy,
	tickerSettings: {
		tickerCountType: 'money',
		tickerEndType: 'unlimited',
		currencySymbol: '$',
		copy: {
			countLabel: 'contributed',
			goalReachedPrimary: "It's not too late to give!",
			goalReachedSecondary: '',
		},
	},
	createReferralCodes: false,
};

function campaignEnabledForUser(
	campaignCode: string | null | undefined,
): boolean {
	if (currentCampaignPath && window.guardian.enableContributionsCampaign) {
		return (
			window.guardian.forceContributionsCampaign ||
			window.location.pathname.endsWith(`/${currentCampaignPath}`) ||
			campaign.campaignCode === campaignCode
		);
	}

	return false;
}

export function getCampaignSettings(
	campaignCode: string | null | undefined,
): CampaignSettings | null {
	if (campaignEnabledForUser(campaignCode)) {
		return campaign;
	}

	return null;
}
export function getCampaignCode(campaignCode?: string): string | null {
	const campaignSettings = getCampaignSettings(campaignCode);

	if (campaignSettings) {
		return campaignSettings.campaignCode;
	}

	return null;
}
