import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { exhaustMap } from 'rxjs/operators';
import {
    CREATE_PACKAGE_REQUEST,
    GET_ALL_PACKAGES_REQUEST,
    GET_ALL_PERMISSIONS_REQUEST,
    OPEN_MODAL_CREATE_PACKAGE,
    OPEN_MODAL_CREATE_ROLE,
    CREATE_ROLE_REQUEST,
    GET_ALL_ROLE_REQUEST,
    EDIT_ROLE_REQUEST,
    CREATE_ASSOCIATEDPERMISSION_REQUEST,
    DELETE_ASSOCIATEDPERMISSION_REQUEST,
    OpenModalCreateRole,
    EDIT_PACKAGE_REQUEST,
    OPEN_MODAL_DETAILS_PACKAGE,
    GET_ONE_PACKAGES_REQUEST,
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
    GetAllFrequentTravelerRequest,
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
} from './actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '@services/api.service';
import { of } from 'rxjs';
import { CreateAssociatedPermissionFailure, CreateAssociatedPermissionRequest, CreateAssociatedPermissionSuccess, CreateCustomerFailure, CreateCustomerRequest, CreateCustomerSuccess, CreateEmployeeFailure, CreateEmployeeRequest, CreateEmployeeSuccess, CreateOrderFailure, CreateOrderRequest, CreateOrderSuccess, CreatePackageFailure, CreatePackageRequest, CreatePackageSuccess, CreatePaymentFailure, CreatePaymentRequest, CreatePaymentSuccess, CreateRoleFailure, CreateRoleRequest, CreateRoleSuccess, CreateUserFailure, CreateUserRequest, CreateUserSuccess, DeleteAssociatedPermissionFailure, DeleteAssociatedPermissionRequest, DeleteAssociatedPermissionSuccess, DeleteEmployeeFailure, DeleteEmployeeRequest, DeleteEmployeeSuccess, DeleteRoleFailure, DeleteRoleRequest, DeleteRoleSuccess, EditCustomerFailure, EditCustomerRequest, EditCustomerSuccess, EditEmployeeFailure, EditEmployeeRequest, EditEmployeeSuccess, EditOrderDetailFailure, EditOrderDetailRequest, EditOrderDetailSuccess, EditOrderFailure, EditOrderRequest, EditOrderSuccess, EditPackageFailure, EditPackageRequest, EditPackageSuccess, EditRoleFailure, EditRoleRequest, EditRoleSuccess, GetAllCustomerFailure, GetAllCustomerRequest, GetAllCustomerSuccess, GetAllEmployeeFailure, GetAllEmployeeRequest, GetAllEmployeeSuccess, GetAllOrdersFailure, GetAllOrdersRequest, GetAllOrdersSuccess, GetAllPackagesFailure, GetAllPackagesRequest, GetAllPackagesSuccess, GetAllPermissionsFailure, GetAllPermissionsSuccess, GetAllRoleFailure, GetAllRoleRequest, GetAllRoleSuccess, GetUsersFailure, GetUsersRequest, GetUsersSuccess, OpenModalPayments, UpdateUserFailure, UpdateUserRequest, UpdateUserSuccess, customerActions, employeeActions, orderActions, packageActions, permissionActions, roleActions, userActions } from './actions';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { CreateOrderFormComponent } from '@components/create-order-form/create-order-form.component';
import { CreateOrderDetailFormComponent } from '@components/create-order-detail-form/create-order-detail-form.component';
import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { DetailsPackageComponent } from '@components/details-package/details-package.component';
import { CreateEmployeeFormComponent } from '@components/create-employee-form/create-employee-form.component';
import { CreateUserFormComponent } from '@components/create-user-form/create-user-form.component';
import { CreatePaymentFormComponent } from '@components/create-payment-form/create-payment-form.component';
import { ReadOrderOrderDetailComponent } from '@components/read-order-order-detail/read-order-order-detail.component';
import { ReadOrderPaymentComponent } from '@components/read-order-payment/read-order-payment.component';
import { AuthService } from '@services/auth/auth.service';
import { ListFrequentTravelerComponent } from '@components/list-frequent-traveler/list-frequent-traveler.component';
import { CreateFrequentTravelerFormComponent } from '@components/create-frequent-traveler-form/create-frequent-traveler-form.component';
import { EditPaymentFormComponent } from '@components/edit-payment-form/edit-payment-form.component';
import { CreatecustomerformComponent } from '@components/create-customer-form/create-customer-form.component';
import { ListFrequentTravelersToOrdersComponent } from '@components/list-frequent-travelers-to-orders/list-frequent-travelers-to-orders.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

//<--------PRIMENG----------->
import { MessageService } from 'primeng/api';

@Injectable()
export class PackageEffects {
    modalRef: NgbModalRef;
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

    // openModalCreatePackage$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(packageActions.OPEN_MODAL_CREATE_PACKAGE),
    //         tap((action) => {
    //             this.modalRef = this.modalService.open(CreatePackageFormComponent, {
    //                 backdrop: false,
    //                 size: 'xl'
    //             });
    //         })
    //     ), { dispatch: false });

    openModalCreatePackage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(packageActions.OPEN_MODAL_CREATE_PACKAGE),
            tap((action: OpenModalCreatePackage) => {
                const ref = this.dialogService.open(CreatePackageFormComponent, {
                    showHeader: false,
                    width: '50%',
                    contentStyle: { 'max-height': '800px', overflow: 'auto', padding: '0px 50px 0px 50px' },
                    baseZIndex: 10000,
                    data: action.payload // Pasar datos opcionales a la modal desde la acción
                });
            })
        ), { dispatch: false }
    );

    openModalDetailsPackage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OPEN_MODAL_DETAILS_PACKAGE),
            tap((action) => {
                this.modalRef = this.modalService.open(DetailsPackageComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });



    createPackage$ = createEffect(() => this.actions$.pipe(
        ofType(packageActions.CREATE_PACKAGE_REQUEST),
        map((action: CreatePackageRequest) => action.payload),
        switchMap((pack) => {
            return this.apiService.addPackage(pack).pipe(

                mergeMap((packageResolved) => {
                    this.dialogRef.close()
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: 'Exito', detail: 'Rol creado exitosamente.' });
                    window.location.reload()
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
                    this.modalRef.close();
                    window.location.reload()
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
                    this.modalRef.close();
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
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: 'Proceso completado', detail: '¡Pedido registrado exitosamente!' });
                    return [
                        new CreateOrderSuccess(orderResolved),
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

    openModalListFrequentTravelersToOrders$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_LIST_FREQUENTTRAVELERS_TO_ORDERS),
            tap((action) => {
                this.modalRef = this.modalService.open(ListFrequentTravelersToOrdersComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    openModalOrderDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_ORDERDETAILS),
            tap((action) => {
                this.dialogRef = this.dialogService.open(ReadOrderOrderDetailComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '70%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                });
            })
        ), { dispatch: false });

    openModalCreateOrderDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_CREATE_ORDERDETAIL),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreateOrderDetailFormComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '80%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                });
            })
        ), { dispatch: false });

    editOrderDetail$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.EDIT_ORDERDETAIL_REQUEST),
        map((action: EditOrderDetailRequest) => action.payload),
        switchMap((orderDetail) => {
            return this.apiService.updateOrderDetail(orderDetail.orderDetailId, orderDetail).pipe(
                mergeMap((orderDetailResolved) => {
                    return [
                        new EditOrderDetailSuccess(orderDetailResolved),
                        new GetAllOrdersRequest()
                    ];
                }),
                catchError((err) => of(new EditOrderDetailFailure(err)))
            )
        })
    ));

    openModalPayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_PAYMENTS),
            tap((action) => {
                this.dialogRef = this.dialogService.open(ReadOrderPaymentComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '70%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    baseZIndex: 10000,
                });
            })
        ), { dispatch: false });

    openModalCreatePayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_CREATE_PAYMENT),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreatePaymentFormComponent, {
                    /* Opciones del modal */
                    showHeader: false,
                    width: '40%',
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                });
            })
        ), { dispatch: false });

    createPayment$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.CREATE_PAYMENT_REQUEST),
        map((action: CreatePaymentRequest) => action.payload),
        switchMap((payment) => {
            return this.apiService.addPayment(payment).pipe(
                mergeMap((paymentResolved) => {
                    this.dialogRef.close()
                    return [
                        new CreatePaymentSuccess(paymentResolved),
                        new GetAllOrdersRequest(),
                        // new OpenModalPayments(paymentResolved.order) 
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
                this.modalRef = this.modalService.open(EditPaymentFormComponent, {
                    backdrop: false,
                    size: 'l'
                });
            })
        ), { dispatch: false });

    editPayment$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.EDIT_PAYMENT_REQUEST),
        map((action: EditPaymentRequest) => action.payload),
        switchMap((payment) => {
            return this.apiService.updatePayment(payment.paymentId, payment).pipe(
                mergeMap((paymentResolved) => {
                    return [
                        new EditPaymentSuccess(paymentResolved),
                        new GetAllOrdersRequest()
                    ];
                }),
                catchError((err) => of(new EditPaymentFailure(err)))
            )
        })
    ));
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
                    header: action['payload'] === undefined ? 'Registrar Rol' : 'Editar Rol',
                    width: '45%',
                    contentStyle: { overflowY: 'auto' },
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
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: 'Exito', detail: 'Rol creado exitosamente.' });
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
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: 'Exito', detail: 'Rol editado exitosamente' });
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
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: 'Exito', detail: 'Rol eliminado exitosamente' });
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
        ofType(permissionActions.DELETE_ASSOCIATEDPERMISSION_REQUEST),
        map((action: DeleteAssociatedPermissionRequest) => action.payload),
        switchMap((asocpermission) => {
            return this.apiService.deleteAssociatedPermission(asocpermission.associatedPermissionId).pipe(
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
                    header: action['payload'] === undefined ? 'Crear cliente' : 'Editar cliente',
                    width: '55%',
                    contentStyle: { overflowY: 'auto' },
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
                    this.modalRef.close();
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
                    contentStyle: { padding: '1.25rem 2rem 1.25rem 2rem', overflowY: 'auto' },
                    showHeader: false,
                    width: '60%',
                });

            })
        ),
        {
            dispatch: false
        });

    createModalTraveler$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FrequentTravelerActions.OPEN_MODAL_CREATE_FREQUENTTRAVELER),
            tap((action) => {
                this.dialogRef = this.dialogService.open(CreateFrequentTravelerFormComponent, {
                    /* Opciones del modal */
                    header: action['payload'] === undefined ? 'Crear frecuentes' : 'Editar frecuentes',
                    width: '60%',
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
                    this.dialogRef.close();
                    return [
                        new DeleteFrequentTravelerSuccess(frequentTravelerResolved),
                        // new GetAllFrequentTravelerRequest(),
                        new GetAllCustomerRequest(),
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
                    header: action['payload'] === undefined ? 'Registrar empleado' : 'Editar empleado',
                    width: '60%',
                });
            })
        ), { dispatch: false });

    createEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.CREATE_EMPLOYEE_REQUEST),
        map((action: CreateEmployeeRequest) => action.payload),
        switchMap((employee) => {
            return this.apiService.addEmployee(employee).pipe(
                mergeMap((employeeResolved) => {
                    this.dialogRef.close();
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
                    header: action['payload'] === undefined ? 'Registrar Usuario' : 'Editar Usuario',
                    width: '45%',
                    contentStyle: { overflowY: 'auto' },
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
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: 'Exito', detail: 'Usuario registrado exitosamente' });
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
                    this.messageService.add({ key: 'alert-message', severity: 'success', summary: 'Exito', detail: 'Usuario editado exitosamente' });
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
                        //console.log(typeof (data))
                        return [new GetUserInfoSuccess(data)]

                    }),
                    catchError((error) => of(new GetUserInfoFailure(error))))
            })

        )
    )
    //<----------------------------->
    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private apiService: ApiService,
        private authService: AuthService,
        private dialogService: DialogService,
        private messageService: MessageService
    ) { }

}
