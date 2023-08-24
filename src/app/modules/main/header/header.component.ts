import { Permission } from '@/models/permission';
import { Role } from '@/models/role';
import { AppState } from '@/store/state';
import {
    GetAllPermissionsRequest,
    GetAllRoleRequest,
    ToggleSidebarMenu
} from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { Observable } from 'rxjs';

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
    public menu = MENU;
    public roleList: Array<Role>;
    public permissionList: Array<Permission>;
    public route = 'Dashboard';
    constructor(
        private appService: AppService,
        private store: Store<AppState>,
        private router: Router
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

            this.allowMenuItems();

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
                console.log(currentRoute)
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
                } else {
                    this.route = currentRoute;
                }
            }
        });
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
                if (this.role === 'Cliente' && mutableItem.name === 'Mis Beneficiarios') {
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
        name: 'Mis Beneficiarios',
        iconClasses: 'bx bx-calendar-week',
        path: ['/Home/MisBeneficiarios'],
        allowed: false
    }
];
