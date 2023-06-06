import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateUserRequest, UpdateUserRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserFormComponent implements OnInit {

  formGroup: FormGroup;
  public ui: Observable<UiState>
  public ActionTitle: string = "Agregar"
  public rolesList: Array<Role>
  public allUsers: Array<User>
  public userData

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  ngOnInit() {

    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allUsers = state.allUsers.data
      this.userData = state.currentUser.data
      this.rolesList = state.allRoles.data
    })


    this.formGroup = this.fb.group({
      userId: [null],
      userName: [null,
        [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20)]
      ],
      role: [null, Validators.required],
      email: [null,
        [Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
      ],
      password: [null,
        [Validators.required,
        Validators.minLength(8)]
      ],
      status: [0, Validators.required]
    })


    if (this.userData != null) {

      this.ActionTitle = "Editar"
      this.formGroup.setValue({
        userId: this.userData.userId,
        userName: this.userData.userName,
        role: this.userData.roleId,
        email: this.userData.email,
        password: this.userData.password,
        status: this.userData.status,
      })
    }
  }

  saveChanges() {

    if (this.userData == null) {
      const model: User = {
        userName: this.formGroup.value.userName,
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: this.formGroup.value.status,
        roleId: this.formGroup.value.role
      }
      this.store.dispatch(new CreateUserRequest({
        ...model
      }));
    } else {
      const model: User = {
        userId: this.formGroup.value.userId,
        userName: this.formGroup.value.userName,
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: this.formGroup.value.status,
        roleId: this.formGroup.value.role
      }
      this.store.dispatch(new UpdateUserRequest({
        ...model,
      }))
    }

  }

  validForm(): boolean {
    if (this.userData == null) {
      return this.formGroup.valid
        && this.formGroup.value.status != 0
        && !this.allUsers.find(u => u.userName === this.formGroup.value.userName || u.email === this.formGroup.value.email)
        && this.rolesList.find(r => r.roleId === this.formGroup.value.role) != null
    } else {
      return this.formGroup.valid
        && this.formGroup.value.status != 0
        && !this.allUsers.find(u => u.userName === this.formGroup.value.userName && u.userId != this.formGroup.value.userId)
        && !this.allUsers.find(u => u.email === this.formGroup.value.email && u.userId != this.formGroup.value.userId)
    }
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
