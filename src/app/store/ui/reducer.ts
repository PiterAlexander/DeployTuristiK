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
        //<--- TOGGLE --->
        case Actions.toggleActions.TOGGLE_SIDEBAR_MENU:
            return {
                ...state,
                menuSidebarCollapsed: !state.menuSidebarCollapsed
            };
        case Actions.toggleActions.TOGGLE_CONTROL_SIDEBAR:
            return {
                ...state,
                controlSidebarCollapsed: !state.controlSidebarCollapsed
            };
        case Actions.toggleActions.TOGGLE_DARK_MODE:
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
        //<---------------->

        //<--- PACKAGES --->
        case Actions.packageActions.GET_ALL_PACKAGES_REQUEST:
            return {
                ...state,
                allPackages: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.packageActions.GET_ALL_PACKAGES_SUCCESS:
            return {
                ...state,
                allPackages: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.packageActions.GET_ALL_PACKAGES_FAILURE:
            return {
                ...state,
                allPackages: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.packageActions.OPEN_MODAL_CREATE_PACKAGE:
            return {
                ...state,
                onePackage: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        //<-------------->

        //<--- ORDERS --->
        case Actions.orderActions.GET_ALL_ORDERS_REQUEST:
            return {
                ...state,
                allOrders: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.orderActions.GET_ALL_ORDERS_SUCCESS:
            return {
                ...state,
                allOrders: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.orderActions.GET_ALL_ORDERS_FAILURE:
            return {
                ...state,
                allOrders: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.orderActions.CREATE_ORDER_DATA:
            return {
                ...state,
                orderProcess: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            }
        //<----------------------------->

        //<--- ROLES AND PERMISSIONS --->
        case Actions.roleActions.GET_ALL_ROLE_REQUEST:
            return {
                ...state,
                allRoles: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.roleActions.GET_ALL_ROLE_SUCCESS:
            return {
                ...state,
                allRoles: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.roleActions.GET_ALL_ROLE_FAILURE:
            return {
                ...state,
                allRoles: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.roleActions.OPEN_MODAL_CREATE_ROLE:
            return {
                ...state,
                oneRole: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.permissionActions.GET_ALL_PERMISSIONS_REQUEST:
            return {
                ...state,
                allPermissions: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.permissionActions.GET_ALL_PERMISSIONS_SUCCESS:
            return {
                ...state,
                allPermissions: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.permissionActions.GET_ALL_PERMISSIONS_FAILURE:
            return {
                ...state,
                allPermissions: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };
        //<----------------->

        //<--- COSTUMERS --->
        case Actions.costumerActions.GET_ALL_COSTUMER_REQUEST:
            return {
                ...state,
                allCostumers: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.costumerActions.GET_ALL_COSTUMER_SUCCESS:
            return {
                ...state,
                allCostumers: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.costumerActions.GET_ALL_COSTUMER_FAILURE:
            return {
                ...state,
                allCostumers: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.costumerActions.OPEN_MODAL_CREATE_COSTUMER:
            return {
                ...state,
                oneCostumer: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        //<----------------->

        //<--- EMPLOYEES --->
        case Actions.employeeActions.GET_ALL_EMPLOYEE_REQUEST:
            return {
                ...state,
                allEmployees: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.employeeActions.GET_ALL_EMPLOYEE_SUCCESS:
            return {
                ...state,
                allEmployees: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.employeeActions.GET_ALL_EMPLOYEE_FAILURE:
            return {
                ...state,
                allEmployees: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };
        case Actions.employeeActions.OPEN_MODAL_CREATE_EMPLOYEE:
            return {
                ...state,
                oneEmployee: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        //<------------>

        //<--- USER --->
        case Actions.userActions.GET_USERS_REQUEST:
            return {
                ...state,
                allUsers: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.userActions.GET_USERS_SUCCESS:
            return {
                ...state,
                allUsers: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.userActions.GET_USERS_FAILURE:
            return {
                ...state,
                allUsers: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.userActions.OPEN_MODAL_USER:
            return {
                ...state,
                currentUser: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        //<------------>

        default:
            return state;
    }
}
