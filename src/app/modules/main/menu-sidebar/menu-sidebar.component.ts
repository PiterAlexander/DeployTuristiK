import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { Observable } from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui: Observable<UiState>;
  public user;
  public menu = MENU;

  constructor(
    public appService: AppService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
    });
    this.user = this.appService.user;
  }
}

export const MENU = [
  {
    name: 'Dashboard',
    iconClasses: 'fas fa-tachometer-alt',
    path: ['/']
  },
  {
    name: 'Configuración',
    iconClasses: 'fas fa-cog',
    children: [
      {
        name: 'Roles',
        iconClasses: 'far fa-circle',
        path: ['/roles']
      },
      {
        name: 'Usuarios',
        iconClasses: 'far fa-circle',
        path: ['']
      }
    ]
  },
  {
    name: 'Empleados',
    iconClasses: 'far fas fa-user-alt',
    path: ['/employees']
  },
  {
    name: 'Clientes',
    iconClasses: 'far fas fa-user-friends',
    path: ['/costumers']
  },
  {
    name: 'Calendario',
    iconClasses: 'far fa-calendar-alt',
    path: ['']
  },
  {
    name: 'Paquetes',
    iconClasses: 'far fa-image',
    path: ['/packages']
  },
  {
    name: 'Pedidos',
    iconClasses: 'fas fa-columns',
    path: ['']
  }
];
