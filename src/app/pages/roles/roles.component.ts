import { AppState } from '@/store/state';
import {GetAllRoleRequest,GetAllPermissionsRequest, OpenModalCreateRole, GetUsersRequest } from '@/store/ui/actions';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Role } from '@/models/role';
import Swal from 'sweetalert2';
import { DeleteRoleRequest } from '../../store/ui/actions';
import { User } from '@/models/user';


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

  private _state: State = {
    page: 1,
    pageSize: 5
  };


  constructor(private store: Store<AppState>){}

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
  }

  matches(roleResolved: Role, term: string, pipe: PipeTransform) {
    return (
      roleResolved.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  openCreateRoleModal(){
    this.store.dispatch(new OpenModalCreateRole());
  }

  openEditRoleModal(role:Role){
    this.store.dispatch(new OpenModalCreateRole(role));
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
        Swal.fire({
          icon: 'warning',
          title: 'El rol '+role.name+' tiene usuarios asociados.No puede ser eliminado del sistema.',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
        }).then(function(){})
      }else{

        Swal.fire({
          title: '¿Estás seguro de eliminar a '+role.name+'?',
          text: "No podrás revertirlo.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, eliminar',
          reverseButtons: true,
          customClass: {
            confirmButton: 'swal2-confirm-right',
            cancelButton: 'swal2-cancel-left'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.store.dispatch(new DeleteRoleRequest(role))
            Swal.fire(
              'Eliminado con éxito.',
            )
          }
        })
      }
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'El rol '+role.name+' no puede ser eliminado del sistema.',
        showConfirmButton: true,
      }).then(function(){})
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
