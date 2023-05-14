import { PackageAction } from './actions';
import initialState, { PackageState } from './state';
import * as Actions from './actions';

export function packageReducer(state: PackageState = initialState, action: PackageAction) {
    switch (action.type) {
        case Actions.GET_ALL_PACKAGES_REQUEST:
            return {
                ...state,
                allPackages: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.GET_ALL_PACKAGES_SUCCESS:
            return {
                ...state,
                allPackages: {
                    data: null,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.GET_ALL_PACKAGES_FAILURE:
            return {
                ...state,
                allPackages: {
                    data: [],
                    error: null,
                    loading: false
                }
            };



        default:
            return state;
    }
}