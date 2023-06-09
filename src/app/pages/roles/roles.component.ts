import { AppState } from '@/store/state';
import {GetAllRoleRequest,GetAllPermissionsRequest, OpenModalCreateRole } from '@/store/ui/actions';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Role } from '@/models/role';
import Swal from 'sweetalert2';
import { DeleteRoleRequest } from '../../store/ui/actions';


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

    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.roleList = state.allRoles.data,
      this.loading = state.allRoles.loading
      this.searchByName();
    });
  }

  matches(roleResolved: Role, term: string, pipe: PipeTransform) {
    return (
      roleResolved.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  openCreateRoleModal(role?:Role){

    this.store.dispatch(new OpenModalCreateRole());
  }

  openEditRoleModal(role:Role){
    this.store.dispatch(new OpenModalCreateRole(role));
  }


  deleteRole(role:Role){

    // var rolesNoPermitidos = [
    //   '53a148f0-2206-430c-c935-08db66f03c2d',
    //   'cb89f0c5-356f-47ab-c936-08db66f03c2d',
    //   'a27440ba-85ec-4fab-c937-08db66f03c2d',
    //   'd2357f46-38a1-4249-c938-08db66f03c2d'
    // ]

    // var ok = true
    // rolesNoPermitidos.forEach(id=>{
    //   if (role.roleId==id) {
    //     ok = false
    //   }
    // })

    // if(ok){
    //   this.store.dispatch(new DeleteRoleRequest(role))
    // }else{
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'El rol '+role.name+' no puede ser eliminado del sistema',
    //     showConfirmButton: true,
    //   }).then(function(){})
    // }


    //OPCION 2
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
      if (role.user.length>0) {
        Swal.fire({
          icon: 'warning',
          title: 'El rol '+role.name+' tiene usuarios asociados.No puede ser eliminado del sistema.',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
        }).then(function(){})
      }else{
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        Swal.fire({
          title: '¿Estás seguro de eliminar a '+role.name+'?',
          text: "No podrás revertirlo.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar'
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
