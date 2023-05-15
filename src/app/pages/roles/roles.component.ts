import { AppState } from '@/store/state';
import { OpenModalCreateRole } from '@/store/ui/actions';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {

  constructor(private store: Store<AppState>){}

  openCreateRoleModal(){
    this.store.dispatch(new OpenModalCreateRole());
  }
}
