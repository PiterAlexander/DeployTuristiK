import { Customer } from '@/models/customer';
import { Employee } from '@/models/employee';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateUserRequest, UpdateUserRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserFormComponent implements OnInit {

  formGroup: FormGroup;
  public ui: Observable<UiState>
  public rolesList: Array<Role>
  public allRoles: Array<Role>

  public allUsers: Array<User>
  public model: User
  public userData: User
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public admin: number = null
  public otraEps: boolean = false
  Visible: boolean = false;
  roles: any[] = [];
  // statuses: Status[];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
  ) { }

  ngOnInit() {

    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allUsers = state.allUsers.data
      this.userData = state.currentUser.data
      this.allRoles = state.allRoles.data
      this.rolesList = this.allRoles.filter(role => role.name !== "Beneficiario")
    })
    this.roles = [
      { label: 'Administrador', value: '1' },
      { label: 'Cliente', value: '2' },
    ];
    //   this.statuses = [
    //     {name: 'Activo', code: 1},
    //     {name: 'Inactivo', code: 2}
    // ];

    this.formGroup = this.fb.group({
      userId: [null],
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
      status: [1, Validators.required],
      name: [null, Validators.required],
      lastName: [null, Validators.required],
      document: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      birthDate: [null],
      address: [null],
      eps: [null],
      otherEps: [null]

    })


    if (this.userData != null) {

      this.formGroup.setValue({
        userId: this.userData.userId,
        role: this.userData.roleId,
        email: this.userData.email,
        password: this.userData.password,
        status: this.userData.status,
        name: " ",
        lastName: " ",
        document: " ",
        phoneNumber: " ",
        birthDate: " ",
        address: " ",
        eps: " ",
        otherEps: " "
      })
    }
  }

  saveChanges() {
    if (this.userData == null) {
      if (this.admin == 1) {
        this.model = {
          email: this.formGroup.value.email,
          password: this.formGroup.value.password,
          status: 1,
          roleId: this.formGroup.value.role,
          employee: {
            name: this.formGroup.value.name,
            lastName: this.formGroup.value.lastName,
            document: this.formGroup.value.document,
            phoneNumber: this.formGroup.value.phoneNumber
          }
        }
      } else {
        this.model = {
          email: this.formGroup.value.email,
          password: this.formGroup.value.password,
          status: 1,
          roleId: this.formGroup.value.role,
          customer: {
            name: this.formGroup.value.name,
            lastName: this.formGroup.value.lastName,
            document: this.formGroup.value.document,
            birthDate: this.formGroup.value.birthDate,
            phoneNumber: this.formGroup.value.phoneNumber,
            address: this.formGroup.value.address,
            eps: this.saveEps()
          }
        }
      }

      this.store.dispatch(new CreateUserRequest({
        ...this.model
      }));

    } else {
      this.model = {
        userId: this.formGroup.value.userId,
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: this.formGroup.value.status,
        roleId: this.formGroup.value.role
      }
      this.store.dispatch(new UpdateUserRequest({
        ...this.model,
      }))
    }

  }

  validForm(): boolean {
    if (this.userData == null) {
      if (this.admin == 1) {
        return this.formGroup.valid
          && !this.allUsers.find(u => u.email === this.formGroup.value.email || u.email === this.formGroup.value.email)
          && this.rolesList.find(r => r.roleId === this.formGroup.value.role) != null
      } else if (this.otraEps) {
        return this.formGroup.valid && this.formGroup.value.birthDate != null
          && this.formGroup.value.address != null
          && this.formGroup.value.eps != null
          && this.formGroup.value.otherEps != null
          && !this.allUsers.find(u => u.email === this.formGroup.value.email || u.email === this.formGroup.value.email)
          && this.rolesList.find(r => r.roleId === this.formGroup.value.role) != null
      } else {
        return this.formGroup.valid && this.formGroup.value.birthDate != null
          && this.formGroup.value.address != null
          && this.formGroup.value.eps != null
          && !this.allUsers.find(u => u.email === this.formGroup.value.email || u.email === this.formGroup.value.email)
          && this.rolesList.find(r => r.roleId === this.formGroup.value.role) != null
      }

    } else {
      return this.formGroup.valid
        && this.formGroup.value.status != "0"
        && !this.allUsers.find(u => u.email === this.formGroup.value.email && u.userId != this.formGroup.value.userId)
        && !this.allUsers.find(u => u.email === this.formGroup.value.email && u.userId != this.formGroup.value.userId)
    }
  }

  cancel() {
    this.modalPrimeNg.close();
  }


  addForm() {
    var role = this.rolesList.find(r => r.roleId == this.formGroup.value.role)
    if (role?.name != "Cliente") {
      this.admin = 1
    } else (
      this.admin = 2
    )
    if (this.formGroup.value.eps == 'OTRA') {
      this.otraEps = true
    } else {
      this.otraEps = false
    }
  }

  saveEps(): string {
    if (this.otraEps) {
      return this.formGroup.value.otherEps
    } else {
      return this.formGroup.value.eps
    }
  }
  displayPassword() {
    this.Visible = !this.Visible;
  }

}
