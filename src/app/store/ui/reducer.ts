import {
    NAVBAR_DARK_VARIANTS,
    NAVBAR_LIGHT_VARIANTS,
    SIDEBAR_DARK_SKINS,
    SIDEBAR_LIGHT_SKINS
} from '@/utils/themes';
import * as Actions from './actions';
import { UiAction } from './actions';
import initialState, { UiState } from './state';

export function uiReducer(state: UiState = initialState, action: UiAction) {
    switch (action.type) {
        case Actions.TOGGLE_SIDEBAR_MENU:
            return {
                ...state,
                menuSidebarCollapsed: !state.menuSidebarCollapsed
            };
        case Actions.TOGGLE_CONTROL_SIDEBAR:
            return {
                ...state,
                controlSidebarCollapsed: !state.controlSidebarCollapsed
            };
        case Actions.TOGGLE_DARK_MODE:
            let variant: string;
            let skin: string;
            if (state.darkMode) {
                variant = NAVBAR_LIGHT_VARIANTS[0].value;
                skin = SIDEBAR_LIGHT_SKINS[0].value;
            } else {
                variant = NAVBAR_DARK_VARIANTS[0].value;
                skin = SIDEBAR_DARK_SKINS[0].value;
            }
            return {
                ...state,
                navbarVariant: variant,
                sidebarSkin: skin,
                darkMode: !state.darkMode
            };

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
                        data: action.payload,
                        error: undefined,
                        loading: false
                    }
                };

            case Actions.GET_ALL_PACKAGES_FAILURE:
                return {
                    ...state,
                    allPackages: {
                        data: [],
                        error: action.payload,
                        loading: false
                    }
                };

            //<--- ORDER REDUCERS --->
            case Actions.GET_ALL_ORDERS_REQUEST:
                return {
                    ...state,
                    allOrders: {
                        data: [],
                        error: undefined,
                        loading: true
                    }
                };

            case Actions.GET_ALL_ORDERS_SUCCESS:
                return {
                    ...state,
                    allOrders: {
                        data: action.payload,
                        error: undefined,
                        loading: false
                    }
                };

            case Actions.GET_ALL_ORDERS_FAILURE:
                return {
                    ...state,
                    allOrders: {
                        data: [],
                        error: action.payload,
                        loading: false
                    }
                };
            //<---------------------->


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
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.GET_ALL_PACKAGES_FAILURE:
            return {
                ...state,
                allPackages: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.OPEN_MODAL_CREATE_PACKAGE:
            return {
                ...state,
                onePackage: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        //<--- PERMISSIONS AND ROLE REDUCERS -------------------------->
        case Actions.GET_ALL_PERMISSIONS_REQUEST:
            return {
                ...state,
                allPermissions: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };


        case Actions.GET_ALL_PERMISSIONS_SUCCESS:
            return {
                ...state,
                allPermissions: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };


        case Actions.GET_ALL_PERMISSIONS_FAILURE:
            return {
                ...state,
                allPermissions: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.GET_ALL_PERMISSIONS_REQUEST:
            return {
                ...state,
                allRoles: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };


        case Actions.GET_ALL_ROLE_SUCCESS:
            return {
                ...state,
                allRoles: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.GET_ALL_ROLE_FAILURE:
            return {
                ...state,
                allRoles: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.OPEN_MODAL_CREATE_ROLE:
            return {
                ...state,
                oneRole: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.GET_ALL_PERMISSIONS_SUCCESS:
            return {
                ...state,
                allPermissions: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };


        case Actions.GET_ALL_PERMISSIONS_FAILURE:
            return {
                ...state,
                allPermissions: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.GET_ALL_PERMISSIONS_REQUEST:
            return {
                ...state,
                allRoles: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };


        case Actions.GET_ALL_ROLE_SUCCESS:
            return {
                ...state,
                allRoles: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };


        case Actions.GET_ALL_ROLE_FAILURE:
            return {
                ...state,
                allRoles: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };
        //<------------------------------------------------------------->


        case Actions.GET_ALL_COSTUMER_REQUEST:
            return {
                ...state,
                allCostumers: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.GET_ALL_COSTUMER_SUCCESS:
            return {
                ...state,
                allCostumers: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.GET_ALL_COSTUMER_FAILURE:
            return {
                ...state,
                allCostumers: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };


        case Actions.GET_ALL_EMPLOYEE_REQUEST:
            return {
                ...state,
                alEmployees: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.GET_ALL_EMPLOYEE_SUCCESS:
            return {
                ...state,
                alEmployees: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.GET_ALL_EMPLOYEE_FAILURE:
            return {
                ...state,
                alEmployees: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };
        default:
            return state;
    }
}
