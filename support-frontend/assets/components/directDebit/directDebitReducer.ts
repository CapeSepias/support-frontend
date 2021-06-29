// ----- Imports ----- //
import { Action, Phase } from './directDebitActions';
// ----- Setup ----- //
export type DirectDebitState = {
	isPopUpOpen: boolean;
	isDDGuaranteeOpen: boolean;
	sortCodeArray: Array<string>;
	sortCodeString: string;
	accountNumber: string;
	accountHolderName: string;
	accountHolderConfirmation: boolean;
	formError: string;
	phase: Phase;
};
const initialState: DirectDebitState = {
	isPopUpOpen: false,
	isDDGuaranteeOpen: false,
	sortCodeArray: Array(3).fill(''),
	sortCodeString: '',
	accountNumber: '',
	accountHolderName: '',
	accountHolderConfirmation: false,
	formError: '',
	phase: 'entry',
};

// ----- Reducers ----- //
const directDebitReducer = (
	state: DirectDebitState = initialState,
	action: Action,
): DirectDebitState => {
	switch (action.type) {
		case 'DIRECT_DEBIT_POP_UP_OPEN':
			return { ...state, isPopUpOpen: true };

		case 'DIRECT_DEBIT_POP_UP_CLOSE':
			return { ...state, isPopUpOpen: false };

		case 'DIRECT_DEBIT_GUARANTEE_OPEN':
			return { ...state, isDDGuaranteeOpen: true };

		case 'DIRECT_DEBIT_GUARANTEE_CLOSE':
			return { ...state, isDDGuaranteeOpen: false };

		case 'DIRECT_DEBIT_UPDATE_SORT_CODE':
			initialState.sortCodeArray[action.index] = action.partialSortCode;
			return { ...state, sortCode: initialState.sortCodeArray };

		case 'DIRECT_DEBIT_UPDATE_SORT_CODE_STRING':
			return { ...state, sortCodeString: action.sortCodeString };

		case 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER':
			return { ...state, accountNumber: action.accountNumber };

		case 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME':
			return { ...state, accountHolderName: action.accountHolderName };

		case 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION':
			return {
				...state,
				accountHolderConfirmation: action.accountHolderConfirmation,
			};

		case 'DIRECT_DEBIT_SET_FORM_ERROR':
			return { ...state, formError: action.message };

		case 'DIRECT_DEBIT_RESET_FORM_ERROR': {
			return { ...state, formError: '' };
		}

		case 'DIRECT_DEBIT_SET_FORM_PHASE': {
			return { ...state, phase: action.phase };
		}

		default:
			return state;
	}
};

// ----- Exports ----- //
export { directDebitReducer };
