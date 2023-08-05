
import * as Actions from './actions';
import {UiAction} from './actions';
import initialState, {UiState} from './state';

export function uiReducer(state: UiState = initialState, action: UiAction) {
    switch (action.type) {
        //<--- TOGGLE --->
        case Actions.toggleActions.TOGGLE_SIDEBAR_MENU:
            return {
                ...state,
                menuSidebarCollapsed: !state.menuSidebarCollapsed
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

        case Actions.packageActions.GET_TOP_PACKAGES_REQUEST:
            return {
                ...state,
                allTopPackages: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.packageActions.GET_TOP_PACKAGES_SUCCESS:
            return {
                ...state,
                allTopPackages: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.packageActions.GET_TOP_PACKAGES_FAILURE:
            return {
                ...state,
                allTopPackages: {
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
                },
                dateCalendarSelected: {
                    data: action['dateCalendar'],
                    error: undefined,
                    loading: false
                }
            };

        case Actions.packageActions.CHANGE_STATUS_PACKAGE_REQUEST:
            return {
                ...state,
                onePackage: {
                    data: undefined,
                    error: undefined,
                    loading: true
                }
            };

        case Actions.packageActions.CHANGE_STATUS_PACKAGE_SUCCESS:
            return {
                ...state,
                onePackage: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        case Actions.packageActions.CHANGE_STATUS_PACKAGE_FAILURE:
            return {
                ...state,
                onePackage: {
                    data: undefined,
                    error: action.payload,
                    loading: false
                }
            };
        case Actions.OPEN_MODAL_DETAILS_PACKAGE:
            return {
                ...state,
                onePackage: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        case Actions.CHANGE_STATUS_PACKAGE_REQUEST:
            return {
                ...state,
                onePackage: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        case Actions.GET_ALL_PERMISSIONS_REQUEST:
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

        case Actions.orderActions.OPEN_MODAL_CREATE_ORDER:
            return {
                ...state,
                orderProcess: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.orderActions.OPEN_MODAL_ORDERDETAILS:
            return {
                ...state,
                oneOrder: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.orderActions.OPEN_MODAL_CREATE_ORDERDETAIL:
            return {
                ...state,
                orderProcess: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.orderActions.OPEN_MODAL_PAYMENTS:
            return {
                ...state,
                oneOrder: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.orderActions.OPEN_MODAL_CREATE_PAYMENT:
            return {
                ...state,
                orderProcess: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.orderActions.OPEN_MODAL_EDIT_PAYMENT:
            return {
                ...state,
                onePayment: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
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

        //<--- CUSTOMERS --->
        case Actions.customerActions.GET_ALL_CUSTOMER_REQUEST:
            return {
                ...state,
                allCustomers: {
                    data: [],
                    error: undefined,
                    loading: true
                }
            };

        case Actions.customerActions.GET_ALL_CUSTOMER_SUCCESS:
            return {
                ...state,
                allCustomers: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.customerActions.GET_ALL_CUSTOMER_FAILURE:
            return {
                ...state,
                allCustomers: {
                    data: [],
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.customerActions.OPEN_MODAL_CREATE_CUSTOMER:
            return {
                ...state,
                oneCustomer: {
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

        //<--- FREQUENT TRAVELER --->

        case Actions.FrequentTravelerActions.OPEN_MODAL_LIST_FREQUENTTRAVELER:
            return {
                ...state,
                allFrequentTraveler: {
                    data: action.payload['frequentTraveler'],
                    error: undefined,
                    loading: false
                },
                oneCustomer: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
        //<----------------->

        //<--- USER --->

        case Actions.userActions.OPEN_MODAL_USER:
            return {
                ...state,
                currentUser: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };
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

        //<--- LOGIN --->

        case Actions.loginActions.LOGIN_REQUEST:
            return {
                ...state,
                token: {
                    data: undefined,
                    error: undefined,
                    loading: true
                }
            };

        case Actions.loginActions.LOGIN_SUCCESS:
            return {
                ...state,
                token: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.loginActions.LOGIN_FAILURE:
            return {
                ...state,
                token: {
                    data: undefined,
                    error: action.payload,
                    loading: false
                }
            };

        case Actions.loginActions.GET_USER_INFO_REQUEST:
            return {
                ...state,
                userLoged: {
                    data: action.payload,
                    error: undefined,
                    loading: true
                }
            };

        case Actions.loginActions.GET_USER_INFO_SUCCESS:
            return {
                ...state,
                userLogged: {
                    data: action.payload,
                    error: undefined,
                    loading: false
                }
            };

        case Actions.loginActions.GET_USER_INFO_FAILURE:
            return {
                ...state,
                userLogged: {
                    data: undefined,
                    error: action.payload,
                    loading: false
                }
            };


            case Actions.loginActions.SAVE_CURRENT_USER_REQUEST:
                return {
                    ...state,
                    currentUser: {
                        data: action.payload,
                        error: undefined,
                        loading: true
                    }
                };
    
            case Actions.loginActions.SAVE_CURRENT_USER_SUCCESS:
                return {
                    ...state,
                    currentUser: {
                        data: action.payload,
                        error: undefined,
                        loading: false
                    }
                };
    
            case Actions.loginActions.SAVE_CURRENT_USER_FAILURE:
                return {
                    ...state,
                    currentUser: {
                        data: undefined,
                        error: action.payload,
                        loading: false
                    }
                };
        //<------------>
        default:
            return state;
    }
}
