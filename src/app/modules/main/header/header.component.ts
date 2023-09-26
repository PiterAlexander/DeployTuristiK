import { Package } from '@/models/package';
import { Permission } from '@/models/permission';
import { Role } from '@/models/role';
import { AppState } from '@/store/state';
import {
    GetAllPermissionsRequest,
    GetAllRoleRequest,
    SaveOrderProcess,
    ToggleSidebarMenu
} from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { Observable } from 'rxjs';
import { ApiService } from '@services/api.service';

var BASE_CLASSES = 'main-header navbar navbar-expand';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: UntypedFormGroup;
    public role;
    public isStyleActive: boolean;
    public user;
    public orderProcess: any
    public menu = MENU;
    public client = true;
    public roleList: Array<Role>;
    public permissionList: Array<Permission>;
    public route = 'Dashboard';
    constructor(
        private appService: AppService,
        private store: Store<AppState>,
        private router: Router,
        private apiService: ApiService,
    ) { }

    onProfileButtonClick() {
        this.appService.showProfileSidebar();
    }

    ngOnInit() {
        this.store.dispatch(new GetAllRoleRequest());
        this.store.dispatch(new GetAllPermissionsRequest());

        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.roleList = state.allRoles.data;
            this.permissionList = state.allPermissions.data;
            this.orderProcess = state.orderProcess.data
            this.allowMenuItems();
            if (this.role == 'Administrador') {
                this.client == true
            }
            var user = JSON.parse(localStorage.getItem('TokenPayload'));
            this.role = user['role'];

            if (this.role === 'Cliente') {
                this.classes = '';
            }
            this.classes = `${this.classes} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const currentRoute = this.getCurrentRoute(event.url);
                if (currentRoute === 'RegistrarPedido') {
                    this.route = 'Pedidos / Registrar Pedido'
                } else if (currentRoute === 'DetallesPedido') {
                    this.route = 'Pedidos / Detalles del Pedido'
                } else if (currentRoute === 'ProcesoBeneficiarios') {
                    this.route = 'Pedidos / Proceso de Beneficiarios'
                } else if (currentRoute === 'ProcesoAbonos') {
                    this.route = 'Pedidos / Proceso de Abonos'
                } else if (currentRoute === 'DetallesAbono') {
                    this.route = 'Pedidos / Detalles del Abono'
                } else if (currentRoute === 'RevisionAbono') {
                    this.route = 'Pedidos / Revisión de Abono'
                } else {
                    this.route = currentRoute;
                    this.editPackage()
                }
            }
        });
    }

    async editPackage() {
        if (this.orderProcess !== undefined) {
            console.log(this.orderProcess);
            if (this.orderProcess.order !== undefined) {
                if (this.orderProcess.order.takenQuotas !== undefined) {
                    const takenQuotas = this.orderProcess.order.takenQuotas
                    let onePackage: Package
                    if (this.orderProcess.action === 'CreateOrder') {
                        onePackage = this.orderProcess.order.package
                    } else if (this.orderProcess.action === 'CreateOrderDetail') {
                        onePackage = this.orderProcess.order.order.package
                    }
                    if (onePackage !== undefined) {
                        const packagePromise: Package = await new Promise((resolve, reject) => {
                            this.apiService.getPackageById(onePackage.packageId).subscribe({
                                next: (data) => {
                                    resolve(data)
                                },
                                error: (err) => {
                                    reject(err)
                                }
                            })
                        })
                        if (packagePromise) {
                            const onePackage = {
                                packageId: packagePromise['packageId'],
                                name: packagePromise['name'],
                                destination: packagePromise['destination'],
                                details: packagePromise['details'],
                                transport: packagePromise['transport'],
                                hotel: packagePromise['hotel'],
                                arrivalDate: packagePromise['arrivalDate'],
                                departureDate: packagePromise['departureDate'],
                                departurePoint: packagePromise['departurePoint'],
                                totalQuotas: packagePromise['totalQuotas'],
                                availableQuotas: packagePromise['availableQuotas'],
                                price: packagePromise['price'],
                                type: packagePromise['type'],
                                status: packagePromise['status'],
                                aditionalPrice: packagePromise['aditionalPrice'],
                                photos: packagePromise['photos']
                            }
                            const updatePackage: Package = {
                                packageId: onePackage.packageId,
                                name: onePackage.name,
                                destination: onePackage.destination,
                                details: onePackage.details,
                                transport: onePackage.transport,
                                hotel: onePackage.hotel,
                                arrivalDate: onePackage.arrivalDate,
                                departureDate: onePackage.departureDate,
                                departurePoint: onePackage.departurePoint,
                                totalQuotas: onePackage.totalQuotas,
                                availableQuotas: onePackage.availableQuotas + takenQuotas,
                                price: onePackage.price,
                                type: onePackage.type,
                                status: onePackage.status,
                                aditionalPrice: onePackage.aditionalPrice,
                                photos: onePackage.photos
                            }
                            this.apiService.updatePackage(updatePackage.packageId, updatePackage).subscribe({
                                next: (data) => {
                                },
                                error: (err) => {
                                    console.log("Error while updating: ", err)
                                }
                            })
                            this.store.dispatch(new SaveOrderProcess(undefined))
                        }
                    }
                }
            }
        }
    }

    getCurrentRoute(url: string): string {
        const routeParts = url.split('/').filter((part) => part !== '');
        if (routeParts.length === 1) {
            return 'Home';
        }
        return routeParts[1];
    }

    allowMenuItems() {
        const user = JSON.parse(localStorage.getItem('TokenPayload'));
        const role = this.roleList.find((r) => r.name === user.role);

        const permissions = [];
        if (role) {
            for (const item of this.permissionList) {
                for (const associatedPermission of item.associatedPermission) {
                    if (associatedPermission.roleId === role.roleId) {
                        permissions.push(item);
                        break;
                    }
                }
            }
        }

        this.menu = this.menu.map((item) => {
            const mutableItem = { ...item };
            permissions.forEach((p) => {
                if (p.module === mutableItem.name) {
                    mutableItem.allowed = true;
                }
                if (this.role === 'Cliente' && mutableItem.name === 'Mis Viajeros') {
                    mutableItem.allowed = true;
                }
                if (p.module === 'Usuarios' || p.module === 'Roles') {
                    if (mutableItem.name === 'Configuración') {
                        mutableItem.allowed = true;
                    }
                }
            });
            return mutableItem;
        });
    }
    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }
}

export const MENU = [
    {
        name: 'Dashboard',
        iconClasses: 'bx bx-bar-chart-alt-2',
        path: ['/Home/Dashboard'],
        allowed: false
    },
    {
        name: 'Roles',
        iconClasses: 'bx bx-cog',
        path: ['/Home/Roles'],
        allowed: false
    },
    {
        name: 'Usuarios',
        iconClasses: 'bx bx-lock',
        path: ['/Home/Usuarios'],
        allowed: false
    },
    {
        name: 'Empleados',
        iconClasses: 'bx bx-user-circle',
        path: ['/Home/Empleados'],
        allowed: false
    },
    {
        name: 'Clientes',
        iconClasses: 'bx bx-group',
        path: ['/Home/Clientes'],
        allowed: false
    },
    {
        name: 'Calendario',
        iconClasses: 'bx bx-calendar-event',
        path: ['/Home/Calendario'],
        allowed: false
    },
    {
        name: 'Paquetes',
        iconClasses: 'bx bx-package',
        path: ['/Home/Paquetes'],
        allowed: false
    },
    {
        name: 'Pedidos',
        iconClasses: 'bx bx-calendar-week',
        path: ['/Home/Pedidos'],
        allowed: false
    },
    {
        name: 'Mis Viajeros',
        iconClasses: 'bx bx-calendar-week',
        path: ['/Home/MisBeneficiarios/000'],
        allowed: false
    }
];
