import { Action } from '@ngrx/store';
import { Package } from '@/models/package';
import { Order } from '@/models/order';
import { Role } from '@/models/role';
import { Permission } from '@/models/permission';
import { AssociatedPermission } from '@/models/associated-permission';
import { Costumer } from '@/models/costumer';
import { Employee } from '@/models/employee';
import { User } from '@/models/user';
import { Payment } from '@/models/payment';
import { OrderDetail } from '@/models/orderDetail';

//<--- TOGGLE ACTIONS --->
export enum toggleActions {
  TOGGLE_SIDEBAR_MENU = 'TOGGLE_SIDEBAR_MENU',
  TOGGLE_CONTROL_SIDEBAR = 'TOGGLE_CONTROL_SIDEBAR',
  TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE'
}

export class ToggleSidebarMenu implements Action {
  readonly type: string = toggleActions.TOGGLE_SIDEBAR_MENU;
  constructor(public payload?: string) { }
}
export class ToggleControlSidebar implements Action {
  readonly type: string = toggleActions.TOGGLE_CONTROL_SIDEBAR;
  constructor(public payload?: string) { }
}
export class ToggleDarkMode implements Action {
  readonly type: string = toggleActions.TOGGLE_DARK_MODE;
  constructor(public payload?: string) { }
}
//<--------------------->

//<--- PACKAGE ACTIONS --->
export enum packageActions {
  GET_ALL_PACKAGES_REQUEST = '[PACKAGE] GET_ALL_PACKAGES_REQUEST',
  GET_ALL_PACKAGES_SUCCESS = '[PACKAGE] GET_ALL_PACKAGES_SUCCESS',
  GET_ALL_PACKAGES_FAILURE = '[PACKAGE] GET_ALL_PACKAGES_FAILURE',

  OPEN_MODAL_CREATE_PACKAGE = '[PACKAGE] OPEN_MODAL_CREATE_PACKAGE',
  CREATE_PACKAGE_REQUEST = '[PACKAGE] CREATE_PACKAGE_REQUEST',
  CREATE_PACKAGE_SUCCESS = '[PACKAGE] CREATE_PACKAGE_SUCCESS',
  CREATE_PACKAGE_FAILURE = '[PACKAGE] CREATE_PACKAGE_FAILURE',

  EDIT_PACKAGE_REQUEST = '[PACKAGE] EDIT_PACKAGE_REQUEST',
  EDIT_PACKAGE_SUCCESS = '[PACKAGE] EDIT_PACKAGE_SUCCESS',
  EDIT_PACKAGE_FAILURE = '[PACKAGE] EDIT_PACKAGE_FAILURE'
}

export class GetAllPackagesRequest implements Action {
  readonly type: string = packageActions.GET_ALL_PACKAGES_REQUEST;
}
export class GetAllPackagesSuccess implements Action {
  readonly type: string = packageActions.GET_ALL_PACKAGES_SUCCESS;
  constructor(public payload: Array<Package>) { }
}
export class GetAllPackagesFailure implements Action {
  readonly type: string = packageActions.GET_ALL_PACKAGES_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalCreatePackage implements Action {
  readonly type: string = packageActions.OPEN_MODAL_CREATE_PACKAGE;
  constructor(public payload?: Package) { }
}
export class CreatePackageRequest implements Action {
  readonly type: string = packageActions.CREATE_PACKAGE_REQUEST;
  constructor(public payload: Package) { }
}
export class CreatePackageSuccess implements Action {
  readonly type: string = packageActions.CREATE_PACKAGE_SUCCESS;
  constructor(public payload: Package) { }
}
export class CreatePackageFailure implements Action {
  readonly type: string = packageActions.CREATE_PACKAGE_FAILURE;
  constructor(public payload: string) { }
}

export class EditPackageRequest implements Action {
  readonly type: string = packageActions.EDIT_PACKAGE_REQUEST;
  constructor(public payload: Package) { }
}
export class EditPackageSuccess implements Action {
  readonly type: string = packageActions.EDIT_PACKAGE_SUCCESS;
  readonly string = packageActions.OPEN_MODAL_CREATE_PACKAGE;
  constructor(public payload: any) { }
}
export class EditPackageFailure implements Action {
  readonly type: string = packageActions.EDIT_PACKAGE_FAILURE;
  constructor(public payload: string) { }
}
//<--------------------->

//<--- ORDER ACTIONS --->
export enum orderActions {
  GET_ALL_ORDERS_REQUEST = '[ORDER] GET_ALL_ORDERS_REQUEST',
  GET_ALL_ORDERS_SUCCESS = '[ORDER] GET_ALL_ORDERS_SUCCESS',
  GET_ALL_ORDERS_FAILURE = '[ORDER] GET_ALL_ORDERS_FAILURE',

  OPEN_MODAL_CREATE_ORDER = '[ORDER] OPEN_MODAL_CREATE_ORDER',

  CREATE_ORDER_DATA = '[ORDER] CREATE_ORDER_DATA',
  CREATE_ORDER_REQUEST = '[ORDER] CREATE_ORDER_REQUEST',
  CREATE_ORDER_SUCCESS = '[ORDER] CREATE_ORDER_SUCCESS',
  CREATE_ORDER_FAILURE = '[ORDER] CREATE_ORDER_FAILURE',

  OPEN_MODAL_ORDERDETAILS = '[ORDERDETAIL] OPEN_MODAL_ORDERDETAILS',
  OPEN_MODAL_CREATE_ORDERDETAIL = '[ORDERDETAIL] OPEN_MODAL_CREATE_ORDERDETAIL',
  CREATE_ORDERDETAIL_REQUEST = '[ORDERDETAIL] CREATE_ORDERDETAIL_REQUEST',
  CREATE_ORDERDETAIL_SUCCESS = '[ORDERDETAIL] CREATE_ORDERDETAIL_SUCCESS',
  CREATE_ORDERDETAIL_FAILURE = '[ORDERDETAIL] CREATE_ORDERDETAIL_FAILURE',

  OPEN_MODAL_PAYMENTS = '[PAYMENTS] OPEN_MODAL_PAYMENTS',
  OPEN_MODAL_CREATE_PAYMENT = '[PAYMENT] OPEN_MODAL_CREATE_PAYMENT',
  CREATE_PAYMENT_REQUEST = '[PAYMENT] CREATE_PAYMENT_REQUEST',
  CREATE_PAYMENT_SUCCESS = '[PAYMENT] CREATE_PAYMENT_SUCCESS',
  CREATE_PAYMENT_FAILURE = '[PAYMENT] CREATE_PAYMENT_FAILURE',
}

export class GetAllOrdersRequest implements Action {
  readonly type: string = orderActions.GET_ALL_ORDERS_REQUEST;
}
export class GetAllOrdersSuccess implements Action {
  readonly type: string = orderActions.GET_ALL_ORDERS_SUCCESS;
  constructor(public payload: Array<Order>) { }
}
export class GetAllOrdersFailure implements Action {
  readonly type: string = orderActions.GET_ALL_ORDERS_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalCreateOrder implements Action {
  readonly type: string = orderActions.OPEN_MODAL_CREATE_ORDER;
}
export class CreateOrderData implements Action {
  readonly type: string = orderActions.CREATE_ORDER_DATA;
  constructor(public payload: Array<any>) { }
}
export class CreateOrderRequest implements Action {
  readonly type: string = orderActions.CREATE_ORDER_REQUEST;
  constructor(public payload: Order) { }
}
export class CreateOrderSuccess implements Action {
  readonly type: string = orderActions.CREATE_ORDER_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateOrderFailure implements Action {
  readonly type: string = orderActions.CREATE_ORDER_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalOrderDetails implements Action {
  readonly type: string = orderActions.OPEN_MODAL_ORDERDETAILS;
  constructor(public payload: Order) { }
}
export class OpenModalCreateOrderDetail implements Action {
  readonly type: string = orderActions.OPEN_MODAL_CREATE_ORDERDETAIL;
  constructor(public payload?: Order) { }
}
export class CreateOrderDetailRequest implements Action {
  readonly type: string = orderActions.CREATE_ORDERDETAIL_REQUEST;
  constructor(public payload: OrderDetail) { }
}
export class CreateOrderDetailSuccess implements Action {
  readonly type: string = orderActions.CREATE_ORDERDETAIL_SUCCESS;
  readonly string = orderActions.OPEN_MODAL_CREATE_ORDERDETAIL;
  constructor(public payload: any) { }
}
export class CreateOrderDetailFailure implements Action {
  readonly type: string = orderActions.CREATE_PAYMENT_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalPayments implements Action {
  readonly type: string = orderActions.OPEN_MODAL_PAYMENTS;
  constructor(public payload: Order) { }
}
export class OpenModalCreatePayment implements Action {
  readonly type: string = orderActions.OPEN_MODAL_CREATE_PAYMENT;
  constructor(public payload?: Order) { }
}
export class CreatePaymentRequest implements Action {
  readonly type: string = orderActions.CREATE_PAYMENT_REQUEST;
  constructor(public payload: Payment) { }
}
export class CreatePaymentSuccess implements Action {
  readonly type: string = orderActions.CREATE_PAYMENT_SUCCESS;
  readonly string = orderActions.OPEN_MODAL_CREATE_PAYMENT;
  constructor(public payload: any) { }
}
export class CreatePaymentFailure implements Action {
  readonly type: string = orderActions.CREATE_PAYMENT_FAILURE;
  constructor(public payload: string) { }
}
//<--------------------->

//<--- ROLE ACTIONS --->
export enum roleActions {
  GET_ALL_ROLE_REQUEST = '[ROLES] GET_ALL_ROLE_REQUEST',
  GET_ALL_ROLE_SUCCESS = '[ROLES] GET_ALL_ROLE_SUCCESS',
  GET_ALL_ROLE_FAILURE = '[ROLES] GET_ALL_ROLE_FAILURE',

  OPEN_MODAL_CREATE_ROLE = '[ROLES] OPEN_MODAL_CREATE_ROLE',
  CREATE_ROLE_REQUEST = '[ROLES] CREATE_ROLE_REQUEST',
  CREATE_ROLE_SUCCESS = '[ROLES] CREATE_ROLE_SUCCESS',
  CREATE_ROLE_FAILURE = '[ROLES] CREATE_ROLE_FAILURE',

  EDIT_ROLE_REQUEST = '[ROLES] EDIT_ROLE_REQUEST',
  EDIT_ROLE_SUCCESS = '[ROLES] EDIT_ROLE_SUCCESS',
  EDIT_ROLE_FAILURE = '[ROLES] EDIT_ROLE_FAILURE',

  DELETE_ROLE_REQUEST = '[ROLES] DELETE_ROLE_REQUEST',
  DELETE_ROLE_SUCCESS = '[ROLES] DELETE_ROLE_SUCCESS',
  DELETE_ROLE_FAILURE = '[ROLES] DELETE_ROLE_FAILURE',
}

export class GetAllRoleRequest implements Action {
  readonly type: string = roleActions.GET_ALL_ROLE_REQUEST;
}
export class GetAllRoleSuccess implements Action {
  readonly type: string = roleActions.GET_ALL_ROLE_SUCCESS;
  constructor(public payload: Array<Role>) { }
}
export class GetAllRoleFailure implements Action {
  readonly type: string = roleActions.GET_ALL_ROLE_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalCreateRole implements Action {
  readonly type: string = roleActions.OPEN_MODAL_CREATE_ROLE;
  constructor(public payload?: Role) { }
}
export class CreateRoleRequest implements Action {
  readonly type: string = roleActions.CREATE_ROLE_REQUEST;
  constructor(public payload: Role) { }
}
export class CreateRoleSuccess implements Action {
  readonly type: string = roleActions.CREATE_ROLE_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateRoleFailure implements Action {
  readonly type: string = roleActions.CREATE_ROLE_FAILURE;
  constructor(public payload: string) { }
}

export class EditRoleRequest implements Action {
  readonly type: string = roleActions.EDIT_ROLE_REQUEST;
  constructor(public payload: Role) { }
}
export class EditRoleSuccess implements Action {
  readonly type: string = roleActions.EDIT_ROLE_SUCCESS;
  readonly string = roleActions.OPEN_MODAL_CREATE_ROLE;
  constructor(public payload: any) { }
}
export class EditRoleFailure implements Action {
  readonly type: string = roleActions.EDIT_ROLE_FAILURE;
  constructor(public payload: string) { }
}

export class DeleteRoleRequest implements Action {
  readonly type: string = roleActions.DELETE_ROLE_REQUEST;
  constructor(public payload: Role) { }
}
export class DeleteRoleSuccess implements Action {
  readonly type: string = roleActions.DELETE_ROLE_SUCCESS;
  constructor(public payload: any) { }
}
export class DeleteRoleFailure implements Action {
  readonly type: string = roleActions.DELETE_ROLE_FAILURE;
  constructor(public payload: string) { }
}
//<--------------------->

//<--- PERMISSION ACTIONS --->
export enum permissionActions {
  GET_ALL_PERMISSIONS_REQUEST = '[PERMISSIONS] GET_ALL_PERMISSIONS_REQUEST',
  GET_ALL_PERMISSIONS_SUCCESS = '[PERMISSIONS] GET_ALL_PERMISSIONS_SUCCESS',
  GET_ALL_PERMISSIONS_FAILURE = '[PERMISSIONS] GET_ALL_PERMISSIONS_FAILURE',

  CREATE_ASSOCIATEDPERMISSION_REQUEST = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_REQUEST',
  CREATE_ASSOCIATEDPERMISSION_SUCCESS = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_SUCCESS',
  CREATE_ASSOCIATEDPERMISSION_FAILURE = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_FAILURE',

  DELETE_ASSOCIATEDPERMISSION_REQUEST = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_REQUEST',
  DELETE_ASSOCIATEDPERMISSION_SUCCESS = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_SUCCESS',
  DELETE_ASSOCIATEDPERMISSION_FAILURE = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_FAILURE'
}

export class GetAllPermissionsRequest implements Action {
  readonly type: string = permissionActions.GET_ALL_PERMISSIONS_REQUEST;
}
export class GetAllPermissionsSuccess implements Action {
  readonly type: string = permissionActions.GET_ALL_PERMISSIONS_SUCCESS;
  constructor(public payload: Array<Permission>) { }
}
export class GetAllPermissionsFailure implements Action {
  readonly type: string = permissionActions.GET_ALL_PERMISSIONS_FAILURE;
  constructor(public payload: string) { }
}

export class CreateAssociatedPermissionRequest implements Action {
  readonly type: string = permissionActions.CREATE_ASSOCIATEDPERMISSION_REQUEST;
  constructor(public payload: AssociatedPermission) { }
}
export class CreateAssociatedPermissionSuccess implements Action {
  readonly type: string = permissionActions.CREATE_ASSOCIATEDPERMISSION_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateAssociatedPermissionFailure implements Action {
  readonly type: string = permissionActions.CREATE_ASSOCIATEDPERMISSION_FAILURE;
  constructor(public payload: string) { }
}

export class DeleteAssociatedPermissionRequest implements Action {
  readonly type: string = permissionActions.DELETE_ASSOCIATEDPERMISSION_REQUEST;
  constructor(public payload: AssociatedPermission) { }
}
export class DeleteAssociatedPermissionSuccess implements Action {
  readonly type: string = permissionActions.DELETE_ASSOCIATEDPERMISSION_SUCCESS;
  constructor(public payload: any) { }
}
export class DeleteAssociatedPermissionFailure implements Action {
  readonly type: string = permissionActions.DELETE_ASSOCIATEDPERMISSION_FAILURE;
  constructor(public payload: string) { }
}
//<--------------------->

//<--- COSTUMER ACTIONS --->
export enum costumerActions {
  GET_ALL_COSTUMER_REQUEST = '[COSTUMERS] GET_ALL_COSTUMER__REQUEST',
  GET_ALL_COSTUMER_SUCCESS = '[COSTUMERS] GET_ALL_COSTUMER__SUCCESS',
  GET_ALL_COSTUMER_FAILURE = '[COSTUMERS] GET_ALL_COSTUMER__FAILURE',

  OPEN_MODAL_CREATE_COSTUMER = '[COSTUMERS] OPEN_MODAL_CREATE_COSTUMER',
  CREATE_COSTUMER_REQUEST = '[COSTUMERS] CREATE_COSTUMER_REQUEST',
  CREATE_COSTUMER_SUCCESS = '[COSTUMERS] CREATE_COSTUMER_SUCCESS',
  CREATE_COSTUMER_FAILURE = '[COSTUMERS] CREATE_COSTUMER_FAILURE',

  EDIT_COSTUMER_REQUEST = '[COSTUMERS] EDIT_COSTUMER_REQUEST',
  EDIT_COSTUMER_SUCCESS = '[COSTUMERS] EDIT_COSTUMER_SUCCESS',
  EDIT_COSTUMER_FAILURE = '[COSTUMERS] EDIT_COSTUMER_FAILURE',

}

export class GetAllCostumerRequest implements Action {
  readonly type: string = costumerActions.GET_ALL_COSTUMER_REQUEST;
}
export class GetAllCostumerSuccess implements Action {
  readonly type: string = costumerActions.GET_ALL_COSTUMER_SUCCESS;
  constructor(public payload: Array<Costumer>) { }
}
export class GetAllCostumerFailure implements Action {
  readonly type: string = costumerActions.GET_ALL_COSTUMER_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalCreateCostumer implements Action {
  readonly type: string = costumerActions.OPEN_MODAL_CREATE_COSTUMER;
  constructor(public payload?: Costumer) { }
}
export class CreateCostumerRequest implements Action {
  readonly type: string = costumerActions.CREATE_COSTUMER_REQUEST;
  constructor(public payload: Costumer) { }
}
export class CreateCostumerSuccess implements Action {
  readonly type: string = costumerActions.CREATE_COSTUMER_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateCostumerFailure implements Action {
  readonly type: string = costumerActions.CREATE_COSTUMER_FAILURE;
  constructor(public payload: string) { }
}

export class EditCostumerRequest implements Action {
  readonly type: string = costumerActions.EDIT_COSTUMER_REQUEST;
  constructor(public payload: Costumer) { }
}
export class EditCostumerSuccess implements Action {
  readonly type: string = costumerActions.EDIT_COSTUMER_SUCCESS;
  readonly string = costumerActions.OPEN_MODAL_CREATE_COSTUMER;
  constructor(public payload: any) { }
}
export class EditCostumerFailure implements Action {
  readonly type: string = costumerActions.EDIT_COSTUMER_FAILURE;
  constructor(public payload: string) { }
}

//<--------------------->

//<--- EMPLOYEE ACTIONS --->
export enum employeeActions {
  GET_ALL_EMPLOYEE_REQUEST = '[EMPLOYEES] GET_ALL_EMPLOYEE__REQUEST',
  GET_ALL_EMPLOYEE_SUCCESS = '[EMPLOYEES] GET_ALL_EMPLOYEE__SUCCESS',
  GET_ALL_EMPLOYEE_FAILURE = '[EMPLOYEES] GET_ALL_EMPLOYEE__FAILURE',

  OPEN_MODAL_CREATE_EMPLOYEE = '[EMPLOYEES] OPEN_MODAL_CREATE_EMPLOYEE',
  CREATE_EMPLOYEE_REQUEST = '[EMPLOYEES] CREATE_EMPLOYEE_REQUEST',
  CREATE_EMPLOYEE_SUCCESS = '[EMPLOYEES] CREATE_EMPLOYEE_SUCCESS',
  CREATE_EMPLOYEE_FAILURE = '[EMPLOYEES] CREATE_EMPLOYEE_FAILURE',

  EDIT_EMPLOYEE_REQUEST = '[EMPLOYEES] EDIT_EMPLOYEE_REQUEST',
  EDIT_EMPLOYEE_SUCCESS = '[EMPLOYEES] EDIT_EMPLOYEE_SUCCESS',
  EDIT_EMPLOYEE_FAILURE = '[EMPLOYEES] EDIT_EMPLOYEE_FAILURE',

  DELETE_EMPLOYEE_REQUEST = '[EMPLOYEES] DELETE_EMPLOYEE_REQUEST',
  DELETE_EMPLOYEE_SUCCESS = '[EMPLOYEES] DELETE_EMPLOYEE_SUCCESS',
  DELETE_EMPLOYEE_FAILURE = '[EMPLOYEES] DELETE_EMPLOYEE_FAILURE',
}

export class GetAllEmployeeRequest implements Action {
  readonly type: string = employeeActions.GET_ALL_EMPLOYEE_REQUEST;
}
export class GetAllEmployeeSuccess implements Action {
  readonly type: string = employeeActions.GET_ALL_EMPLOYEE_SUCCESS;
  constructor(public payload: Array<Employee>) { }
}
export class GetAllEmployeeFailure implements Action {
  readonly type: string = employeeActions.GET_ALL_EMPLOYEE_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalCreateEmployee implements Action {
  readonly type: string = employeeActions.OPEN_MODAL_CREATE_EMPLOYEE;
  constructor(public payload?: Employee) { }
}
export class CreateEmployeeRequest implements Action {
  readonly type: string = employeeActions.CREATE_EMPLOYEE_REQUEST;
  constructor(public payload: Employee) { }
}
export class CreateEmployeeSuccess implements Action {
  readonly type: string = employeeActions.CREATE_EMPLOYEE_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateEmployeeFailure implements Action {
  readonly type: string = employeeActions.CREATE_EMPLOYEE_FAILURE;
  constructor(public payload: string) { }
}

export class EditEmployeeRequest implements Action {
  readonly type: string = employeeActions.EDIT_EMPLOYEE_REQUEST;
  constructor(public payload: Employee) { }
}
export class EditEmployeeSuccess implements Action {
  readonly type: string = employeeActions.EDIT_EMPLOYEE_SUCCESS;
  readonly string = employeeActions.OPEN_MODAL_CREATE_EMPLOYEE;
  constructor(public payload: any) { }
}
export class EditEmployeeFailure implements Action {
  readonly type: string = employeeActions.EDIT_EMPLOYEE_FAILURE;
  constructor(public payload: string) { }
}

export class DeleteEmployeeRequest implements Action {
  readonly type: string = employeeActions.DELETE_EMPLOYEE_REQUEST;
  constructor(public payload: Employee) { }
}
export class DeleteEmployeeSuccess implements Action {
  readonly type: string = employeeActions.DELETE_EMPLOYEE_SUCCESS;
  constructor(public payload: any) { }
}
export class DeleteEmployeeFailure implements Action {
  readonly type: string = employeeActions.DELETE_EMPLOYEE_FAILURE;
  constructor(public payload: string) { }
}
//<--------------------->

//<--- USER ACTIONS --->
export enum userActions {
  GET_USERS_REQUEST = '[USERS] GET_USERS_REQUEST',
  GET_USERS_SUCCESS = '[USERS] GET_USERS_SUCCESS',
  GET_USERS_FAILURE = '[USERS] GET_USERS_FAILURE',

  OPEN_MODAL_USER = '[USERS] OPEN_MODAL_USER',
  CREATE_USER_REQUEST = '[USERS] CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS = '[USERS] CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE = '[USERS] CREATE_USER_FAILURE',

  UPDATE_USER_REQUEST = '[USERS] UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS = '[USERS] UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE = '[USERS] UPDATE_USER_FAILURE',
}

export class GetUsersRequest implements Action {
  readonly type: string = userActions.GET_USERS_REQUEST;
}
export class GetUsersSuccess implements Action {
  readonly type: string = userActions.GET_USERS_SUCCESS;
  constructor(public payload: Array<User>) { }
}
export class GetUsersFailure implements Action {
  readonly type: string = userActions.GET_USERS_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalUser implements Action {
  readonly type: string = userActions.OPEN_MODAL_USER;
  constructor(public payload?: User) { }
}
export class CreateUserRequest implements Action {
  readonly type: string = userActions.CREATE_USER_REQUEST;
  constructor(public payload: User) { }
}
export class CreateUserSuccess implements Action {
  readonly type: string = userActions.CREATE_USER_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateUserFailure implements Action {
  readonly type: string = userActions.CREATE_USER_FAILURE;
  constructor(public payload: string) { }
}

export class UpdateUserRequest implements Action {
  readonly type: string = userActions.UPDATE_USER_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUserSuccess implements Action {
  readonly type: string = userActions.UPDATE_USER_SUCCESS;
  readonly string = userActions.OPEN_MODAL_USER;
  constructor(public payload: any) { }
}
export class UpdateUserFailure implements Action {
  readonly type: string = userActions.UPDATE_USER_FAILURE;;
  constructor(public payload: string) { }
}
//<--------------------->

export type UiAction =
  //<---TOGGLE--->
  | ToggleSidebarMenu
  | ToggleControlSidebar
  | ToggleDarkMode
  //<--------------------->
  //<---PACKAGES--->
  | GetAllPackagesSuccess
  | GetAllPackagesFailure
  | CreatePackageRequest
  | CreatePackageSuccess
  | CreatePackageFailure
  //<--------------------->
  //<---ORDERS--->
  | GetAllOrdersSuccess
  | GetAllOrdersFailure
  | CreateOrderRequest
  | CreateOrderSuccess
  | CreateOrderFailure
  | CreatePaymentRequest
  | CreatePaymentSuccess
  | CreatePaymentFailure
  //<--------------------->
  //<---ROLES--->
  | GetAllRoleSuccess
  | GetAllRoleFailure
  | CreateRoleRequest
  | CreateRoleSuccess
  | CreateRoleFailure
  | EditRoleRequest
  | EditRoleSuccess
  | EditRoleFailure
  | DeleteRoleRequest
  | DeleteRoleSuccess
  | DeleteRoleFailure
  //<--------------------->
  //<---PERMISSIONS--->
  | GetAllPermissionsSuccess
  | GetAllPermissionsFailure
  | CreateAssociatedPermissionRequest
  | CreateAssociatedPermissionSuccess
  | CreateAssociatedPermissionFailure
  | DeleteAssociatedPermissionRequest
  | DeleteAssociatedPermissionSuccess
  | DeleteAssociatedPermissionFailure
  //<--------------------->
  //<---COSTUMERS--->
  | GetAllCostumerSuccess
  | GetAllCostumerFailure
  | CreateCostumerRequest
  | CreateCostumerSuccess
  | CreateCostumerFailure
  | EditCostumerRequest
  | EditCostumerFailure
  | EditCostumerSuccess
  //<--------------------->
  //<---EMPLOYEES--->
  | GetAllEmployeeSuccess
  | GetAllEmployeeFailure
  | CreateEmployeeRequest
  | CreateEmployeeSuccess
  | CreateEmployeeFailure
  | EditCostumerRequest
  | EditCostumerSuccess
  | EditCostumerFailure
  | DeleteEmployeeRequest
  | DeleteEmployeeFailure
  | DeleteEmployeeSuccess
  //<--------------------->
  //<---USERS--->
  | GetUsersSuccess
  | GetUsersFailure
  | CreateUserRequest
  | CreateUserSuccess
  | CreateUserFailure
  | UpdateUserRequest
  | UpdateUserSuccess
  | UpdateUserFailure;
  //<--------------------->
