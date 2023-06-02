import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { CREATE_ORDER_REQUEST, CREATE_PACKAGE_REQUEST, CreateOrderFailure, CreateOrderRequest, CreateOrderSuccess, CreatePackageFailure, CreatePackageRequest, CreatePackageSuccess, GET_ALL_ORDERS_REQUEST, GET_ALL_PACKAGES_REQUEST, GET_ALL_PERMISSIONS_REQUEST, GetAllOrdersRequest, GetAllOrdersSuccess, GetAllPackagesRequest, GetAllPackagesSuccess, GetUsersRequest, GetUsersFailure, GetUsersSuccess, OPEN_MODAL_CREATE_ORDER, OPEN_MODAL_CREATE_PACKAGE, OPEN_MODAL_CREATE_ROLE, CreateUserRequest, CreateUserSuccess, CreateUserFailure, UpdateUserRequest, UpdateUserSuccess, UpdateUserFailure } from './actions';
import {
    GetAllPermissionsSuccess,
    GetAllPermissionsFailure,
    CREATE_ROLE_REQUEST,
    CreateRoleFailure,
    CreateRoleSuccess,
    GET_ALL_ROLE_REQUEST,
    GetAllRoleSuccess,
    GetAllRoleFailure,
    GET_ALL_COSTUMER_REQUEST,
    GetAllCostumerSuccess,
    GetAllCostumerFailure,
    OPEN_MODAL_CREATE_COSTUMER,
    CREATE_COSTUMER_REQUEST,
    CreateCostumerRequest,
    CreateCostumerSuccess,
    GetAllCostumerRequest,
    CreateCostumerFailure,
    OPEN_MODAL_CREATE_EMPLOYEE,
    GET_ALL_EMPLOYEE_REQUEST,
    GetAllEmployeeSuccess,
    GetAllEmployeeFailure,
    CREATE_EMPLOYEE_REQUEST,
    CreateEmployeeRequest,
    CreateEmployeeSuccess,
    GetAllEmployeeRequest,
    CreateEmployeeFailure,
    EDIT_ROLE_REQUEST,
    EditRoleRequest,
    EditRoleSuccess,
    EditRoleFailure,
    GetAllRoleRequest,
    CREATE_ASSOCIATEDPERMISSION_REQUEST,
    CreateAssociatedPermissionRequest,
    CreateAssociatedPermissionSuccess,
    CreateAssociatedPermissionFailure,
    DELETE_ASSOCIATEDPERMISSION_REQUEST,
    DeleteAssociatedPermissionRequest,
    OpenModalCreateRole,
    EDIT_PACKAGE_REQUEST,
    EditPackageRequest,
    EditPackageSuccess,
    OPEN_MODAL_USER,
    usersActions
} from './actions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PackagesComponent } from '@pages/packages/packages.component';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { ApiService } from '@services/api.service';
import { of } from 'rxjs';
import { CreatecostumerformComponent } from '@components/createcostumerform/createcostumerform.component';
import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { CreateOrderFormComponent } from '@components/create-order-form/create-order-form.component';

import { PermissionService } from '@services/configuration/permission.service';
import { RoleService } from '@services/configuration/role.service';
import { CreateRoleRequest } from './actions';
import { CreateEmployeeFormComponent } from '@components/create-employee-form/create-employee-form.component';
import { DeleteAssociatedPermissionSuccess, DeleteAssociatedPermissionFailure } from './actions';
import { open } from 'fs';
import { AssociatedPermissionService } from '@services/configuration/associated-permission.service';
import { CreateUserFormComponent } from '@components/create-user-form/create-user-form.component';
@Injectable()
export class PackageEffects {
    modalRef: NgbModalRef;


    openModalCreatePackage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_CREATE_PACKAGE),
            tap((action) => {
                this.modalRef = this.modalService.open(CreatePackageFormComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    getPackages$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_PACKAGES_REQUEST),
        switchMap((action) => {
            return this.apiService.getPackages().pipe(
                mergeMap((packagesResolved) => {
                    return [
                        new GetAllPackagesSuccess(packagesResolved)
                    ];
                }),
                catchError((err) => of(new CreatePackageFailure(err)))
            )
        })
    ));

    createPackage$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_PACKAGE_REQUEST),
        map((action: CreatePackageRequest) => action.payload),
        switchMap((pack) => {
            return this.apiService.addPackage(pack).pipe(

                mergeMap((packageResolved) => {
                    this.modalRef.close();
                    return [
                        new CreatePackageSuccess(packageResolved),
                        new GetAllPackagesRequest()
                    ];
                }),
                catchError((err) => of(new CreatePackageFailure(err)))
            )
        })
    ));

    //<--- ORDER EFFECTS --->
    openModalCreateOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_CREATE_ORDER),
            tap((action) => {
                this.modalRef = this.modalService.open(CreateOrderFormComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    createOrder$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_ORDER_REQUEST),
        map((action: CreateOrderRequest) => action.payload),
        switchMap((order) => {
            return this.apiService.addOrder(order).pipe(
                mergeMap((orderResolved) => {
                    this.modalRef.close();
                    return [
                        new CreateOrderSuccess(orderResolved),
                        new GetAllOrdersRequest()
                    ];
                }),
                catchError((err) => of(new CreateOrderFailure(err)))
            )
        })
    ));
    getOrders$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_ORDERS_REQUEST),
        switchMap((action) => {
            return this.apiService.getOrders().pipe(
                mergeMap((ordersResolved) => {
                    console.log(ordersResolved)
                    return [
                        new GetAllOrdersSuccess(ordersResolved)

                    ];
                }),
                catchError((err) => of(new CreatePackageFailure(err)))
            )
        })
    ));


    //<--------------------->
    editPackage$ = createEffect(() => this.actions$.pipe(
        ofType(EDIT_PACKAGE_REQUEST),
        map((action: EditPackageRequest) => action.payload),
        switchMap((pack) => {
            return this.apiService.updatePackage(pack.packageId, pack).pipe(
                mergeMap((packResolved) => {
                    this.modalRef.close();
                    return [
                        new EditPackageSuccess(packResolved),
                        new GetAllPackagesRequest(),
                    ];
                }),
                catchError((err) => of(new EditRoleFailure(err)))
            )
        })
    ));



    openModalCreateRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_CREATE_ROLE),
            tap((action) => {
                this.modalRef = this.modalService.open(CreateRoleFormComponent, {
                    backdrop: false,
                    size: 'lg'
                });
            })
        ),
        {
            dispatch: false
        });

    getPermissions$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_PERMISSIONS_REQUEST),
        switchMap((action) => {
            return this.apiPermission.ReadPermissions().pipe(
                mergeMap((permissionResolved) => {
                    return [
                        new GetAllPermissionsSuccess(permissionResolved)
                    ];
                }),
                catchError((err) => of(new GetAllPermissionsFailure(err)))
            )

        })
    ));

    createRole$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_ROLE_REQUEST),
        map((action: CreateRoleRequest) => action.payload),
        switchMap((role) => {
            return this.roleService.CreateRole(role).pipe(
                mergeMap((roleResolved) => {
                    this.modalRef.close();
                    return [
                        new CreateRoleSuccess(roleResolved),
                        new GetAllRoleRequest()
                    ];
                }),
                catchError((err) => of(new CreateRoleFailure(err)))
            )
        })
    ));

    getRoles$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_ROLE_REQUEST),
        switchMap((action) => {
            return this.roleService.ReadRoles().pipe(
                mergeMap((roleResolved) => {
                    return [
                        new GetAllRoleSuccess(roleResolved)
                    ];
                }),
                catchError((err) => of(new GetAllRoleFailure(err)))
            )

        })
    ));
    //<-----  COSTUMERS ----->
    openModalCreateCostumer = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_CREATE_COSTUMER),
            tap((action) => {
                this.modalRef = this.modalService.open(CreatecostumerformComponent, {
                    backdrop: false,
                    size: 'lg'
                });
            })
        ), { dispatch: false });

    getCostumers$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_COSTUMER_REQUEST),
        switchMap((action) => {
            return this.apiService.getCostumers().pipe(
                mergeMap((costumerResolved) => {
                    return [
                        new GetAllCostumerSuccess(costumerResolved)
                    ];
                }),
                catchError((err) => of(new GetAllCostumerFailure(err)))
            )
        })
    ));
    createCostumer$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_COSTUMER_REQUEST),
        map((action: CreateCostumerRequest) => action.payload),
        switchMap((costumer) => {
            return this.apiService.addCostumer(costumer).pipe(
                mergeMap((costumerResolved) => {
                    this.modalRef.close();
                    return [
                        new CreateCostumerSuccess(costumerResolved),
                        new GetAllCostumerRequest()
                    ];
                }),
                catchError((err) => of(new CreateCostumerFailure(err)))
            )
        })
    ));

    editRole$ = createEffect(() => this.actions$.pipe(
        ofType(EDIT_ROLE_REQUEST),
        map((action: EditRoleRequest) => action.payload),
        switchMap((role) => {
            return this.roleService.UpdateRole(role.roleId, role).pipe(
                mergeMap((roleResolved) => {
                    this.modalRef.close();
                    return [
                        new EditRoleSuccess(roleResolved),
                        new GetAllRoleRequest(),
                    ];
                }),
                catchError((err) => of(new EditRoleFailure(err)))
            )
        })
    ))

    //<-----  EMPLOYEE ----->
    openModalCreateEmployee = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_CREATE_EMPLOYEE),
            tap((action) => {
                this.modalRef = this.modalService.open(CreateEmployeeFormComponent, {
                    backdrop: false,
                    size: 'lg'
                });
            })
        ), { dispatch: false });

    getEmployees$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_EMPLOYEE_REQUEST),
        switchMap((action) => {
            return this.apiService.getEmployees().pipe(
                mergeMap((employeeResolver) => {
                    return [
                        new GetAllEmployeeSuccess(employeeResolver)
                    ];
                }),
                catchError((err) => of(new GetAllEmployeeFailure(err)))
            )
        })
    ));
    createEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_EMPLOYEE_REQUEST),
        map((action: CreateEmployeeRequest) => action.payload),
        switchMap((employee) => {
            return this.apiService.addEmployee(employee).pipe(
                mergeMap((employeeResolver) => {
                    this.modalRef.close();
                    return [
                        new CreateEmployeeSuccess(employeeResolver),
                        new GetAllEmployeeRequest()
                    ];
                }),
                catchError((err) => of(new CreateEmployeeFailure(err)))
            )
        })
    ));
    createAssociatedPermission$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_ASSOCIATEDPERMISSION_REQUEST),
        map((action: CreateAssociatedPermissionRequest) => action.payload),
        switchMap((asocpermission) => {
            return this.assocPermissionService.CreateAssociatedPermission(asocpermission).pipe(
                mergeMap((assocPermissionResolved) => {
                    this.modalRef.close();
                    return [
                        new CreateAssociatedPermissionSuccess(assocPermissionResolved),
                    ];
                }),
                catchError((err) => of(new CreateAssociatedPermissionFailure(err)))
            )
        })
    ));

    DeleteAssociatedPermission$ = createEffect(() => this.actions$.pipe(
        ofType(DELETE_ASSOCIATEDPERMISSION_REQUEST),
        map((action: DeleteAssociatedPermissionRequest) => action.payload),
        switchMap((asocpermission) => {
            return this.assocPermissionService.DeleteAssociatedPermission(asocpermission.associatedPermissionId).pipe(
                mergeMap((assocPermissionResolved) => {
                    return [
                        new DeleteAssociatedPermissionSuccess(assocPermissionResolved),
                    ];
                }),
                catchError((err) => of(new DeleteAssociatedPermissionFailure(err)))
            )
        })
    ));


    //<--USER EFFECTS--------------->

    openModalUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_USER),
            tap(() => {
                this.modalRef = this.modalService.open(CreateUserFormComponent, {
                    backdrop: false,
                    size: 'xl'
                })
            })
        ), { dispatch: false });

    getUsers$ = createEffect(() => this.actions$.pipe(
        ofType(usersActions.GET_USERS_REQUEST),
        switchMap((action) => {
            return this.apiService.getUsers().pipe(
                mergeMap((usersResolved) => {
                    return [
                        new GetUsersSuccess(usersResolved)
                    ];
                }),
                catchError((error) => of(new GetUsersFailure(error)))
            )
        })
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(usersActions.CREATE_USER_REQUEST),
        map((action: CreateUserRequest) => action.payload),
        switchMap((user) => {
            return this.apiService.createUser(user).pipe(
                mergeMap((userResolved) => {
                    this.modalRef.close();
                    return [
                        new CreateUserSuccess(userResolved),
                        new GetUsersRequest()
                    ];
                }),
                catchError((error) => of(new CreateUserFailure(error)))
            )
        })
    ));

    updateUser$ = createEffect(() => this.actions$.pipe(
        ofType(usersActions.UPDATE_USER_REQUEST),
        map((action: UpdateUserRequest) => action.payload),
        switchMap((user) => {
            return this.apiService.updateUser(user.userId, user).pipe(
                mergeMap((userResolved) => {
                    this.modalRef.close(); return [
                        new UpdateUserSuccess(userResolved),
                        new GetUsersRequest(),
                    ]
                }),
                catchError((error) => of(new UpdateUserFailure(error)))
            )
        })
    ));



    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private apiService: ApiService,
        private apiPermission: PermissionService,
        private roleService: RoleService,
        private assocPermissionService: AssociatedPermissionService
    ) { }
}
