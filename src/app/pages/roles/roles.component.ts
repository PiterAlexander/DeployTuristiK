import { AppState } from '@/store/state';
import {GetAllRoleRequest,GetAllPermissionsRequest, OpenModalCreateRole, GetUsersRequest } from '@/store/ui/actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Role } from '@/models/role';
import { DeleteRoleRequest } from '../../store/ui/actions';
import { User } from '@/models/user';

//<--------PRIMENG----------->
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '@services/api.service';

interface State{
  page:number;
  pageSize:number;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit{

  public ui:Observable<UiState>
  public roleList:Array<Role>
  public filteredRolesList: Array<Role>
  public userList: Array<User>
  public loading: boolean;
  public search: string
  public total: number
  public statuses: any[]=[]

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  checked2: boolean = true;
  constructor(
    private store: Store<AppState>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private apiService : ApiService,
  ){}

  ngOnInit() {
    this.store.dispatch(new GetAllPermissionsRequest())
    this.store.dispatch(new GetAllRoleRequest())
    this.store.dispatch(new GetUsersRequest())

    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.roleList = state.allRoles.data,
      this.loading = state.allRoles.loading,
      this.userList = state.allUsers.data

      this.searchByName();
    });
    this.statuses = [
      {name: 'Activo', code: 1},
      {name: 'Inactivo', code: 2},
    ];
  }

  matches(roleResolved: Role, term: string) {
    return (
      roleResolved.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  openCreateRoleModal(){
    this.store.dispatch(new OpenModalCreateRole());
  }

  async openEditRoleModal(role:Role){
    const ok = await new Promise((resolve, reject) => {
      this.apiService.getRoleById(role.roleId).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        }
      });
    });

    const roleEdit: Role ={
      roleId: ok['roleId'],
      name: ok['name'],
      status: ok['status'],
      associatedPermission : ok['associatedPermission'],
      user: ok['user'],
    }

    if (ok) {
      this.store.dispatch(new OpenModalCreateRole(roleEdit));
    }

  }

  deleteRole(role:Role){

    var rolesNoPermitidosbyName = [
      'Administrador',
      'Empleado',
      'Beneficiario',
      'Cliente'
    ]

    var ok = true
    rolesNoPermitidosbyName.forEach(name=>{
      if (role.name==name) {
        ok = false
      }
    })

    if(ok){
      const usersAssociated = this.userList.find(u=>u.roleId == role.roleId)

      if (usersAssociated) {
        this.messageService.add({key: 'alert-message', severity:'warn', summary: 'Acción denegada', detail: 'El rol tiene usuarios asociados.'});
      }else{
        this.confirmationService.confirm({
          message: '¿Estás seguro de eliminar a ' + role.name + '?',
          header: 'Confirmación', // Cambia el encabezado del cuadro de confirmación
          icon: 'pi pi-exclamation-triangle', // Cambia el icono del cuadro de confirmación
          acceptLabel: 'Aceptar', // Cambia el texto del botón de aceptar
          rejectLabel: 'Cancelar', // Cambia el texto del botón de rechazar
          acceptButtonStyleClass: 'p-button-primary p-button-sm', // Agrega una clase CSS al botón de aceptar
          rejectButtonStyleClass: 'p-button-outlined p-button-sm', // Agrega una clase CSS al botón de rechazar
          accept: () => {
            // Lógica para confirmar
            this.store.dispatch(new DeleteRoleRequest(role));
          },
          reject: () => {
            // Lógica para rechazar
          }
        });

      }
    }else{
      this.messageService.add({key: 'alert-message', severity:'warn', summary: 'Acción denegada', detail: 'El rol no puede ser eliminado'});
    }

  }


  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredRolesList = this.roleList;
      this.total = this.filteredRolesList.length;
      this.filteredRolesList = this.filteredRolesList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredRolesList = this.roleList.filter(packageModel => packageModel.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredRolesList.length;
      this.filteredRolesList = this.filteredRolesList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  showStatus(roleStatus:any):string{
    for(let status of this.statuses){
      if (roleStatus === status.code){

        return status.name
      }
    }
  }

  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this.searchByName();
  }

}
