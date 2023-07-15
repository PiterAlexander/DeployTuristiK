import { Permission } from '@/models/permission';
import { Role } from '@/models/role';
import { AppState } from '@/store/state';
import { GetAllPermissionsRequest, GetAllRoleRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

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
  public roleList:Array<Role>
  public permissionList:Array<Permission>
  public menu = MENU;
  public role;

  constructor(
    public appService: AppService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {

    this.store.dispatch(new GetAllRoleRequest())
    this.store.dispatch(new GetAllPermissionsRequest())

    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.roleList = state.allRoles.data;
      this.permissionList = state.allPermissions.data;

      this.allowMenuItems()

      var user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = user['role']

      if (this.role === 'Cliente') {
        this.classes = '';
      }
      this.classes = `${this.classes} ${state.sidebarSkin}`;
    });
    this.user = this.appService.user;
  }

  allowMenuItems() {

    const user = JSON.parse(localStorage.getItem('TokenPayload'))
    var role = this.roleList.find(r=>r.name === user.role)

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

    this.menu.forEach(item=>{
      permissions.forEach((p) => {
        if (p.module == item.name) {
          item.allowed = true
        }
        if (p.module == "Usuarios" || p.module == "Roles") {
          if (item.name == "Configuración") {
              item.allowed = true
          }
        }
      });
    })
  }

}

export const MENU = [
  {
    name: 'Dashboard',
    iconClasses: 'fas fa-tachometer-alt',
    path: ['/Dashboard'],
    allowed: false
  },
  {
    name: 'Configuración',
    iconClasses: 'fas fa-cog',
    allowed: false,
    children: [
      {
        name: 'Roles',
        iconClasses: 'far fa-circle',
        path: ['/Roles'],
        allowed: false
      },
      {
        name: 'Usuarios',
        iconClasses: 'far fa-circle',
        path: ['/Usuarios'],
        allowed: false
      }
    ]
  },
  {
    name: 'Empleados',
    iconClasses: 'far fas fa-user-alt',
    path: ['/Empleados'],
    allowed: false
  },
  {
    name: 'Clientes',
    iconClasses: 'far fas fa-user-friends',
    path: ['/Clientes'],
    allowed: false
  },
  {
    name: 'Calendario',
    iconClasses: 'far fa-calendar-alt',
    path: ['/Calendario'],
    allowed: false
  },
  {
    name: 'Paquetes',
    iconClasses: 'far fa-image',
    path: ['/Paquetes'],
    allowed: false
  },
  {
    name: 'Pedidos',
    iconClasses: 'fas fa-columns',
    path: ['/Pedidos'],
    allowed: false
  }
];
