import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { GetAllRoleRequest, GetUsersRequest, OpenModalUser } from '@/store/ui/actions';
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
  public loading: boolean;
  public statuses: any[]=[]


  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new GetUsersRequest())
    this.store.dispatch(new GetAllRoleRequest())

    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.userList = state.allUsers.data
      this.loading = state.allUsers.loading
    });

    this.statuses = [
      {name: 'Activo', code: 1},
      {name: 'Inactivo', code: 2},
    ];
  }
  showStatus(userStatus:any):string{
    for(let status of this.statuses){
      if (userStatus === status.code){

        return status.name
      }
    }
  }
  openCreateUserModal() {
    this.store.dispatch(new OpenModalUser())
  }

  openUpdateUserModal(user: User) {
    this.store.dispatch(new OpenModalUser(user))
  }


}
