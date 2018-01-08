// @flow
import { getQueryParameter } from '../url';
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  usRecurringAmountsTestTwo: {
    variants: ['control', 'higher', 'range'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 1,
  },

  usSecureLogoTest: {
    variants: ['control', 'logo'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 6,
  },

  ukDropBottomTest: {
    variants: ['control', 'no_bottom'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    customSegmentCondition: () => getQueryParameter('bundle') === 'contribute',
    seed: 7,
  },

};

