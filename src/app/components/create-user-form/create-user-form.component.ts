import { Customer } from '@/models/customer';
import { Employee } from '@/models/employee';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateUserRequest, UpdateUserRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public allEmployees: Array<Employee>
  public allCustomers: Array<Customer>
  public model: User
  public userData: User
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public admin: number = null
  public otraEps: boolean = false
  Visible: boolean = false;
  public statuses: any[] = [];
  public customerMaxDate: Date
  public isCustomer: boolean = false


  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
  ) { }

  ngOnInit() {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allUsers = state.allUsers.data
      this.userData = state.currentUser.data
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.allEmployees = state.allEmployees.data

      this.rolesList = this.allRoles.filter(role => role.name !== "Beneficiario")
      if (this.userData != null) {
        var role = this.rolesList.find(r => r.name == 'Cliente')
        if (this.userData.roleId == role.roleId) {
          this.rolesList = this.rolesList.filter(r => r.name === 'Cliente')
        } else {
          this.rolesList = this.rolesList.filter(r => r.name !== 'Cliente')
        }
      }
    })

    this.statuses = [
      { 'label': 'Activo', 'value': 1 },
      { 'label': 'Inactivo', 'value': 2 }
    ]

    this.formGroup = this.fb.group({
      userId: [null],
      role: [null, Validators.required],
      email: [null,
        [Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
      ],
      password: [null
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
        password: '',
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

    this.birthDateValidator()
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
        password:this.userData.password,
        status: this.formGroup.value.status,
        roleId: this.formGroup.value.role
      }
      this.store.dispatch(new UpdateUserRequest({
        ...this.model,
      }))
    }

  }

  validForm(): boolean {
    if (this.userData == undefined) {
      if (this.admin == 1) {
        return this.formGroup.valid && !this.validateExistingEmail() &&
          this.validateOnlyNumbersForPhoneNumber() && this.validateOnlyNumbers()
          && !this.validateExistingDocument()
      } else {
        return this.formGroup.valid && this.formGroup.value.birthDate !== null
          && this.formGroup.value.address !== null
          && this.formGroup.value.eps !== null &&
          !this.validateExistingEmail() && !this.validateExistingDocument() &&
          this.validateOnlyNumbersForPhoneNumber() && this.validateOnlyNumbers()
      }
    } else {
      return this.formGroup.valid && this.formGroup.value.status != "0" &&
        this.validateOnlyNumbersForPhoneNumber() && this.validateOnlyNumbers()
        && !this.validateExistingEmail() && !this.validateExistingDocument()
    }
  }

  cancel() {
    this.modalPrimeNg.close();
  }


  addForm() {
    var role = this.rolesList.find(r => r.roleId == this.formGroup.value.role)
    if (role?.name != "Cliente") {
      this.admin = 1
    } else {
      this.admin = 2
    }
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

  validateExistingDocument(): boolean {
    if (this.admin == 1) {
      if (this.userData !== undefined) {
        const employee: Employee = this.allEmployees.find(e => e.document === this.formGroup.value.document)
        if (employee !== undefined && employee.document !== this.userData.employee.document) {
          return true
        }
      } else {
        const employee: Employee = this.allEmployees.find(e => e.document === this.formGroup.value.document)
        if (employee !== undefined) {
          return true
        }
      }
    } else {
      if (this.userData !== undefined) {
        const customer: Customer = this.allCustomers.find(e => e.document === this.formGroup.value.document)
        if (customer !== undefined && customer.document !== this.userData.customer.document) {
          return true
        }
      } else {
        const customer: Customer = this.allCustomers.find(e => e.document === this.formGroup.value.document)
        if (customer !== undefined) {
          return true
        }
      }
    }

    return false
  }

  validateExistingEmail(): boolean {
    if (this.userData !== undefined) {
      const user: User = this.allUsers.find(u => u.email === this.formGroup.value.email)
      if (user !== undefined && user.email !== this.userData.email) {
        return true
      }
    } else {
      const user: User = this.allUsers.find(u => u.email === this.formGroup.value.email)
      if (user !== undefined) {
        return true
      }
    }
    return false
  }

  validateOnlyNumbersForPhoneNumber(): boolean {
    if (this.formGroup.value.phoneNumber !== null) {
      if (this.formGroup.value.phoneNumber.length >= 10) {
        const regularExpresion = /^[0-9]+$/
        return regularExpresion.test(this.formGroup.value.phoneNumber)
      }
    }
    return true
  }

  validateOnlyNumbers(): boolean {
    if (this.formGroup.value.document !== null) {
      if (this.formGroup.value.document.length >= 8) {
        const regularExpresion = /^[0-9]+$/
        return regularExpresion.test(this.formGroup.value.document)
      }
    }
    return true
  }

  birthDateValidator() {
    const currentDate = new Date();

    this.customerMaxDate = new Date(currentDate);
    this.customerMaxDate.setFullYear(currentDate.getFullYear() - 18);
  }

}
