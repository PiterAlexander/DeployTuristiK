import { AppState } from '@/store/state';
import {GetAllRoleRequest,GetAllPermissionsRequest, OpenModalCreateRole } from '@/store/ui/actions';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Role } from '@/models/role';


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
