import {Permission} from '@/models/permission';
import {Role} from '@/models/role';
import {AppState} from '@/store/state';
import {
    GetAllPermissionsRequest,
    GetAllRoleRequest,
    ToggleSidebarMenu
} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import {Observable} from 'rxjs';
import {NavigationEnd, Router, RouterModule} from '@angular/router';

var BASE_CLASSES = 'main-sidebar elevation-4 sidebar-light';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public roleList: Array<Role>;
    public permissionList: Array<Permission>;
    public menu = MENU;
    public role;

    constructor(
        public appService: AppService,
        private store: Store<AppState>,
        private router: Router
    ) {}

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
    }
    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }
    allowMenuItems() {
        const user = JSON.parse(localStorage.getItem('TokenPayload'));
        var role = this.roleList.find((r) => r.name === user.role);
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

        this.menu.forEach((item) => {
            permissions.forEach((p) => {
                if (p.module == item.name) {
                    item.allowed = true;
                }
            });
        });
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
];
