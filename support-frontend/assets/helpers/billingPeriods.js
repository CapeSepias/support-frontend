// @flow

const Annual: 'Annual' = 'Annual';
const Monthly: 'Monthly' = 'Monthly';
const Quarterly: 'Quarterly' = 'Quarterly';
const SixForSix: 'SixForSix' = 'SixForSix';
const SixWeekly: 'SixWeekly' = 'SixWeekly';
const ActiveWeeklyProductTypes = [Quarterly, Annual, SixForSix];
export type BillingPeriod = typeof SixForSix | typeof SixWeekly | typeof Annual | typeof Monthly | typeof Quarterly;
export type DigitalBillingPeriod = typeof Monthly | typeof Annual;
export type WeeklyBillingPeriod = typeof SixWeekly | typeof Quarterly | typeof Annual;
export type ContributionBillingPeriod = typeof Monthly | typeof Annual;

function billingPeriodNoun(billingPeriod: BillingPeriod) {
  switch (billingPeriod) {
    case Annual:
      return 'Year';
    case Quarterly:
      return 'Quarter';
    case SixWeekly:
      return 'Six issues';
    default:
      return 'Month';
  }
}

export { Annual, Monthly, Quarterly, SixForSix, SixWeekly, billingPeriodNoun, ActiveWeeklyProductTypes };
