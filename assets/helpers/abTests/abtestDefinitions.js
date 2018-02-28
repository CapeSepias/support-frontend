// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  directDebitTest: {
    variants: ['control', 'directDebit'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 0,
  },

  pleaseConsiderMonthly: {
    variants: ['control', 'variant'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 7,
  },

  upsellRecurringContributions: {
    variants: ['control', 'benefitsOfBoth', 'shorterControl'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 99,
  },
};
