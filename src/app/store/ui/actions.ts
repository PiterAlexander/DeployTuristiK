import { Package } from '@/models/package';
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
    constructor(public payload: any) {}
}

export class CreatePackageSuccess implements Action {
    readonly type: string = CREATE_PACKAGE_SUCCESS;
    constructor(public payload: any) {}
}

export class CreatePackageFailure implements Action {
    readonly type: string = CREATE_PACKAGE_FAILURE;
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
    | CreatePackageFailure;
