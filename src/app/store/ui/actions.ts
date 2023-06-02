import { Order } from '@/models/order';
import { Costumer } from '@/models/costumer';
import { Employee } from '@/models/employee';
import { Package } from '@/models/package';
import { Permission } from '@/models/permission';
import { Role } from '@/models/role';
import { AssociatedPermission } from '@/models/associated-permission';
import { Action } from '@ngrx/store';
import { User } from '@/models/user';

export const TOGGLE_SIDEBAR_MENU: string = 'TOGGLE_SIDEBAR_MENU';
export const TOGGLE_CONTROL_SIDEBAR: string = 'TOGGLE_CONTROL_SIDEBAR';
export const TOGGLE_DARK_MODE: string = 'TOGGLE_DARK_MODE';

export const OPEN_MODAL_CREATE_PACKAGE: string = '[PACKAGE] OPEN_MODAL_CREATE_PACKAGE';
export const GET_ALL_PACKAGES_REQUEST: string = '[PACKAGE] GET_ALL_PACKAGES_REQUEST';
export const GET_ALL_PACKAGES_SUCCESS: string = '[PACKAGE] GET_ALL_PACKAGES_SUCCESS';
export const GET_ALL_PACKAGES_FAILURE: string = '[PACKAGE] GET_ALL_PACKAGES_FAILURE';

export const CREATE_PACKAGE_REQUEST: string = '[PACKAGE] CREATE_PACKAGE_REQUEST';
export const CREATE_PACKAGE_SUCCESS: string = '[PACKAGE] CREATE_PACKAGE_SUCCESS';
export const CREATE_PACKAGE_FAILURE: string = '[PACKAGE] CREATE_PACKAGE_FAILURE';

//<--- ORDER ACTIONS --->
export const GET_ALL_ORDERS_REQUEST: string = '[ORDER] GET_ALL_ORDERS_REQUEST';
export const GET_ALL_ORDERS_SUCCESS: string = '[ORDER] GET_ALL_ORDERS_SUCCESS';
export const GET_ALL_ORDERS_FAILURE: string = '[ORDER] GET_ALL_ORDERS_FAILURE';

export const OPEN_MODAL_CREATE_ORDER: string = '[ORDER] OPEN_MODAL_CREATE_ORDER';
export const CREATE_ORDER_REQUEST: string = '[ORDER] CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS: string = '[ORDER] CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE: string = '[ORDER] CREATE_ORDER_FAILURE';
//<--------------------->
export const EDIT_PACKAGE_REQUEST: string = '[PACKAGE] EDIT_PACKAGE_REQUEST';
export const EDIT_PACKAGE_SUCCESS: string = '[PACKAGE] EDIT_PACKAGE_SUCCESS';
export const EDIT_PACKAGE_FAILURE: string = '[PACKAGE] EDIT_PACKAGE_FAILURE';


export const OPEN_MODAL_CREATE_ROLE: string = '[ROLES] OPEN_MODAL_CREATE_ROLE';

export const GET_ALL_PERMISSIONS_REQUEST: string = '[PERMISSIONS] GET_ALL_PERMISSIONS_REQUEST';
export const GET_ALL_PERMISSIONS_SUCCESS: string = '[PERMISSIONS] GET_ALL_PERMISSIONS_SUCCESS';
export const GET_ALL_PERMISSIONS_FAILURE: string = '[PERMISSIONS] GET_ALL_PERMISSIONS_FAILURE';

export const CREATE_ROLE_REQUEST: string = '[ROLES] CREATE_ROLE_REQUEST';
export const CREATE_ROLE_SUCCESS: string = '[ROLES] CREATE_ROLE_SUCCESS';
export const CREATE_ROLE_FAILURE: string = '[ROLES] CREATE_ROLE_FAILURE';

export const GET_ALL_ROLE_REQUEST: string = '[PERMISSIONS] GET_ALL_ROLE_REQUEST';
export const GET_ALL_ROLE_SUCCESS: string = '[PERMISSIONS] GET_ALL_ROLE_SUCCESS';
export const GET_ALL_ROLE_FAILURE: string = '[PERMISSIONS] GET_ALL_ROLE_FAILURE';

//<----- COSTUMERS ----->
export const OPEN_MODAL_CREATE_COSTUMER: string = '[COSTUMERS] OPEN_MODAL_CREATE_COSTUMER';

export const GET_ALL_COSTUMER_REQUEST: string = '[COSTUMERS] GET_ALL_COSTUMER__REQUEST';
export const GET_ALL_COSTUMER_SUCCESS: string = '[COSTUMERS] GET_ALL_COSTUMER__SUCCESS';
export const GET_ALL_COSTUMER_FAILURE: string = '[COSTUMERS] GET_ALL_COSTUMER__FAILURE';

export const CREATE_COSTUMER_REQUEST: string = '[COSTUMERS] CREATE_COSTUMER_REQUEST';
export const CREATE_COSTUMER_SUCCESS: string = '[COSTUMERS] CREATE_COSTUMER_SUCCESS';
export const CREATE_COSTUMER_FAILURE: string = '[COSTUMERS] CREATE_COSTUMER_FAILURE';

//<----- EMPLOYEES ----->
export const OPEN_MODAL_CREATE_EMPLOYEE: string = '[EMPLOYEES] OPEN_MODAL_CREATE_EMPLOYEE';

export const GET_ALL_EMPLOYEE_REQUEST: string = '[EMPLOYEES] GET_ALL_EMPLOYEE__REQUEST';
export const GET_ALL_EMPLOYEE_SUCCESS: string = '[EMPLOYEES] GET_ALL_EMPLOYEE__SUCCESS';
export const GET_ALL_EMPLOYEE_FAILURE: string = '[EMPLOYEES] GET_ALL_EMPLOYEE__FAILURE';

export const CREATE_EMPLOYEE_REQUEST: string = '[EMPLOYEES] CREATE_EMPLOYEE_REQUEST';
export const CREATE_EMPLOYEE_SUCCESS: string = '[EMPLOYEES] CREATE_EMPLOYEE_SUCCESS';
export const CREATE_EMPLOYEE_FAILURE: string = '[EMPLOYEES] CREATE_EMPLOYEE_FAILURE';

export const EDIT_ROLE_REQUEST: string = '[ROLES] EDIT_ROLE_REQUEST';
export const EDIT_ROLE_SUCCESS: string = '[ROLES] EDIT_ROLE_SUCCESS';
export const EDIT_ROLE_FAILURE: string = '[ROLES] EDIT_ROLE_FAILURE';

export const CREATE_ASSOCIATEDPERMISSION_REQUEST: string = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_REQUEST';
export const CREATE_ASSOCIATEDPERMISSION_SUCCESS: string = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_SUCCESS';
export const CREATE_ASSOCIATEDPERMISSION_FAILURE: string = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_FAILURE';

export const DELETE_ASSOCIATEDPERMISSION_REQUEST: string = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_REQUEST';
export const DELETE_ASSOCIATEDPERMISSION_SUCCESS: string = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_SUCCESS';
export const DELETE_ASSOCIATEDPERMISSION_FAILURE: string = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_FAILURE';


//<----- USERS ----->

export const OPEN_MODAL_USER: string = '[USERS] OPEN_MODAL_USER';
export enum usersActions {


  CREATE_USER_REQUEST = '[USERS] CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS = '[USERS] CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE = '[USERS] CREATE_USER_FAILURE',

  GET_USERS_REQUEST = '[USERS] GET_USERS_REQUEST',
  GET_USERS_SUCCESS = '[USERS] GET_USERS_SUCCESS',
  GET_USERS_FAILURE = '[USERS] GET_USERS_FAILURE',

  UPDATE_USER_REQUEST = '[USERS] UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS = '[USERS] UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE = '[USERS] UPDATE_USER_FAILURE',
}

export class ToggleSidebarMenu implements Action {
  readonly type: string = TOGGLE_SIDEBAR_MENU;
  constructor(public payload?: string) { }
}
export class ToggleControlSidebar implements Action {
  readonly type: string = TOGGLE_CONTROL_SIDEBAR;
  constructor(public payload?: string) { }
}

export class ToggleDarkMode implements Action {
  readonly type: string = TOGGLE_DARK_MODE;
  constructor(public payload?: string) { }
}


// PACKAGES --------------------------------------------------------
export class OpenModalCreatePackage implements Action {
  readonly type: string = OPEN_MODAL_CREATE_PACKAGE;

  constructor(public payload?: Package) { }
}

// PACKAGES LIST -------------------------------------------------------------

export class GetAllPackagesRequest implements Action {
  readonly type: string = GET_ALL_PACKAGES_REQUEST;
}

export class GetAllPackagesSuccess implements Action {
  readonly type: string = GET_ALL_PACKAGES_SUCCESS;
  constructor(public payload: Array<Package>) { }
}

export class GetAllPackagesFailure implements Action {
  readonly type: string = GET_ALL_PACKAGES_FAILURE;
  constructor(public payload: string) { }
}
// END PACKAGES LIST -------------------------------------------------------------


// PACKAGES CREATE--------------------------------------------------------

export class CreatePackageRequest implements Action {
  readonly type: string = CREATE_PACKAGE_REQUEST;
  constructor(public payload: Package) { }
}

export class CreatePackageSuccess implements Action {
  readonly type: string = CREATE_PACKAGE_SUCCESS;
  constructor(public payload: Package) { }
}

export class CreatePackageFailure implements Action {
  readonly type: string = CREATE_PACKAGE_FAILURE;
  constructor(public payload: string) { }
}

//<--- ORDER ACTIONS --->
export class GetAllOrdersRequest implements Action {
  readonly type: string = GET_ALL_ORDERS_REQUEST;
}
export class GetAllOrdersSuccess implements Action {
  readonly type: string = GET_ALL_ORDERS_SUCCESS;
  constructor(public payload: Array<Order>) { }
}
export class GetAllOrdersFailure implements Action {
  readonly type: string = GET_ALL_ORDERS_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalCreateOrder implements Action {
  readonly type: string = OPEN_MODAL_CREATE_ORDER;
}
export class CreateOrderRequest implements Action {
  readonly type: string = CREATE_ORDER_REQUEST;
  constructor(public payload: Order) { }
}
export class CreateOrderSuccess implements Action {
  readonly type: string = CREATE_ORDER_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateOrderFailure implements Action {
  readonly type: string = CREATE_ORDER_FAILURE;
  constructor(public payload: string) { }
}
//<--------------------->
// END PACKAGES CREATE--------------------------------------------------------

// PACKAGES EDIT--------------------------------------------------------

export class EditPackageRequest implements Action {
  readonly type: string = EDIT_PACKAGE_REQUEST;
  constructor(public payload: Package) { }
}

export class EditPackageSuccess implements Action {
  readonly type: string = EDIT_PACKAGE_SUCCESS;
  readonly string = OPEN_MODAL_CREATE_PACKAGE;
  constructor(public payload: any) { }
}

export class EditPackageFailure implements Action {
  readonly type: string = EDIT_PACKAGE_FAILURE;
  constructor(public payload: string) { }
}

// END PACKAGES EDIT--------------------------------------------------------

// PACKAGES END--------------------------------------------------------

export class OpenModalCreateRole implements Action {
  readonly type: string = OPEN_MODAL_CREATE_ROLE;
  constructor(public payload?: Role) { }
}

export class GetAllPermissionsRequest implements Action {
  readonly type: string = GET_ALL_PERMISSIONS_REQUEST;
}

export class GetAllPermissionsSuccess implements Action {
  readonly type: string = GET_ALL_PERMISSIONS_SUCCESS;
  constructor(public payload: Array<Permission>) { }
}

export class GetAllPermissionsFailure implements Action {
  readonly type: string = GET_ALL_PERMISSIONS_FAILURE;
  constructor(public payload: string) { }
}

export class CreateRoleRequest implements Action {
  readonly type: string = CREATE_ROLE_REQUEST;
  constructor(public payload: Role) { }
}

export class CreateRoleSuccess implements Action {
  readonly type: string = CREATE_ROLE_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateRoleFailure implements Action {
  readonly type: string = CREATE_ROLE_FAILURE;
  constructor(public payload: string) { }
}

export class GetAllRoleRequest implements Action {
  readonly type: string = GET_ALL_ROLE_REQUEST;
}

export class GetAllRoleSuccess implements Action {
  readonly type: string = GET_ALL_ROLE_SUCCESS;
  constructor(public payload: Array<Role>) { }
}

export class GetAllRoleFailure implements Action {
  readonly type: string = GET_ALL_ROLE_FAILURE;
  constructor(public payload: string) { }
}

//<------ COSTUMERS ----->
export class OpenModalCreateCostumer implements Action {
  readonly type: string = OPEN_MODAL_CREATE_COSTUMER;
}

export class GetAllCostumerRequest implements Action {
  readonly type: string = GET_ALL_COSTUMER_REQUEST;
}

export class GetAllCostumerSuccess implements Action {
  readonly type: string = GET_ALL_COSTUMER_SUCCESS;
  constructor(public payload: Array<Costumer>) { }
}

export class GetAllCostumerFailure implements Action {
  readonly type: string = GET_ALL_COSTUMER_FAILURE;
  constructor(public payload: string) { }
}
//<----- CREATE ---->
export class CreateCostumerRequest implements Action {
  readonly type: string = CREATE_COSTUMER_REQUEST;
  constructor(public payload: Costumer) { }
}

export class CreateCostumerSuccess implements Action {
  readonly type: string = CREATE_COSTUMER_SUCCESS;
  constructor(public payload: any) { }
}
export class EditRoleRequest implements Action {
  readonly type: string = EDIT_ROLE_REQUEST;
  constructor(public payload: Role) { }
}

export class EditRoleSuccess implements Action {
  readonly type: string = EDIT_ROLE_SUCCESS;
  readonly string = OPEN_MODAL_CREATE_ROLE;
  constructor(public payload: any) { }
}

export class EditRoleFailure implements Action {
  readonly type: string = EDIT_ROLE_FAILURE;
  constructor(public payload: string) { }
}

export class CreateAssociatedPermissionRequest implements Action {
  readonly type: string = CREATE_ASSOCIATEDPERMISSION_REQUEST;
  constructor(public payload: AssociatedPermission) { }
}

export class CreateAssociatedPermissionSuccess implements Action {
  readonly type: string = CREATE_ASSOCIATEDPERMISSION_SUCCESS;
  constructor(public payload: any) { }
}

export class CreateAssociatedPermissionFailure implements Action {
  readonly type: string = CREATE_ASSOCIATEDPERMISSION_FAILURE;
  constructor(public payload: string) { }
}

export class DeleteAssociatedPermissionRequest implements Action {
  readonly type: string = DELETE_ASSOCIATEDPERMISSION_REQUEST;
  constructor(public payload: AssociatedPermission) { }
}

export class DeleteAssociatedPermissionSuccess implements Action {
  readonly type: string = DELETE_ASSOCIATEDPERMISSION_SUCCESS;
  constructor(public payload: any) { }
}

export class DeleteAssociatedPermissionFailure implements Action {
  readonly type: string = DELETE_ASSOCIATEDPERMISSION_FAILURE;
  constructor(public payload: string) { }
}



export class CreateCostumerFailure implements Action {
  readonly type: string = CREATE_COSTUMER_FAILURE;
  constructor(public payload: string) { }
}
//<------ EMPLOYEES ----->
export class OpenModalCreateEmployee implements Action {
  readonly type: string = OPEN_MODAL_CREATE_EMPLOYEE;
}

export class GetAllEmployeeRequest implements Action {
  readonly type: string = GET_ALL_EMPLOYEE_REQUEST;
}

export class GetAllEmployeeSuccess implements Action {
  readonly type: string = GET_ALL_EMPLOYEE_SUCCESS;
  constructor(public payload: Array<Employee>) { }
}

export class GetAllEmployeeFailure implements Action {
  readonly type: string = GET_ALL_EMPLOYEE_FAILURE;
  constructor(public payload: string) { }
}
//<----- CREATE ---->
export class CreateEmployeeRequest implements Action {
  readonly type: string = CREATE_EMPLOYEE_REQUEST;
  constructor(public payload: Employee) { }
}

export class CreateEmployeeSuccess implements Action {
  readonly type: string = CREATE_EMPLOYEE_SUCCESS;
  constructor(public payload: any) { }
}

export class CreateEmployeeFailure implements Action {
  readonly type: string = CREATE_EMPLOYEE_FAILURE;
  constructor(public payload: string) { }
}

// USERS------------------------------------------------------------------------------------------------

export class OpenModalUser implements Action {
  readonly type: string = OPEN_MODAL_USER;
  constructor(public payload?: User) { }
}


//<--Create User-->

export class CreateUserRequest implements Action {
  readonly type: string = usersActions.CREATE_USER_REQUEST;
  constructor(public payload: User) { }
}

export class CreateUserSuccess implements Action {
  readonly type: string = usersActions.CREATE_USER_SUCCESS;
  constructor(public payload: any) { }
}

export class CreateUserFailure implements Action {
  readonly type: string = usersActions.CREATE_USER_FAILURE;
  constructor(public payload: string) { }
}

// <--Get Users-->

export class GetUsersRequest implements Action {
  readonly type: string = usersActions.GET_USERS_REQUEST;
}

export class GetUsersSuccess implements Action {
  readonly type: string = usersActions.GET_USERS_SUCCESS;
  constructor(public payload: Array<User>) { }
}

export class GetUsersFailure implements Action {
  readonly type: string = usersActions.GET_USERS_FAILURE;
  constructor(public payload: string) { }
}

// <--Update Users-->

export class UpdateUserRequest implements Action {
  readonly type: string = usersActions.UPDATE_USER_REQUEST;
  constructor(public payload: User) { }
}

export class UpdateUserSuccess implements Action {
  readonly type: string = usersActions.UPDATE_USER_SUCCESS;
  readonly string = OPEN_MODAL_USER;
  constructor(public payload: any) { }
}

export class UpdateUserFailure implements Action {
  readonly type: string = usersActions.UPDATE_USER_FAILURE;;
  constructor(public payload: string) { }
}



export type UiAction =
  | ToggleSidebarMenu
  | ToggleControlSidebar
  | ToggleDarkMode
  | GetAllPackagesSuccess
  | GetAllPackagesFailure
  | CreatePackageRequest
  | CreatePackageSuccess
  | CreatePackageFailure
  | GetAllOrdersSuccess
  | GetAllOrdersFailure
  | CreateOrderRequest
  | CreateOrderSuccess
  | CreateOrderFailure
  | GetAllPermissionsSuccess
  | GetAllPermissionsFailure
  | CreateRoleRequest
  | CreateRoleSuccess
  | CreateRoleFailure
  | GetAllRoleSuccess
  | GetAllRoleFailure
  | GetAllCostumerSuccess
  | GetAllCostumerFailure
  | CreateCostumerRequest
  | CreateCostumerSuccess
  | CreateCostumerFailure
  | GetAllEmployeeSuccess
  | GetAllEmployeeFailure
  | CreateEmployeeRequest
  | CreateEmployeeSuccess
  | CreateEmployeeFailure
  | EditRoleRequest
  | EditRoleSuccess
  | EditRoleFailure
  | CreateAssociatedPermissionRequest
  | CreateAssociatedPermissionSuccess
  | CreateAssociatedPermissionFailure
  | DeleteAssociatedPermissionRequest
  | DeleteAssociatedPermissionSuccess
  | DeleteAssociatedPermissionFailure
  | CreateUserRequest
  | CreateUserSuccess
  | CreateUserFailure
  | UpdateUserRequest
  | UpdateUserSuccess
  | UpdateUserFailure
  | GetUsersSuccess
  | GetUsersFailure;
