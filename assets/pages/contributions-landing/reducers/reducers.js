// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import type { Contrib, ContribError, Amounts } from 'helpers/contributions';
import { intCmpReducer as intCmp } from 'helpers/tracking/guTracking';
import { refpvidReducer as refpvid } from 'helpers/tracking/guTracking';
import { isoCountryReducer as isoCountry } from 'helpers/isoCountry';

import { parse as parseContribution } from 'helpers/contributions';
import { abTestReducer as abTests } from 'helpers/abtest';
import type { Action } from '../actions/contributionsLandingActions';


// ----- Types ----- //

export type ContribState = {
  type: Contrib,
  error: ?ContribError,
  amount: Amounts,
  payPalError: ?string,
  context: ?boolean,
};


// ----- Setup ----- //

const initialContrib: ContribState = {
  type: 'RECURRING',
  error: null,
  amount: {
    recurring: {
      value: '10',
      userDefined: false,
    },
    oneOff: {
      value: '50',
      userDefined: false,
    },
  },
  payPalError: null,
  context: false,
};


// ----- Reducers ----- //

function contribution(
  state: ContribState = initialContrib,
  action: Action): ContribState {

  switch (action.type) {

    case 'CHANGE_CONTRIB_TYPE': {

      let amount;

      if (action.contribType === 'ONE_OFF') {
        amount = state.amount.oneOff.value;
      } else {
        amount = state.amount.recurring.value;
      }

      return Object.assign({}, state, {
        type: action.contribType,
        error: parseContribution(amount, action.contribType).error,
      });

    }

    case 'CHANGE_CONTRIB_AMOUNT':

      return Object.assign({}, state, {
        amount: { recurring: action.amount, oneOff: action.amount },
        error: parseContribution(action.amount.value, state.type).error,
      });

    case 'CHANGE_CONTRIB_AMOUNT_RECURRING':

      return Object.assign({}, state, {
        amount: { recurring: action.amount, oneOff: state.amount.oneOff },
        error: parseContribution(action.amount.value, state.type).error,
      });

    case 'CHANGE_CONTRIB_AMOUNT_ONEOFF':

      return Object.assign({}, state, {
        amount: { recurring: state.amount.recurring, oneOff: action.amount },
        error: parseContribution(action.amount.value, state.type).error,
      });

    case 'PAYPAL_ERROR':

      return Object.assign({}, state, {
        payPalError: action.message,
      });

    case 'SET_CONTEXT':

      return Object.assign({}, state, { context: action.context });

    default:
      return state;

  }

}

// ----- Exports ----- //

export default combineReducers({
  contribution,
  intCmp,
  refpvid,
  abTests,
  isoCountry,
});
