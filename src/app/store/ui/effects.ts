import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {
    GET_ALL_PERMISSIONS_REQUEST,
    CREATE_ASSOCIATEDPERMISSION_REQUEST,
    DELETE_ASSOCIATEDPERMISSION_REQUEST,
    OPEN_MODAL_DETAILS_PACKAGE,
    loginActions,
    LoginRequest,
    LoginSuccess,
    LoginFailure,
    GetUserInfoSuccess,
    GetUserInfoFailure,
    CreateFrequentTravelerFailure,
    CreateFrequentTravelerRequest,
    CreateFrequentTravelerSuccess,
    FrequentTravelerActions,
    EditPaymentRequest,
    EditPaymentSuccess,
    EditPaymentFailure,
    ChangeStatusPackageRequest,
    ChangeStatusPackageSuccess,
    ChangeStatusPackageFailure,
    OpenModalCreatePackage,
    DeleteFrequentTravelerRequest,
    DeleteFrequentTravelerSuccess,
    DeleteFrequentTravelerFailure,
    GetTopPackagesSuccess,
    GetTopPackagesFailure,
    RecoverPasswordRequest,
    RecoverPasswordSuccess,
    RecoverPasswordFailure,
    SaveCurrentUserRequest,
    SaveCurrentUserSuccess,
    SaveCurrentUserFailure,
    DeleteOrderDetailRequest,
    DeleteOrderDetailSuccess,
    DeleteOrderDetailFailure,
    LoadDataSuccess,
    LoadDataFailure,
    LOAD_DATA_REQUEST,
    CreateOrderDetailRequest,
    CreateOrderDetailSuccess,
    CreateOrderDetailFailure,
    ChangePasswordRequest,
    ChangePasswordSuccess,
    ChangePasswordFailure,
    contactUsActions,
    ContactUsRequest,
    ContactUsFailure,
    ContactUsSuccess,
    packageActions,
    CreateAssociatedPermissionFailure,
    CreateAssociatedPermissionRequest,
    CreateAssociatedPermissionSuccess,
    CreateCustomerFailure,
    CreateCustomerRequest,
    CreateCustomerSuccess,
    CreateEmployeeFailure,
    CreateEmployeeRequest,
    CreateEmployeeSuccess,
    CreateOrderFailure,
    CreateOrderRequest,
    CreateOrderSuccess,
    CreatePackageFailure,
    CreatePackageRequest,
    CreatePackageSuccess,
    CreatePaymentFailure,
    CreatePaymentRequest,
    CreatePaymentSuccess,
    CreateRoleFailure,
    CreateRoleRequest,
    CreateRoleSuccess,
    CreateUserFailure,
    CreateUserRequest,
    CreateUserSuccess,
    DeleteAssociatedPermissionFailure,
    DeleteAssociatedPermissionRequest,
    DeleteAssociatedPermissionSuccess,
    DeleteEmployeeFailure,
    DeleteEmployeeRequest,
    DeleteEmployeeSuccess,
    DeleteRoleFailure,
    DeleteRoleRequest,
    DeleteRoleSuccess,
    EditCustomerFailure,
    EditCustomerRequest,
    EditCustomerSuccess,
    EditEmployeeFailure,
    EditEmployeeRequest,
    EditEmployeeSuccess,
    EditOrderDetailFailure,
    EditOrderDetailRequest,
    EditOrderDetailSuccess,
    EditOrderFailure,
    EditOrderRequest,
    EditOrderSuccess,
    EditPackageFailure,
    EditPackageRequest,
    EditPackageSuccess,
    EditRoleFailure,
    EditRoleRequest,
    EditRoleSuccess,
    GetAllCustomerFailure,
    GetAllCustomerRequest,
    GetAllCustomerSuccess,
    GetAllEmployeeFailure,
    GetAllEmployeeRequest,
    GetAllEmployeeSuccess,
    GetAllOrdersFailure,
    GetAllOrdersRequest,
    GetAllOrdersSuccess,
    GetAllPackagesFailure,
    GetAllPackagesRequest,
    GetAllPackagesSuccess,
    GetAllPermissionsFailure,
    GetAllPermissionsSuccess,
    GetAllRoleFailure,
    GetAllRoleRequest,
    GetAllRoleSuccess,
    GetUsersFailure,
    GetUsersRequest,
    GetUsersSuccess,
    UpdateUserFailure,
    UpdateUserRequest,
    UpdateUserSuccess,
    customerActions,
    employeeActions,
    orderActions,
    permissionActions,
    roleActions,
    userActions,
    GetAllPaymentsSuccess,
    GetAllPaymentsFailure,
    AdminMailReceptionRequest,
    AdminMailReceptionSuccess,
    AdminMailReceptionFailure,
    AdminMailReceptionToCustomerFailure,
    AdminMailReceptionToCustomerRequest,
    AdminMailReceptionToCustomerSuccess,
    PaymentApprobationRequest,
    PaymentApprobationFailure,
    PaymentApprobationSuccess,
    PaymentRejectionFailure,
    PaymentRejectionRequest,
    PaymentRejectionSuccess,
    OrderCancellationRequest,
    OrderCancellationSuccess,
    OrderCancellationFailure,
    OrderActivationFailure,
    OrderActivationRequest,
    OrderActivationSuccess,
} from './actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { of } from 'rxjs';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { CreateOrderFormComponent } from '@components/create-order-form/create-order-form.component';
import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { DetailsPackageComponent } from '@components/details-package/details-package.component';
import { CreateEmployeeFormComponent } from '@components/create-employee-form/create-employee-form.component';
import { CreateUserFormComponent } from '@components/create-user-form/create-user-form.component';
import { AuthService } from '@services/auth/auth.service';
import { ListFrequentTravelerComponent } from '@components/list-frequent-traveler/list-frequent-traveler.component';
import { EditPaymentFormComponent } from '@components/edit-payment-form/edit-payment-form.component';
import { CreatecustomerformComponent } from '@components/create-customer-form/create-customer-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

//<--------PRIMENG----------->
import { MessageService } from 'primeng/api';
import { ChangePasswordComponent } from '@modules/change-password/change-password.component';

@Injectable()
export class PackageEffects {
    dialogRef: DynamicDialogRef;

    //<--- PACKAGES --->
    getPackages$ = createEffect(() => this.actions$.pipe(
        ofType(packageActions.GET_ALL_PACKAGES_REQUEST),
        switchMap((action) => {
            return this.apiService.getPackages().pipe(
                mergeMap((packagesResolved) => {
                    return [
                        new GetAllPackagesSuccess(packagesResolved)
                    ];
                }),
                catchError((err) => of(new GetAllPackagesFailure(err)))
            )
        })
    ));

    openModalDetailsPackage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_DETAILS_PACKAGE),
            tap((action) => {
                this.dialogRef = this.dialogService.open(DetailsPackageComponent, {
                    showHeader: false,
                    width: '55%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                });
            })
        ), { dispatch: false });

    loadIngresos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LOAD_DATA_REQUEST),
            mergeMap(() =>
                this.apiService.getIngresosMensuales().pipe(
                    map((data: number[]) => new LoadDataSuccess({ data })),
                    catchError((error) => of(new LoadDataFailure({ error })))
                )
            )
        )
    );

    getTopPackages$ = createEffect(() => this.actions$.pipe(
        ofType(packageActions.GET_TOP_PACKAGES_REQUEST),
        switchMap((action) => {
            return this.apiService.getTopPackage().pipe(
                mergeMap((packagesResolved) => {
                    return [
                        new GetTopPackagesSuccess(packagesResolved)
                    ];
                }),
                catchError((err) => of(new GetTopPackagesFailure(err)))
            )
        })
    ));

    openModalCreatePackage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(packageActions.OPEN_MODAL_CREATE_PACKAGE),
            tap((action: OpenModalCreatePackage) => {
                this.dialogRef = this.dialogService.open(CreatePackageFormComponent, {
                    showHeader: false,
                    width: '55%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                });
            })
        ), { dispatch: false }
    );


    createPackage$ = createEffect(() => this.actions$.pipe(
        ofType(packageActions.CREATE_PACKAGE_REQUEST),
        map((action: CreatePackageRequest) => action.payload),
        switchMap((pack) => {
            return this.apiService.addPackage(pack).pipe(
                mergeMap((packageResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Paquete registrado exitosamente.' });
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
        ofType(packageActions.EDIT_PACKAGE_REQUEST),
        map((action: EditPackageRequest) => action.payload),
        switchMap((pack) => {
            return this.apiService.updatePackage(pack.packageId, pack).pipe(

                mergeMap((packResolved) => {

                    //this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Paquete editado exitosamente.' });
                    this.dialogRef.close()

                    return [
                        new EditPackageSuccess(packResolved),
                        new GetAllPackagesRequest(),
                    ];
                }),
                catchError((err) => of(new EditPackageFailure(err)))
            )
        })
    ));

    disablePackage$ = createEffect(() => this.actions$.pipe(
        ofType(packageActions.CHANGE_STATUS_PACKAGE_REQUEST),
        map((action: ChangeStatusPackageRequest) => action.payload),
        switchMap((pack) => {
            return this.apiService.disablePackage(pack).pipe(
                mergeMap((packResolved) => {
                    this.dialogRef.close();
                    return [
                        new ChangeStatusPackageSuccess(packResolved),
                        new GetAllPackagesRequest(),
                    ];
                }),
                catchError((err) => of(new ChangeStatusPackageFailure(err)))
            )
        })
    ));
    //<-------------->

    //<--- ORDERS --->
    getOrders$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.GET_ALL_ORDERS_REQUEST),
        switchMap((action) => {
            return this.apiService.getOrders().pipe(
                mergeMap((ordersResolved) => {
                    return [
                        new GetAllOrdersSuccess(ordersResolved)
                    ];
                }),
                catchError((err) => of(new GetAllOrdersFailure(err)))
            )
        })
    ));

    openModalCreateOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_CREATE_ORDER),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreateOrderFormComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '48%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                });
            })
        ), { dispatch: false });

    createOrder$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.CREATE_ORDER_REQUEST),
        map((action: CreateOrderRequest) => action.payload),
        switchMap((order) => {
            return this.apiService.addOrder(order).pipe(
                mergeMap((orderResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Pedido registrado exitosamente.' });
                    return [
                        new CreateOrderSuccess(orderResolved),
                        new GetAllCustomerRequest(),
                        new GetAllOrdersRequest()
                    ];
                }),
                catchError((err) => of(new CreateOrderFailure(err)))
            )
        })
    ));

    editOrder$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.EDIT_ORDER_REQUEST),
        map((action: EditOrderRequest) => action.payload),
        switchMap((order) => {
            return this.apiService.updateOrder(order.orderId, order).pipe(
                mergeMap((orderResolved) => {
                    return [
                        new EditOrderSuccess(orderResolved),
                        new GetAllOrdersRequest()
                    ];
                }),
                catchError((err) => of(new EditOrderFailure(err)))
            )
        })
    ));

    // openModalOrderDetails$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(orderActions.OPEN_MODAL_ORDERDETAILS),
    //         tap((action) => {
    //             this.dialogRef = this.dialogService.open(ReadOrderOrderDetailComponent, {
    //                 /* Opciones del modal */
    //                 showHeader: false,
    //                 width: '70%',
    //                 contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
    //                 baseZIndex: 10000,
    //             });
    //         })
    //     ), { dispatch: false });

    // openModalCreateOrderDetail$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(orderActions.OPEN_MODAL_CREATE_ORDERDETAIL),
    //         tap((action) => {
    //             this.dialogRef = this.dialogService.open(CreateOrderDetailFormComponent, {
    //                 /* Opciones del modal */
    //                 showHeader: false,
    //                 width: '85%',
    //                 contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
    //             });
    //         })
    //     ), { dispatch: false });

    createOrderDetail$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.CREATE_ORDERDETAIL_REQUEST),
        map((action: CreateOrderDetailRequest) => action.payload),
        switchMap((payment) => {
            return this.apiService.addPayment(payment).pipe(
                mergeMap((paymentResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario/s agregado/s exitosamente.' });
                    return [
                        new CreateOrderDetailSuccess(paymentResolved),
                        new GetAllCustomerRequest(),
                        new GetAllOrdersRequest()
                    ];
                }),
                catchError((err) => of(new CreateOrderDetailFailure(err)))
            )
        })
    ));

    editOrderDetail$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.EDIT_ORDERDETAIL_REQUEST),
        map((action: EditOrderDetailRequest) => action.payload),
        switchMap((customer) => {
            return this.apiService.updateCustomer(customer.customerId, customer).pipe(
                mergeMap((customerResolved) => {
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario editado exitosamente.' });
                    return [
                        new EditOrderDetailSuccess(customerResolved),
                    ];
                }),
                catchError((err) => of(new EditOrderDetailFailure(err)))
            )
        })
    ));

    deleteOrderDetail$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.DELETE_ORDERDETAIL_REQUEST),
        map((action: DeleteOrderDetailRequest) => action.payload),
        switchMap((OrderDetail) => {
            return this.apiService.deleteOrderDetail(OrderDetail.orderDetailId).pipe(
                mergeMap((orderDetailResolved) => {
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario eliminado exitosamente.' });
                    return [
                        new DeleteOrderDetailSuccess(orderDetailResolved),
                    ];
                }),
                catchError((err) => of(new DeleteOrderDetailFailure(err)))
            )
        })
    ));

    createPayment$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.CREATE_PAYMENT_REQUEST),
        map((action: CreatePaymentRequest) => action.payload),
        switchMap((payment) => {
            return this.apiService.addPayment(payment).pipe(
                mergeMap((paymentResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Abono agregado exitosamente.' });
                    return [
                        new CreatePaymentSuccess(paymentResolved),
                        new GetAllOrdersRequest(),
                    ];
                }),
                catchError((err) => of(new CreatePaymentFailure(err)))
            )
        })
    ));

    openModalEditPayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_EDIT_PAYMENT),
            tap((action) => {
                this.dialogRef = this.dialogService.open(EditPaymentFormComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '45%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                });
            })
        ), { dispatch: false });

    editPayment$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.EDIT_PAYMENT_REQUEST),
        map((action: EditPaymentRequest) => action.payload),
        switchMap((payment) => {
            return this.apiService.updatePayment(payment.paymentId, payment).pipe(
                mergeMap((paymentResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Abono editado exitosamente.' });
                    return [
                        new EditPaymentSuccess(paymentResolved),
                    ];
                }),
                catchError((err) => of(new EditPaymentFailure(err)))
            )
        })
    ));

    getPayments$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.GET_ALL_PAYMENTS_REQUEST),
        switchMap((action) => {
            return this.apiService.getPayments().pipe(
                mergeMap((paymentsResolved) => {
                    return [
                        new GetAllPaymentsSuccess(paymentsResolved)
                    ];
                }),
                catchError((err) => of(new GetAllPaymentsFailure(err)))
            )
        })
    ));

    //<--- PAYMENT MAILS --->
    adminMailReception$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.SEND_ADMIN_RECEPTION_MAIL_REQUEST),
        map((action: AdminMailReceptionRequest) => action.payload),
        switchMap((mailRecepcion) => {
            return this.apiService.adminMailReception(mailRecepcion).pipe(
                mergeMap((data) => {
                    return [new AdminMailReceptionSuccess(data)]
                }),
                catchError((error) => of(new AdminMailReceptionFailure(error))))
        })
    ))

    adminMailReceptionToCustomer$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.SEND_ADMIN_RECEPTION_MAIL_TO_CUSTOMER_REQUEST),
        map((action: AdminMailReceptionToCustomerRequest) => action.payload),
        switchMap((mailRecepcion) => {
            return this.apiService.adminMailReceptionToCustomer(mailRecepcion).pipe(
                mergeMap((data) => {
                    return [new AdminMailReceptionToCustomerSuccess(data)]
                }),
                catchError((error) => of(new AdminMailReceptionToCustomerFailure(error))))
        })
    ))

    paymentApprobation$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.SEND_PAYMENT_APPROBATION_REQUEST),
        map((action: PaymentApprobationRequest) => action.payload),
        switchMap((paymentStatusMail) => {
            return this.apiService.paymentApprobation(paymentStatusMail).pipe(
                mergeMap((data) => {
                    return [new PaymentApprobationSuccess(data)]
                }),
                catchError((error) => of(new PaymentApprobationFailure(error))))
        })
    ))

    paymentRejection$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.SEND_PAYMENT_REJECTION_REQUEST),
        map((action: PaymentRejectionRequest) => action.payload),
        switchMap((paymentStatusMail) => {
            return this.apiService.paymentRejection(paymentStatusMail).pipe(
                mergeMap((data) => {
                    return [new PaymentRejectionSuccess(data)]
                }),
                catchError((error) => of(new PaymentRejectionFailure(error))))
        })
    ))

    orderCancellation$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.SEND_ORDER_CANCELLATION_REQUEST),
        map((action: OrderCancellationRequest) => action.payload),
        switchMap((paymentStatusMail) => {
            return this.apiService.orderCancellation(paymentStatusMail).pipe(
                mergeMap((data) => {
                    return [new OrderCancellationSuccess(data)]
                }),
                catchError((error) => of(new OrderCancellationFailure(error))))
        })
    ))

    orderActivation$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.SEND_ORDER_ACTIVATION_REQUEST),
        map((action: OrderActivationRequest) => action.payload),
        switchMap((paymentStatusMail) => {
            return this.apiService.orderActivation(paymentStatusMail).pipe(
                mergeMap((data) => {
                    return [new OrderActivationSuccess(data)]
                }),
                catchError((error) => of(new OrderActivationFailure(error))))
        })
    ))
    //<----------------------------->

    //<----------------------------->

    //<--- ROLES AND PERMISSIONS --->
    getRoles$ = createEffect(() => this.actions$.pipe(
        ofType(roleActions.GET_ALL_ROLE_REQUEST),
        switchMap((action) => {
            return this.apiService.getRoles().pipe(
                mergeMap((roleResolved) => {
                    return [
                        new GetAllRoleSuccess(roleResolved)
                    ];
                }),
                catchError((err) => of(new GetAllRoleFailure(err)))
            )
        })
    ));

    openModalCreateRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(roleActions.OPEN_MODAL_CREATE_ROLE),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreateRoleFormComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '45%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                });

            })
        ),
        {
            dispatch: false
        });

    getPermissions$ = createEffect(() => this.actions$.pipe(
        ofType(GET_ALL_PERMISSIONS_REQUEST),
        switchMap((action) => {
            return this.apiService.getPermissions().pipe(
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
        ofType(roleActions.CREATE_ROLE_REQUEST),
        map((action: CreateRoleRequest) => action.payload),
        switchMap((role) => {
            return this.apiService.addRole(role).pipe(
                mergeMap((roleResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Rol registrado exitosamente.' });
                    return [
                        new CreateRoleSuccess(roleResolved),
                        new GetAllRoleRequest()
                    ];
                }),
                catchError((err) => of(new CreateRoleFailure(err)))
            )
        })
    ));


    editRole$ = createEffect(() => this.actions$.pipe(
        ofType(roleActions.EDIT_ROLE_REQUEST),
        map((action: EditRoleRequest) => action.payload),
        switchMap((role) => {
            return this.apiService.updateRole(role.roleId, role).pipe(
                mergeMap((roleResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Rol editado exitosamente.' });
                    return [
                        new EditRoleSuccess(roleResolved),
                        new GetAllRoleRequest(),
                    ];
                }),
                catchError((err) => of(new EditRoleFailure(err)))
            )
        })
    ));

    deleteRole$ = createEffect(() => this.actions$.pipe(
        ofType(roleActions.DELETE_ROLE_REQUEST),
        map((action: DeleteRoleRequest) => action.payload),
        switchMap((role) => {
            return this.apiService.deleteRole(role.roleId).pipe(
                mergeMap((roleResolved) => {
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Rol eliminado exitosamente.' });
                    return [
                        new DeleteRoleSuccess(roleResolved),
                        new GetAllRoleRequest(),
                    ];
                }),
                catchError((err) => of(new DeleteRoleFailure(err)))
            )
        })
    ));


    // disableRole$ = createEffect(() => this.actions$.pipe(
    //     ofType(roleActions.CHANGE_STATUS_ROLE_REQUEST),
    //     map((action: ChangeStatusRoleRequest) => action.payload),
    //     switchMap((role) => {
    //         return this.apiService.disableRole(role).pipe(
    //             mergeMap((roleResolved) => {
    //                 this.dialogRef.close()
    //                 return [
    //                     new ChangeStatusRoleSuccess(roleResolved),
    //                     new GetAllRoleRequest(),
    //                 ];
    //             }),
    //             catchError((err) => of(new ChangeStatusRoleFailure(err)))
    //         )
    //     })
    // ));

    createAssociatedPermission$ = createEffect(() => this.actions$.pipe(
        ofType(CREATE_ASSOCIATEDPERMISSION_REQUEST),
        ofType(permissionActions.CREATE_ASSOCIATEDPERMISSION_REQUEST),
        map((action: CreateAssociatedPermissionRequest) => action.payload),
        switchMap((asocpermission) => {
            return this.apiService.addAssociatedPermission(asocpermission).pipe(
                mergeMap((assocPermissionResolved) => {
                    this.dialogRef.close();
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
        ofType(permissionActions.DELETE_ASSOCIATEDPERMISSION_REQUEST),
        map((action: DeleteAssociatedPermissionRequest) => action.payload),
        switchMap((asocpermission) => {
            return this.apiService.deleteAssociatedPermission(asocpermission.associatedPermissionId).pipe(
                mergeMap((assocPermissionResolved) => {
                    this.dialogRef.close();
                    return [
                        new DeleteAssociatedPermissionSuccess(assocPermissionResolved),
                    ];
                }),
                catchError((err) => of(new DeleteAssociatedPermissionFailure(err)))
            )
        })
    ));
    //<------------------->

    //<---- CUSTOMERS ---->
    getCustomers$ = createEffect(() => this.actions$.pipe(
        ofType(customerActions.GET_ALL_CUSTOMER_REQUEST),
        switchMap((action) => {
            return this.apiService.getCustomers().pipe(
                mergeMap((customerResolved) => {
                    return [
                        new GetAllCustomerSuccess(customerResolved)
                    ];
                }),
                catchError((err) => of(new GetAllCustomerFailure(err)))
            )
        })
    ));

    openModalCreateCustomer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(customerActions.OPEN_MODAL_CREATE_CUSTOMER),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreatecustomerformComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '50%',
                    contentStyle: { padding: '1.50rem 2.25rem 1.50rem 2.25rem', overflowY: 'auto' },
                });
            })
        ),
        {
            dispatch: false
        });

    createCustomer$ = createEffect(() => this.actions$.pipe(
        ofType(customerActions.CREATE_CUSTOMER_REQUEST),
        map((action: CreateCustomerRequest) => action.payload),
        switchMap((customer) => {
            return this.apiService.addCustomer(customer).pipe(
                mergeMap((customerResolved) => {
                    this.dialogRef.close();
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Cliente registrado exitosamente.' });
                    return [
                        new CreateCustomerSuccess(customerResolved),
                        new GetAllCustomerRequest()
                    ];
                }),
                catchError((err) => of(new CreateCustomerFailure(err)))
            )
        })
    ));
    editCustomer$ = createEffect(() => this.actions$.pipe(
        ofType(customerActions.EDIT_CUSTOMER_REQUEST),
        map((action: EditCustomerRequest) => action.payload),
        switchMap((customer) => {
            return this.apiService.updateCustomer(customer.customerId, customer).pipe(
                mergeMap((customerResolved) => {
                    this.dialogRef.close();
                    var user = JSON.parse(localStorage.getItem('TokenPayload'))
                    if (customer.userId == user.id) {
                        this.messageService.add({
                            key: 'alert-message',
                            severity: 'success',
                            summary: '¡Proceso completado!',
                            detail: 'Información editada exitosamente.'
                        });
                        window.location.reload();
                    } else {
                        this.messageService.add({
                            key: 'alert-message',
                            severity: 'success',
                            summary: '¡Proceso completado!',
                            detail: 'Cliente editado exitosamente.'
                        });
                    }
                    return [
                        new EditCustomerSuccess(customerResolved),
                        new GetAllCustomerRequest(),
                    ];
                }),
                catchError((err) => of(new EditCustomerFailure(err)))
            )
        })
    ));
    //<------------------>
    //<---FREQUENT TRAVELER---->

    listModalTraveler$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FrequentTravelerActions.OPEN_MODAL_LIST_FREQUENTTRAVELER),
            tap((action) => {
                this.dialogRef = this.dialogService.open(ListFrequentTravelerComponent, {
                    /* Opciones del modal */
                    // header: action['payload'] === undefined ? 'Viajeros frecuentes' : 'Viajeros frecuentes',
                    width: '63%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    showHeader: false,
                });

            })
        ),
        {
            dispatch: false
        });

    createFrequentTraveler$ = createEffect(() => this.actions$.pipe(
        ofType(FrequentTravelerActions.CREATE_FREQUENTTRAVELER_REQUEST),
        map((action: CreateFrequentTravelerRequest) => action.payload),
        switchMap((frequentTraveler) => {
            return this.apiService.addFrequentTraveler(frequentTraveler).pipe(
                mergeMap((frequentTravelerResolver) => {
                    this.dialogRef.close();
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Viajero agregado exitosamente.' });
                    return [
                        new CreateFrequentTravelerSuccess(frequentTravelerResolver),
                        new GetAllCustomerRequest()
                    ];
                }),
                catchError((err) => of(new CreateFrequentTravelerFailure(err)))
            )
        })
    ));

    DeleteFrequentTraveler$ = createEffect(() => this.actions$.pipe(
        ofType(FrequentTravelerActions.DELETE_FREQUENTTRAVELER_REQUEST),
        map((action: DeleteFrequentTravelerRequest) => action.payload),
        switchMap((FrequentTraveler) => {
            return this.apiService.deleteFrequentTraveler(FrequentTraveler.frequentTravelerId).pipe(
                mergeMap((frequentTravelerResolved) => {
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Viajero eliminado exitosamente.' });
                    return [
                        new DeleteFrequentTravelerSuccess(frequentTravelerResolved),
                        new GetAllCustomerRequest()
                    ];
                }),
                catchError((err) => of(new DeleteFrequentTravelerFailure(err)))
            )
        })
    ));
    //<--------------->

    //<---- EMPLOYEE ---->
    getEmployees$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.GET_ALL_EMPLOYEE_REQUEST),
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

    openModalCreateEmployee = createEffect(() =>
        this.actions$.pipe(
            ofType(employeeActions.OPEN_MODAL_CREATE_EMPLOYEE),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreateEmployeeFormComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '50%',
                    contentStyle: { padding: '1.50rem 2.25rem 1.50rem 2.25rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                })
            })
        ), { dispatch: false });

    createEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.CREATE_EMPLOYEE_REQUEST),
        map((action: CreateEmployeeRequest) => action.payload),
        switchMap((employee) => {
            return this.apiService.addEmployee(employee).pipe(
                mergeMap((employeeResolved) => {
                    this.dialogRef.close();
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Empleado registrado exitosamente.' });
                    return [
                        new CreateEmployeeSuccess(employeeResolved),
                        new GetAllEmployeeRequest()
                    ];
                }),
                catchError((err) => of(new CreateEmployeeFailure(err)))
            )
        })
    ));

    editEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.EDIT_EMPLOYEE_REQUEST),
        map((action: EditEmployeeRequest) => action.payload),
        switchMap((employee) => {
            return this.apiService.updateEmployee(employee.employeeId, employee).pipe(
                mergeMap((employeeResolved) => {
                    this.dialogRef.close();
                    var user = JSON.parse(localStorage.getItem('TokenPayload'))
                    if (employee.userId == user.id) {
                        this.messageService.add({
                            key: 'alert-message',
                            severity: 'success',
                            summary: '¡Proceso completado!',
                            detail: 'Información editada exitosamente.'
                        });
                        window.location.reload();
                    } else {
                        this.messageService.add({
                            key: 'alert-message',
                            severity: 'success',
                            summary: '¡Proceso completado!',
                            detail: 'Empleado editado exitosamente.'
                        });
                    }
                    return [
                        new EditEmployeeSuccess(employeeResolved),
                        new GetAllEmployeeRequest(),
                    ];
                }),
                catchError((err) => of(new EditEmployeeFailure(err)))
            )
        })
    ));

    DeleteEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.DELETE_EMPLOYEE_REQUEST),
        map((action: DeleteEmployeeRequest) => action.payload),
        switchMap((employee) => {
            return this.apiService.deleteEmployee(employee.employeeId).pipe(
                mergeMap((employeeResolved) => {
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Empleado eliminado exitosamente.' });
                    return [
                        new DeleteEmployeeSuccess(employeeResolved),
                        new GetAllEmployeeRequest(),
                    ];
                }),
                catchError((err) => of(new DeleteEmployeeFailure(err)))
            )
        })
    ));
    //<--------------->

    //<---- USERS ---->
    getUsers$ = createEffect(() => this.actions$.pipe(
        ofType(userActions.GET_USERS_REQUEST),
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

    openModalUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.OPEN_MODAL_USER),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreateUserFormComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '50%',
                    contentStyle: { padding: '1.50rem 2.25rem 1.50rem 2.25rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                })
            })
        ), { dispatch: false });

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(userActions.CREATE_USER_REQUEST),
        map((action: CreateUserRequest) => action.payload),
        switchMap((user) => {
            return this.apiService.createUser(user).pipe(
                mergeMap((userResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Usuario registrado exitosamente.' });
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
        ofType(userActions.UPDATE_USER_REQUEST),
        map((action: UpdateUserRequest) => action.payload),
        switchMap((user) => {
            return this.apiService.updateUser(user.userId, user).pipe(
                mergeMap((userResolved) => {
                    this.dialogRef.close();
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Usuario editado exitosamente.' });
                    return [
                        new UpdateUserSuccess(userResolved),
                        new GetUsersRequest(),
                    ]
                }),
                catchError((error) => of(new UpdateUserFailure(error)))
            )
        })
    ));
    //<--------------->

    //<--- LOGIN --->
    login$ = createEffect(() => this.actions$.pipe(
        ofType(loginActions.LOGIN_REQUEST),
        map((action: LoginRequest) => action.payload),
        switchMap((data) => {
            return this.apiService.signIn(data.email, data.password).pipe(
                mergeMap((token) => {
                    return [new LoginSuccess(token)]

                }),
                catchError((error) => of(new LoginFailure(error))))
        })
    ))

    getUserInfo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.GET_USER_INFO_REQUEST),
            map((action: LoginRequest) => action.payload),
            switchMap((response) => {
                return this.authService.getUserInfo(response).pipe(
                    mergeMap((data) => {
                        return [new GetUserInfoSuccess(data)]

                    }),
                    catchError((error) => of(new GetUserInfoFailure(error))))
            })

        )
    )

    recoverPassword$ = createEffect(() => this.actions$.pipe(
        ofType(loginActions.RECOVER_PASSWORD_REQUEST),
        map((action: RecoverPasswordRequest) => action.payload),
        switchMap((recoverPasswordEmail) => {
            return this.apiService.recoverPassword(recoverPasswordEmail).pipe(
                mergeMap((data) => {
                    return [new RecoverPasswordSuccess(data)]

                }),
                catchError((error) => of(new RecoverPasswordFailure(error))))
        })
    ))

    saveCurrentUser$ = createEffect(() => this.actions$.pipe(
        ofType(loginActions.SAVE_CURRENT_USER_REQUEST),
        map((action: SaveCurrentUserRequest) => action.payload),
        mergeMap((data) => {
            return [new SaveCurrentUserSuccess(data)]

        }),
        catchError((error) => of(new SaveCurrentUserFailure(error)))
    ))

    openModalChangePassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.OPEN_MODAL_CHANGE_PASSWORD),
            tap((action) => {
                this.dialogRef = this.dialogService.open(ChangePasswordComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '40%',
                    contentStyle: { padding: '3rem 1rem 3rem 1rem', overflowY: 'auto' },
                });
            })
        ),
        {
            dispatch: false
        }
    )

    changePassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.CHANGE_PASSWORD_REQUEST),
            map((action: ChangePasswordRequest) => action.payload),
            switchMap((response) => {
                return this.apiService.changePassword(response).pipe(
                    mergeMap((data) => {
                        return [new ChangePasswordSuccess(data), new SaveCurrentUserRequest(data.result)];
                    }),
                    catchError((error) => of(new ChangePasswordFailure(error))))
            })
        )
    )
    //<--------------->

    //<--- Contact Us --->

    contactUs$ = createEffect(() => this.actions$.pipe(
        ofType(contactUsActions.CONTACTUS_REQUEST),
        map((action: ContactUsRequest) => action.payload),
        switchMap((PQRSEmail) => {
            return this.apiService.sendPQRS(PQRSEmail).pipe(
                mergeMap((data) => {
                    return [new ContactUsSuccess(data)]
                }),
                catchError((error) => of(new ContactUsFailure(error))))
        })
    ))

    //<----------------------------->
    constructor(
        private actions$: Actions,
        private apiService: ApiService,
        private authService: AuthService,
        private dialogService: DialogService,
        private messageService: MessageService
    ) { }

}
