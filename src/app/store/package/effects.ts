import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { CREATE_PACKAGE_REQUEST, CreatePackageFailure, CreatePackageRequest, CreatePackageSuccess, GET_ALL_PACKAGES_REQUEST, GetAllPackagesSuccess, OPEN_MODAL_CREATE_PACKAGE } from './actions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BlankComponent } from '@pages/blank/blank.component';
import { PackagesComponent } from '@pages/packages/packages.component';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { ApiService } from '@services/api.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { of } from 'rxjs';

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

    createPackage$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_PACKAGE_REQUEST),
        map((action: CreatePackageRequest) => action.payload),
        switchMap((payload) => {
            return this.apiService.addPackage(payload).pipe(
                mergeMap((packageResolved) => {
                    this.modalRef.close();
                    return [
                        new CreatePackageSuccess(packageResolved)
                    ];
                }),
                catchError((err) => of(new CreatePackageFailure(err)))
            )
        })
    ));

    getPackages$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_PACKAGES_REQUEST),
        switchMap((action) => {
            return this.apiService.getPackages().pipe(
                mergeMap((packagesResolved) => {
                    console.log(packagesResolved);
                    return [
                        new GetAllPackagesSuccess(packagesResolved)
                    ];
                }),
                catchError((err) => of(new CreatePackageFailure(err)))
            )
        })
    ));

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private apiService: ApiService
    ) { }
}