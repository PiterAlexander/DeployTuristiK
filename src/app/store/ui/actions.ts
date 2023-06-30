import { Action } from '@ngrx/store';
import { Package } from '@/models/package';
import { Order } from '@/models/order';
import { Role } from '@/models/role';
import { Permission } from '@/models/permission';
import { AssociatedPermission } from '@/models/associated-permission';
import { Costumer } from '@/models/costumer';
import { Employee } from '@/models/employee';
import { User } from '@/models/user';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { Payment } from '@/models/payment';
import { OrderDetail } from '@/models/orderDetail';
import { Token } from '@/models/token';

//<--- TOGGLE ACTIONS --->
export enum toggleActions {
  TOGGLE_SIDEBAR_MENU = 'TOGGLE_SIDEBAR_MENU',
  TOGGLE_CONTROL_SIDEBAR = 'TOGGLE_CONTROL_SIDEBAR',
  TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE'
}

export const OPEN_MODAL_CREATE_PACKAGE: string = '[PACKAGE] OPEN_MODAL_CREATE_PACKAGE';
export const OPEN_MODAL_DETAILS_PACKAGE: string = '[PACKAGE] OPEN_MODAL_DETAILS_PACKAGE'
export const GET_ALL_PACKAGES_REQUEST: string = '[PACKAGE] GET_ALL_PACKAGES_REQUEST';
export const GET_ALL_PACKAGES_SUCCESS: string = '[PACKAGE] GET_ALL_PACKAGES_SUCCESS';
export const GET_ALL_PACKAGES_FAILURE: string = '[PACKAGE] GET_ALL_PACKAGES_FAILURE';

export const GET_ONE_PACKAGES_REQUEST: string = '[PACKAGE] GET_ONE_PACKAGE_REQUEST'

export const CREATE_PACKAGE_REQUEST: string = '[PACKAGE] CREATE_PACKAGE_REQUEST';
export const CREATE_PACKAGE_SUCCESS: string = '[PACKAGE] CREATE_PACKAGE_SUCCESS';
export const CREATE_PACKAGE_FAILURE: string = '[PACKAGE] CREATE_PACKAGE_FAILURE';

export const CHANGE_STATUS_PACKAGE_REQUEST: string = '[PACKAGE] CHANGE_STATUS_PACKAGE_REQUEST';
export const CHANGE_STATUS_PACKAGE_SUCCESS: string = '[PACKAGE] CHANGE_STATUS_PACKAGE_SUCCESS';
export const CHANGE_STATUS_PACKAGE_FAILURE: string = '[PACKAGE] CHANGE_STATUS_PACKAGE_FAILURE';

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

export const EDIT_ROLE_REQUEST: string = '[ROLES] EDIT_ROLE_REQUEST';
export const EDIT_ROLE_SUCCESS: string = '[ROLES] EDIT_ROLE_SUCCESS';
export const EDIT_ROLE_FAILURE: string = '[ROLES] EDIT_ROLE_FAILURE';

export const CREATE_ASSOCIATEDPERMISSION_REQUEST: string = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_REQUEST';
export const CREATE_ASSOCIATEDPERMISSION_SUCCESS: string = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_SUCCESS';
export const CREATE_ASSOCIATEDPERMISSION_FAILURE: string = '[ASSOCIATEDPERMISSION] CREATE_ASSOCIATEDPERMISSION_FAILURE';

export const DELETE_ASSOCIATEDPERMISSION_REQUEST: string = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_REQUEST';
export const DELETE_ASSOCIATEDPERMISSION_SUCCESS: string = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_SUCCESS';
export const DELETE_ASSOCIATEDPERMISSION_FAILURE: string = '[ASSOCIATEDPERMISSION] DELETE_ASSOCIATEDPERMISSION_FAILURE';
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

export class OpenModalDetailsPackage implements Action {
  readonly type: string = OPEN_MODAL_DETAILS_PACKAGE;
  constructor(public payload?: Package) { }
}

// PACKAGES LIST -------------------------------------------------------------

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
// END PACKAGES LIST -------------------------------------------------------------

export class GetOnePackageRequest implements Action {
  readonly type: string = GET_ONE_PACKAGES_REQUEST;
}

// PACKAGES CREATE--------------------------------------------------------

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

// END PACKAGES EDIT--------------------------------------------------------


// PACKAGES DISABLE ACTIONS ------------------------------------------------
export class EditStatusPackageRequest implements Action {
  readonly type: string = EDIT_PACKAGE_REQUEST;
  constructor(public payload: Package) { }
}

export class EditStatusPackageSuccess implements Action {
  readonly type: string = EDIT_PACKAGE_SUCCESS;
  readonly string = OPEN_MODAL_CREATE_PACKAGE;
  constructor(public payload: any) { }
}

export class EditStatusPackageFailure implements Action {
  readonly type: string = EDIT_PACKAGE_FAILURE;
  constructor(public payload: string) { }
}

// PACKAGES DISABLE ACTIONS END -----------------------------------------
//<--------------------->

//<--- ORDER ACTIONS --->
export enum orderActions {
  GET_ALL_ORDERS_REQUEST = '[ORDER] GET_ALL_ORDERS_REQUEST',
  GET_ALL_ORDERS_SUCCESS = '[ORDER] GET_ALL_ORDERS_SUCCESS',
  GET_ALL_ORDERS_FAILURE = '[ORDER] GET_ALL_ORDERS_FAILURE',

  OPEN_MODAL_CREATE_ORDER = '[ORDER] OPEN_MODAL_CREATE_ORDER',
  CREATE_ORDER_REQUEST = '[ORDER] CREATE_ORDER_REQUEST',
  CREATE_ORDER_SUCCESS = '[ORDER] CREATE_ORDER_SUCCESS',
  CREATE_ORDER_FAILURE = '[ORDER] CREATE_ORDER_FAILURE',

  OPEN_MODAL_LIST_FREQUENTTRAVELERS_TO_ORDERS = '[ORDER] OPEN_MODAL_LIST_FREQUENTTRAVELERS_TO_ORDERS',

  EDIT_ORDER_REQUEST = '[ORDER] EDIT_ORDER_REQUEST',
  EDIT_ORDER_SUCCESS = '[ORDER] EDIT_ORDER_SUCCESS',
  EDIT_ORDER_FAILURE = '[ORDER] EDIT_ORDER_FAILURE',

  OPEN_MODAL_ORDERDETAILS = '[ORDERDETAIL] OPEN_MODAL_ORDERDETAILS',

  OPEN_MODAL_CREATE_ORDERDETAIL = '[ORDERDETAIL] OPEN_MODAL_CREATE_ORDERDETAIL',
  CREATE_ORDERDETAIL_REQUEST = '[ORDERDETAIL] CREATE_ORDERDETAIL_REQUEST',
  CREATE_ORDERDETAIL_SUCCESS = '[ORDERDETAIL] CREATE_ORDERDETAIL_SUCCESS',
  CREATE_ORDERDETAIL_FAILURE = '[ORDERDETAIL] CREATE_ORDERDETAIL_FAILURE',

  EDIT_ORDERDETAIL_REQUEST = '[ORDERDETAIL] EDIT_ORDERDETAIL_REQUEST',
  EDIT_ORDERDETAIL_SUCCESS = '[ORDERDETAIL] EDIT_ORDERDETAIL_SUCCESS',
  EDIT_ORDERDETAIL_FAILURE = '[ORDERDETAIL] EDIT_ORDERDETAIL_FAILURE',

  OPEN_MODAL_PAYMENTS = '[PAYMENTS] OPEN_MODAL_PAYMENTS',

  OPEN_MODAL_CREATE_PAYMENT = '[PAYMENT] OPEN_MODAL_CREATE_PAYMENT',
  CREATE_PAYMENT_REQUEST = '[PAYMENT] CREATE_PAYMENT_REQUEST',
  CREATE_PAYMENT_SUCCESS = '[PAYMENT] CREATE_PAYMENT_SUCCESS',
  CREATE_PAYMENT_FAILURE = '[PAYMENT] CREATE_PAYMENT_FAILURE',

  OPEN_MODAL_EDIT_PAYMENT = '[PAYMENT] OPEN_MODAL_EDIT_PAYMENT',
  EDIT_PAYMENT_REQUEST = '[PAYMENT] EDIT_PAYMENT_REQUEST',
  EDIT_PAYMENT_SUCCESS = '[PAYMENT] EDIT_PAYMENT_SUCCESS',
  EDIT_PAYMENT_FAILURE = '[PAYMENT] EDIT_PAYMENT_FAILURE',
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
  constructor(public payload?: Array<any>) { }
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

export class OpenModalListFrequentTravelersToOrders implements Action {
  readonly type: string = orderActions.OPEN_MODAL_LIST_FREQUENTTRAVELERS_TO_ORDERS;
  constructor(public payload: Array<any>) { }
}

export class EditOrderRequest implements Action {
  readonly type: string = orderActions.EDIT_ORDER_REQUEST;
  constructor(public payload: Order) { }
}
export class EditOrderSuccess implements Action {
  readonly type: string = orderActions.EDIT_ORDER_SUCCESS;
  constructor(public payload: any) { }
}
export class EditOrderFailure implements Action {
  readonly type: string = orderActions.EDIT_ORDER_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalOrderDetails implements Action {
  readonly type: string = orderActions.OPEN_MODAL_ORDERDETAILS;
  constructor(public payload: Order) { }
}

export class OpenModalCreateOrderDetail implements Action {
  readonly type: string = orderActions.OPEN_MODAL_CREATE_ORDERDETAIL;
  constructor(public payload: any) { }
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
  readonly type: string = orderActions.CREATE_ORDERDETAIL_FAILURE;
  constructor(public payload: string) { }
}

export class EditOrderDetailRequest implements Action {
  readonly type: string = orderActions.EDIT_ORDERDETAIL_REQUEST;
  readonly string = orderActions.OPEN_MODAL_CREATE_ORDERDETAIL;
  constructor(public payload: OrderDetail) { }
}
export class EditOrderDetailSuccess implements Action {
  readonly type: string = orderActions.EDIT_ORDERDETAIL_SUCCESS;
  constructor(public payload: any) { }
}
export class EditOrderDetailFailure implements Action {
  readonly type: string = orderActions.EDIT_ORDERDETAIL_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalPayments implements Action {
  readonly type: string = orderActions.OPEN_MODAL_PAYMENTS;
  constructor(public payload: Order) { }
}

export class OpenModalCreatePayment implements Action {
  readonly type: string = orderActions.OPEN_MODAL_CREATE_PAYMENT;
  constructor(public payload?: any) { }
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

export class OpenModalEditPayment implements Action {
  readonly type: string = orderActions.OPEN_MODAL_EDIT_PAYMENT;
  constructor(public payload: Payment) { }
}
export class EditPaymentRequest implements Action {
  readonly type: string = orderActions.EDIT_PAYMENT_REQUEST;
  readonly string = orderActions.OPEN_MODAL_EDIT_PAYMENT;
  constructor(public payload: Payment) { }
}
export class EditPaymentSuccess implements Action {
  readonly type: string = orderActions.EDIT_PAYMENT_SUCCESS;
  constructor(public payload: any) { }
}
export class EditPaymentFailure implements Action {
  readonly type: string = orderActions.EDIT_PAYMENT_FAILURE;
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
//<--- FREQUENTTRAVELER ACTIONS --->
export enum FrequentTravelerActions {
  GET_ALL_FREQUENTTRAVELER_REQUEST = '[FREQUENTTRAVELERS] GET_ALL_FREQUENTTRAVELER__REQUEST',
  GET_ALL_FREQUENTTRAVELER_SUCCESS = '[FREQUENTTRAVELERS] GET_ALL_FREQUENTTRAVELER__SUCCESS',
  GET_ALL_FREQUENTTRAVELER_FAILURE = '[FREQUENTTRAVELERS] GET_ALL_FREQUENTTRAVELER__FAILURE',

  OPEN_MODAL_CREATE_FREQUENTTRAVELER = '[FREQUENTTRAVELERS] OPEN_MODAL_CREATE_FREQUENTTRAVELER',
  OPEN_MODAL_LIST_FREQUENTTRAVELER = '[FREQUENTTRAVELERS] OPEN_MODAL_LIST_FREQUENTTRAVELER',


  CREATE_FREQUENTTRAVELER_REQUEST = '[FREQUENTTRAVELERS] CREATE_FREQUENTTRAVELER_REQUEST',
  CREATE_FREQUENTTRAVELER_SUCCESS = '[FREQUENTTRAVELERS] CREATE_FREQUENTTRAVELER_SUCCESS',
  CREATE_FREQUENTTRAVELER_FAILURE = '[FREQUENTTRAVELERS] CREATE_FREQUENTTRAVELER_FAILURE',

  EDIT_FREQUENTTRAVELER_REQUEST = '[FREQUENTTRAVELERS] EDIT_FREQUENTTRAVELER_REQUEST',
  EDIT_FREQUENTTRAVELER_SUCCESS = '[FREQUENTTRAVELERS] EDIT_FREQUENTTRAVELER_SUCCESS',
  EDIT_FREQUENTTRAVELER_FAILURE = '[FREQUENTTRAVELERS] EDIT_FREQUENTTRAVELER_FAILURE',

  DELETE_FREQUENTTRAVELER_REQUEST = '[FREQUENTTRAVELERS] DELETE_FREQUENTTRAVELER_REQUEST',
  DELETE_FREQUENTTRAVELER_SUCCESS = '[FREQUENTTRAVELERS] DELETE_FREQUENTTRAVELER_SUCCESS',
  DELETE_FREQUENTTRAVELER_FAILURE = '[FREQUENTTRAVELERS] DELETE_FREQUENTTRAVELER_FAILURE',
}

export class GetAllFrequentTravelerRequest implements Action {
  readonly type: string = FrequentTravelerActions.GET_ALL_FREQUENTTRAVELER_REQUEST;
}
export class GetAllFrequentTravelerSuccess implements Action {
  readonly type: string = FrequentTravelerActions.GET_ALL_FREQUENTTRAVELER_SUCCESS;
  constructor(public payload: Array<FrequentTraveler>) { }
}
export class GetAllFrequentTravelerFailure implements Action {
  readonly type: string = FrequentTravelerActions.GET_ALL_FREQUENTTRAVELER_FAILURE;
  constructor(public payload: string) { }
}

export class OpenModalCreateFrequentTraveler implements Action {
  readonly type: string = FrequentTravelerActions.OPEN_MODAL_CREATE_FREQUENTTRAVELER;
  constructor(public payload: Costumer) { }
}
export class OpenModalListFrequentTraveler implements Action {
  readonly type: string = FrequentTravelerActions.OPEN_MODAL_LIST_FREQUENTTRAVELER;
  constructor(public payload: Costumer) { }
}
export class CreateFrequentTravelerRequest implements Action {
  readonly type: string = FrequentTravelerActions.CREATE_FREQUENTTRAVELER_REQUEST;
  constructor(public payload: FrequentTraveler) { }
}
export class CreateFrequentTravelerSuccess implements Action {
  readonly type: string = FrequentTravelerActions.CREATE_FREQUENTTRAVELER_SUCCESS;
  constructor(public payload: any) { }
}
export class CreateFrequentTravelerFailure implements Action {
  readonly type: string = FrequentTravelerActions.CREATE_FREQUENTTRAVELER_FAILURE;
  constructor(public payload: string) { }
}

export class EditFrequentTravelerRequest implements Action {
  readonly type: string = FrequentTravelerActions.EDIT_FREQUENTTRAVELER_REQUEST;
  constructor(public payload: FrequentTraveler) { }
}
export class EditFrequentTravelerSuccess implements Action {
  readonly type: string = FrequentTravelerActions.EDIT_FREQUENTTRAVELER_SUCCESS;
  readonly string = FrequentTravelerActions.OPEN_MODAL_CREATE_FREQUENTTRAVELER;
  constructor(public payload: any) { }
}
export class EditFrequentTravelerFailure implements Action {
  readonly type: string = FrequentTravelerActions.EDIT_FREQUENTTRAVELER_FAILURE;
  constructor(public payload: string) { }
}

export class DeleteFrequentTravelerRequest implements Action {
  readonly type: string = FrequentTravelerActions.DELETE_FREQUENTTRAVELER_REQUEST;
  constructor(public payload: FrequentTraveler) { }
}
export class DeleteFrequentTravelerSuccess implements Action {
  readonly type: string = FrequentTravelerActions.DELETE_FREQUENTTRAVELER_SUCCESS;
  constructor(public payload: any) { }
}
export class DeleteFrequentTravelerFailure implements Action {
  readonly type: string = FrequentTravelerActions.DELETE_FREQUENTTRAVELER_FAILURE;
  constructor(public payload: string) { }
}

//<--- LOGIN ACTIONS --->
export enum loginActions {
  LOGIN_REQUEST = '[lOGIN] LOGIN_REQUEST',
  LOGIN_SUCCESS = '[lOGIN] LOGIN_SUCCESS',
  LOGIN_FAILURE = '[lOGIN] LOGIN_FAILURE',

  GET_USER_INFO_REQUEST = '[LOGIN] GET_USER_INFO_REQUEST',
  GET_USER_INFO_SUCCESS = '[LOGIN] GET_USER_INFO_SUCCESS',
  GET_USER_INFO_FAILURE = '[LOGIN] GET_USER_INFO_FAILURE'
}

export class LoginRequest implements Action {
  readonly type: string = loginActions.LOGIN_REQUEST;
  constructor(public payload: any) { }
}
export class LoginSuccess implements Action {
  readonly type: string = loginActions.LOGIN_SUCCESS;
  constructor(public payload: Token) {
    //console.log("desde const", payload)
  }
}
export class LoginFailure implements Action {
  readonly type: string = loginActions.LOGIN_FAILURE;
  constructor(public payload: string) { }
}

export class GetUserInfoRequest implements Action {
  readonly type: string = loginActions.GET_USER_INFO_REQUEST;
  constructor(public payload: any) { }
}
export class GetUserInfoSuccess implements Action {
  readonly type: string = loginActions.GET_USER_INFO_SUCCESS;
  constructor(public payload: any) { }
}
export class GetUserInfoFailure implements Action {
  readonly type: string = loginActions.GET_USER_INFO_FAILURE;
  constructor(public payload: string) { }

}

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
  | EditOrderRequest
  | EditOrderSuccess
  | EditOrderFailure
  | EditOrderDetailRequest
  | EditOrderDetailSuccess
  | EditOrderDetailFailure
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
  //<---FREQUENT TRAVELER--->
  | GetAllCostumerFailure
  | GetAllCostumerSuccess
  | CreateFrequentTravelerRequest
  | CreateFrequentTravelerSuccess
  | CreateFrequentTravelerFailure
  | EditFrequentTravelerRequest
  | EditFrequentTravelerSuccess
  | EditFrequentTravelerFailure
  | DeleteFrequentTravelerRequest
  | DeleteFrequentTravelerFailure
  | DeleteFrequentTravelerSuccess
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
  | UpdateUserFailure
  //<--------------------->
  //<---LOGIN--->
  | LoginRequest
  | LoginSuccess
  | LoginFailure
  | GetUserInfoRequest
  | GetUserInfoSuccess
  | GetUserInfoFailure;
  //<-------------------->
