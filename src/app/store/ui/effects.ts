import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '@services/api.service';
import { of } from 'rxjs';
import { CreateAssociatedPermissionFailure, CreateAssociatedPermissionRequest, CreateAssociatedPermissionSuccess, CreateCostumerFailure, CreateCostumerRequest, CreateCostumerSuccess, CreateEmployeeFailure, CreateEmployeeRequest, CreateEmployeeSuccess, CreateOrderFailure, CreateOrderRequest, CreateOrderSuccess, CreatePackageFailure, CreatePackageRequest, CreatePackageSuccess, CreateRoleFailure, CreateRoleRequest, CreateRoleSuccess, CreateUserFailure, CreateUserRequest, CreateUserSuccess, DeleteAssociatedPermissionFailure, DeleteAssociatedPermissionRequest, DeleteAssociatedPermissionSuccess, DeleteEmployeeFailure, DeleteEmployeeRequest, DeleteEmployeeSuccess, EditCostumerFailure, EditCostumerRequest, EditCostumerSuccess, EditEmployeeFailure, EditEmployeeRequest, EditEmployeeSuccess, EditPackageFailure, EditPackageRequest, EditPackageSuccess, EditRoleFailure, EditRoleRequest, EditRoleSuccess, GetAllCostumerFailure, GetAllCostumerRequest, GetAllCostumerSuccess, GetAllEmployeeFailure, GetAllEmployeeRequest, GetAllEmployeeSuccess, GetAllOrdersFailure, GetAllOrdersRequest, GetAllOrdersSuccess, GetAllPackagesFailure, GetAllPackagesRequest, GetAllPackagesSuccess, GetAllPermissionsFailure, GetAllPermissionsSuccess, GetAllRoleFailure, GetAllRoleRequest, GetAllRoleSuccess, GetUserInfoFailure, GetUserInfoSuccess, GetUsersFailure, GetUsersRequest, GetUsersSuccess, LoginFailure, LoginRequest, LoginSuccess, UpdateUserFailure, UpdateUserRequest, UpdateUserSuccess, costumerActions, employeeActions, loginActions, orderActions, packageActions, permissionActions, roleActions, userActions } from './actions';
import {  DeleteRoleFailure, DeleteRoleRequest, DeleteRoleSuccess } from './actions';
import { CreatePaymentFailure, CreatePaymentRequest, CreatePaymentSuccess, OpenModalPayments} from './actions';
import { CreatePackageFormComponent } from '@components/create-package-form/create-package-form.component';
import { CreateOrderFormComponent } from '@components/create-order-form/create-order-form.component';
import { CreateOrderDetailFormComponent } from '@components/create-order-detail-form/create-order-detail-form.component';
import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { PermissionService } from '@services/configuration/permission.service';
import { RoleService } from '@services/configuration/role.service';
import { AssociatedPermissionService } from '@services/configuration/associated-permission.service';
import { CreatecostumerformComponent } from '@components/createcostumerform/createcostumerform.component';
import { CreateEmployeeFormComponent } from '@components/create-employee-form/create-employee-form.component';
import { CreateUserFormComponent } from '@components/create-user-form/create-user-form.component';
import { CreatePaymentFormComponent } from '@components/create-payment-form/create-payment-form.component';
import { ReadOrderOrderDetailComponent } from '@components/read-order-order-detail/read-order-order-detail.component';
import { ReadOrderPaymentComponent } from '@components/read-order-payment/read-order-payment.component';
import { AuthService } from '@services/auth/auth.service';

@Injectable()
export class PackageEffects {
    modalRef: NgbModalRef;

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

    openModalCreatePackage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(packageActions.OPEN_MODAL_CREATE_PACKAGE),
            tap((action) => {
                this.modalRef = this.modalService.open(CreatePackageFormComponent, {
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
        ofType(packageActions.EDIT_PACKAGE_REQUEST),
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
                catchError((err) => of(new EditPackageFailure(err)))
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
                this.modalRef = this.modalService.open(CreateOrderFormComponent, {
                    backdrop: false,
                    size: 'lg'
                });
            })
        ), { dispatch: false });

    createOrder$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.CREATE_ORDER_REQUEST),
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

    openModalOrderDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_ORDERDETAILS),
            tap((action) => {
                this.modalRef = this.modalService.open(ReadOrderOrderDetailComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    openModalCreateOrderDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_CREATE_ORDERDETAIL),
            tap((action) => {
                this.modalRef = this.modalService.open(CreateOrderDetailFormComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    openModalPayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_PAYMENTS),
            tap((action) => {
                this.modalRef = this.modalService.open(ReadOrderPaymentComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    openModalCreatePayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(orderActions.OPEN_MODAL_CREATE_PAYMENT),
            tap((action) => {
                this.modalRef = this.modalService.open(CreatePaymentFormComponent, {
                    backdrop: false,
                    size: 'xl'
                });
            })
        ), { dispatch: false });

    createPayment$ = createEffect(() => this.actions$.pipe(
        ofType(orderActions.CREATE_PAYMENT_REQUEST),
        map((action: CreatePaymentRequest) => action.payload),
        switchMap((payment) => {
            return this.apiService.addPayment(payment).pipe(
                mergeMap((paymentResolved) => {
                    this.modalRef.close();
                    return [
                        new CreatePaymentSuccess(paymentResolved),
                        new GetAllOrdersRequest(),
                    ];
                }),
                catchError((err) => of(new CreatePaymentFailure(err)))
            )
        })
    ));
    //<----------------------------->

    //<--- ROLES AND PERMISSIONS --->
    getRoles$ = createEffect(() => this.actions$.pipe(
        ofType(roleActions.GET_ALL_ROLE_REQUEST),
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

    openModalCreateRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(roleActions.OPEN_MODAL_CREATE_ROLE),
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

    createRole$ = createEffect(() => this.actions$.pipe(
        ofType(roleActions.CREATE_ROLE_REQUEST),
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

    editRole$ = createEffect(() => this.actions$.pipe(
        ofType(roleActions.EDIT_ROLE_REQUEST),
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

    deleteRole$ = createEffect(() => this.actions$.pipe(
        ofType(roleActions.DELETE_ROLE_REQUEST),
        map((action: DeleteRoleRequest) => action.payload),
        switchMap((role) => {
            return this.roleService.DeleteRole(role.roleId).pipe(
                mergeMap((roleResolved) => {
                    return [
                        new DeleteRoleSuccess(roleResolved),
                        new GetAllRoleRequest(),
                    ];
                }),
                catchError((err) => of(new DeleteRoleFailure(err)))
            )
        })
    ))

    getPermissions$ = createEffect(() => this.actions$.pipe(
        ofType(permissionActions.GET_ALL_PERMISSIONS_REQUEST),
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

    createAssociatedPermission$ = createEffect(() => this.actions$.pipe(
        ofType(permissionActions.CREATE_ASSOCIATEDPERMISSION_REQUEST),
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
        ofType(permissionActions.DELETE_ASSOCIATEDPERMISSION_REQUEST),
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
    //<------------------->

    //<---- COSTUMERS ---->
    getCostumers$ = createEffect(() => this.actions$.pipe(
        ofType(costumerActions.GET_ALL_COSTUMER_REQUEST),
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

    openModalCreateCostumer = createEffect(() =>
        this.actions$.pipe(
            ofType(costumerActions.OPEN_MODAL_CREATE_COSTUMER),
            tap((action) => {
                this.modalRef = this.modalService.open(CreatecostumerformComponent, {
                    backdrop: false,
                    size: 'lg'
                });
            })
        ), { dispatch: false });

    createCostumer$ = createEffect(() => this.actions$.pipe(
        ofType(costumerActions.CREATE_COSTUMER_REQUEST),
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
    editCostumer$ = createEffect(() => this.actions$.pipe(
        ofType(costumerActions.EDIT_COSTUMER_REQUEST),
        map((action: EditCostumerRequest) => action.payload),
        switchMap((costumer) => {
            return this.apiService.updateCostumer(costumer.costumerId, costumer).pipe(
                mergeMap((costumerResolved) => {
                    this.modalRef.close();
                    return [
                        new EditCostumerSuccess(costumerResolved),
                        new GetAllCostumerRequest(),
                    ];
                }),
                catchError((err) => of(new EditCostumerFailure(err)))
            )
        })
    ));
    //<------------------>

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
                this.modalRef = this.modalService.open(CreateEmployeeFormComponent, {
                    backdrop: false,
                    size: 'lg'
                });
            })
        ), { dispatch: false });

    createEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.CREATE_EMPLOYEE_REQUEST),
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
    editEmployee$ = createEffect(() => this.actions$.pipe(
        ofType(employeeActions.EDIT_EMPLOYEE_REQUEST),
        map((action: EditEmployeeRequest) => action.payload),
        switchMap((employee) => {
            return this.apiService.updateEmployee(employee.employeeId, employee).pipe(
                mergeMap((employeeResolved) => {
                    this.modalRef.close();
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
            tap(() => {
                this.modalRef = this.modalService.open(CreateUserFormComponent, {
                    backdrop: false,
                    size: 'lg'
                })
            })
        ), { dispatch: false });

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(userActions.CREATE_USER_REQUEST),
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
        ofType(userActions.UPDATE_USER_REQUEST),
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
    //<--------------->
    //<--- LOGIN --->
    login$ = createEffect(() => this.actions$.pipe(
        ofType(loginActions.LOGIN_REQUEST),
        map((action: LoginRequest) => action.payload),
        switchMap((data) => {
            //console.log(data)
            return this.apiService.signIn(data.email, data.password).pipe(
                mergeMap((token) => {
                    //console.log(typeof (token))
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
                        console.log(typeof (data))
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
        private apiPermission: PermissionService,
        private roleService: RoleService,
        private assocPermissionService: AssociatedPermissionService,
        private authService: AuthService,
    ) { }
}
