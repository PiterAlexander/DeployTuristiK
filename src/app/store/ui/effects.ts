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
} from './actions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PackagesComponent } from '@pages/packages/packages.component';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { ApiService } from '@services/api.service';
import { of } from 'rxjs';

import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { PermissionService } from '@services/configuration/permission.service';
import { RoleService } from '@services/configuration/role.service';
import { CreateRoleRequest, DeleteAssociatedPermissionSuccess, DeleteAssociatedPermissionFailure } from './actions';
import { open } from 'fs';
import { AssociatedPermissionService } from '@services/configuration/associated-permission.service';
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

    editPackage$ = createEffect(() => this.actions$.pipe(
        ofType(EDIT_PACKAGE_REQUEST),
        map((action: EditPackageRequest) => action.payload),
        switchMap((pack) => {
            return this.apiService.updatePackage(pack.packageId,pack).pipe(
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

    editRole$ = createEffect(() => this.actions$.pipe(
        ofType(EDIT_ROLE_REQUEST),
        map((action: EditRoleRequest) => action.payload),
        switchMap((role) => {
            return this.roleService.UpdateRole(role.roleId,role).pipe(
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
                this.modalRef.close();
                return [
                    new DeleteAssociatedPermissionSuccess(assocPermissionResolved),
                ];
            }),
            catchError((err) => of(new DeleteAssociatedPermissionFailure(err)))
          )
      })
    ));




    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private apiService: ApiService,
        private apiPermission: PermissionService,
        private roleService: RoleService,
        private assocPermissionService : AssociatedPermissionService
    ) { }
}
