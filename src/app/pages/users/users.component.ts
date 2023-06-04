import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { GetUsersRequest, OpenModalUser } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  public ui: Observable<UiState>
  public userList: Array<User>
  public filteredUsersList: Array<User>
  public rolesList: Array<Role>
  public loading: boolean;
  public search: string
  public total: number


  private _state: State = {
    page: 1,
    pageSize: 5,
  }

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new GetUsersRequest())

    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.userList = state.allUsers.data
      this.loading = state.allUsers.loading
      this.rolesList = state.allRoles.data
      this.searchByUserName();
    });
  }

  matches(userResolved: User, term: string, pipe: PipeTransform) {
    return (
      userResolved.userName.toLowerCase().includes(term.toLowerCase())
    );
  }

  openCreateUserModal(user?: User) {
    this.store.dispatch(new OpenModalUser())
  }

  openUpdateUserModal(user: User) {
    this.store.dispatch(new OpenModalUser(user))
  }

  searchByUserName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredUsersList = this.userList;
      this.total = this.userList.length;
      this.filteredUsersList = this.filteredUsersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredUsersList = this.userList.filter(user => user.userName.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredUsersList.length;
      this.filteredUsersList = this.filteredUsersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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
    this.searchByUserName();
  }

}
