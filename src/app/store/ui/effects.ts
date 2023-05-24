import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { CREATE_ORDER_REQUEST, CREATE_PACKAGE_REQUEST, CreateOrderFailure, CreateOrderRequest, CreateOrderSuccess, CreatePackageFailure, CreatePackageRequest, CreatePackageSuccess, GET_ALL_ORDERS_REQUEST, GET_ALL_PACKAGES_REQUEST, GetAllOrdersRequest, GetAllOrdersSuccess, GetAllPackagesRequest, GetAllPackagesSuccess, OPEN_MODAL_CREATE_ORDER, OPEN_MODAL_CREATE_PACKAGE, OPEN_MODAL_CREATE_ROLE } from './actions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PackagesComponent } from '@pages/packages/packages.component';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { ApiService } from '@services/api.service';
import { of } from 'rxjs';
import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { CreateOrderFormComponent } from '@components/create-order-form/create-order-form.component';

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
    //<--------------------->

    openModalCreateRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_CREATE_ROLE),
            tap((action) => {
                this.modalRef = this.modalService.open(CreateRoleFormComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private apiService: ApiService
    ) { }
}