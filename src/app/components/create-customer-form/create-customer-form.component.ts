import { CreateCustomerRequest, EditCustomerRequest, GetAllCustomerRequest, GetAllRoleRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Customer } from '@/models/customer';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { User } from '@/models/user';
import { Role } from '@/models/role';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-createcustomerform',
  templateUrl: './create-customer-form.component.html',
  styleUrls: ['./create-customer-form.component.scss']
})
export class CreatecustomerformComponent implements OnInit {

  public ui: Observable<UiState>
  public ActionTitle: string = "Agregar"
  formGroup: FormGroup;
  Visible: boolean = false;
  password: string = '';
  public CustomerList: Array<any>
  public customerData
  Roles: Array<Role>;
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public otraEps: boolean = false
  
  constructor(private fb: FormBuilder, 
    private modalService: NgbModal, 
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest());
    this.store.dispatch(new GetAllRoleRequest());
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.CustomerList = state.allCustomers.data
      this.customerData = state.oneCustomer.data
      this.Roles = state.allRoles.data;
    })

    this.formGroup = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      document: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      birthDate: [null, [Validators.required, this.birthDateValidator.bind(this)]],
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      address: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      eps: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      user: ['', Validators.required],
    });

    if (this.customerData != null) {
      console.log(this.customerData.birthDate)
      this.ActionTitle = "Editar"
      this.formGroup.setValue({

        name: this.customerData.name,
        lastName: this.customerData.lastName,
        document: this.customerData.document,
        birthDate: this.formatDate(this.customerData.birthDate),
        phoneNumber: this.customerData.phoneNumber,
        address: this.customerData.address,
        eps: this.customerData.eps,
        email: this.customerData.user.email,
        password: this.customerData.user.password,
        user: this.customerData.user
      }
      )
    }
  }
  saveCustomer() {
    var idRole: Role = this.Roles.find((r) => r.name == 'Cliente');
    if (this.customerData == null) {
      const user: User = {
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: 1,
        roleId: idRole.roleId,
      }

      const customer: Customer = {
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.formGroup.value.eps,
        user: user
      }
      
      this.store.dispatch(new CreateCustomerRequest({
        ...customer
      }));
    } else {
      const user: User = {
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: 1,
        roleId: idRole.roleId,
      }

      const customer: Customer = {
        customerId: this.customerData.customerId,
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.formGroup.value.eps,
        user: user,
        userId: this.customerData.userId

      }
      console.log(user, customer, 'q')
      this.store.dispatch(new EditCustomerRequest({
        ...customer
      }));
    }
  }

  addForm() {
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
    return this.CustomerList.find(item => item.document == this.formGroup.value.document)
  }

  validateExistingEmail(): boolean {
    return this.CustomerList.find(item => item.email == this.formGroup.value.email)
  }

  formatDate(date:any) : Date {
    const opcionesFecha = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

    date = new Date(date)
    let fechaConvertida = date.toLocaleString('en-ES', opcionesFecha).replace(/,/g, '');;
    fechaConvertida = new Date(fechaConvertida.replace(/PM GMT-5/g, 'GMT-0500 (Colombia Standard Time)'))

    return fechaConvertida;
  }

  birthDateValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value) {
      const birthDate = new Date(control.value);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - birthDate.getTime();
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

      // Comprueba si el usuario tiene al menos 18 años (18 años completos)
      if (diffYears < 18) {
        return { 'invalidAge': true };
      }
    }

    return null;
  }

  // ... Resto del código del componente ...





  validForm(): boolean {
    return true
  }

  cancel() {
    this.modalPrimeNg.close();
  }
}