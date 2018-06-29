// @flow

// ----- Imports ----- //

import type { Country } from 'helpers/internationalisation/country';

import { createCommonReducer } from '../page';
import type { IsoCountry } from '../../internationalisation/country'


// ----- Tests ----- //

jest.mock('ophan', () => {});

describe('reducer tests', () => {

  let reducer = () => {};

  beforeEach(() => {

    const initialState = {
      campaign: 'dummy_campaign',
      referrerAcquisitionData: {
        referrerPageviewId: null,
        campaignCode: null,
        referrerUrl: null,
        componentId: null,
        componentType: null,
        source: null,
        abTests: [],
      },
      country: 'GB',
      abParticipations: {},
    };

    reducer = createCommonReducer(initialState);

  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle SET_COUNTRY to US', () => {

    const countryId: IsoCountry = 'US';
    const action = {
      type: 'SET_COUNTRY',
      countryId,
    };

    const newState = reducer(undefined, action);

    expect(newState.internationalisation.country).toEqual(countryId);
    expect(newState.referrerAcquisitionData.campaignCode).toMatchSnapshot();
    expect(newState.campaign).toMatchSnapshot();
    expect(newState.referrerAcquisitionData.campaignCode).toMatchSnapshot();
    expect(newState.abParticipations).toMatchSnapshot();
  });

});
