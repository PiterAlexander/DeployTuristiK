import { Package } from '@/models/package';
import { Permission } from '@/models/permission';
import { Role } from '@/models/role';
import {Action} from '@ngrx/store';

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


export class ToggleSidebarMenu implements Action {
    readonly type: string = TOGGLE_SIDEBAR_MENU;
    constructor(public payload?: string) {}
}
export class ToggleControlSidebar implements Action {
    readonly type: string = TOGGLE_CONTROL_SIDEBAR;
    constructor(public payload?: string) {}
}

export class ToggleDarkMode implements Action {
    readonly type: string = TOGGLE_DARK_MODE;
    constructor(public payload?: string) {}
}

export class OpenModalCreatePackage implements Action {
    readonly type: string = OPEN_MODAL_CREATE_PACKAGE;
}

export class GetAllPackagesRequest implements Action {
    readonly type: string = GET_ALL_PACKAGES_REQUEST;
}

export class GetAllPackagesSuccess implements Action {
    readonly type: string = GET_ALL_PACKAGES_SUCCESS;
    constructor(public payload: Array<Package>) {}
}

export class GetAllPackagesFailure implements Action {
    readonly type: string = GET_ALL_PACKAGES_FAILURE;
    constructor(public payload: string) {}
}

export class CreatePackageRequest implements Action {
    readonly type: string = CREATE_PACKAGE_REQUEST;
    constructor(public payload: Package) {}
}

export class CreatePackageSuccess implements Action {
    readonly type: string = CREATE_PACKAGE_SUCCESS;
    constructor(public payload: any) {}
}

export class CreatePackageFailure implements Action {
    readonly type: string = CREATE_PACKAGE_FAILURE;
    constructor(public payload: string) {}
}

export class OpenModalCreateRole implements Action {
    readonly type: string = OPEN_MODAL_CREATE_ROLE;
}

export class GetAllPermissionsRequest implements Action {
  readonly type: string = GET_ALL_PERMISSIONS_REQUEST;
}

export class GetAllPermissionsSuccess implements Action {
  readonly type: string = GET_ALL_PERMISSIONS_SUCCESS;
  constructor(public payload: Array<Permission>) {}
}

export class GetAllPermissionsFailure implements Action {
  readonly type: string = GET_ALL_PERMISSIONS_FAILURE;
  constructor(public payload: string) {}
}

export class CreateRoleRequest implements Action {
  readonly type: string = CREATE_ROLE_REQUEST;
  constructor(public payload: Role) {}
}

export class CreateRoleSuccess implements Action {
  readonly type: string = CREATE_ROLE_SUCCESS;
  constructor(public payload: any) {}
}
export class CreateRoleFailure implements Action {
  readonly type: string = CREATE_ROLE_FAILURE;
  constructor(public payload: string) {}
}

export class GetAllRoleRequest implements Action {
  readonly type: string = GET_ALL_ROLE_REQUEST;
}

export class GetAllRoleSuccess implements Action {
  readonly type: string = GET_ALL_ROLE_SUCCESS;
  constructor(public payload: Array<Role>) {}
}

export class GetAllRoleFailure implements Action {
  readonly type: string = GET_ALL_ROLE_FAILURE;
  constructor(public payload: string) {}
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
    | GetAllPermissionsSuccess
    | GetAllPermissionsFailure
    | CreateRoleRequest
    | CreateRoleSuccess
    | CreateRoleFailure
    | GetAllRoleSuccess
    | GetAllRoleFailure;
