import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import {
    CREATE_PACKAGE_REQUEST,
    CreatePackageFailure,
    CreatePackageRequest,
    CreatePackageSuccess,
    GET_ALL_PACKAGES_REQUEST,
    GET_ALL_PERMISSIONS_REQUEST,
    GetAllPackagesRequest,
    GetAllPackagesSuccess,
    OPEN_MODAL_CREATE_PACKAGE,
    OPEN_MODAL_CREATE_ROLE,
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
    CreateEmployeeFailure
} from './actions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PackagesComponent } from '@pages/packages/packages.component';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { ApiService } from '@services/api.service';
import { of } from 'rxjs';
import { CreatecostumerformComponent } from '@components/createcostumerform/createcostumerform.component';
import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { PermissionService } from '@services/configuration/permission.service';
import { RoleService } from '@services/configuration/role.service';
import { CreateRoleRequest } from './actions';
import { CreateEmployeeFormComponent } from '@components/create-employee-form/create-employee-form.component';
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

    openModalCreateRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_CREATE_ROLE),
            tap((action) => {
                this.modalRef = this.modalService.open(CreateRoleFormComponent, {
                    backdrop: false,
                    size: 'lg'
                });
            })
        ), { dispatch: false });

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
                        new CreateRoleSuccess(roleResolved)
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

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private apiService: ApiService,
        private apiPermission: PermissionService,
        private roleService: RoleService
    ) { }
}
