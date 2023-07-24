import { CreateCustomerRequest, CreateFrequentTravelerRequest, EditCustomerRequest, OpenModalListFrequentTraveler } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Customer } from '@/models/customer';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { User } from '@/models/user';
import { Role } from '@/models/role';
import { ApiService } from '@services/api.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FrequentTraveler } from '@/models/frequentTraveler';

@Component({
  selector: 'app-createcustomerform',
  templateUrl: './create-customer-form.component.html',
  styleUrls: ['./create-customer-form.component.scss']
})

export class CreatecustomerformComponent implements OnInit {
  private ui: Observable<UiState>
  public formGroup: FormGroup
  public allRoles: Array<Role>
  public allCustomers: Array<Customer>
  public oneCustomer: any
  public customerFromAction: Customer
  public Visible: boolean = false
  public password: string = ''
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public otraEps: boolean = false
  public isCustomerInformation: Customer
  public frequentTravelersList: Array<Customer> = []
  public hasInformation: boolean = false

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    public apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.oneCustomer = state.oneCustomer.data
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
      eps: new FormControl(null, [Validators.required]),
    })

    if (this.oneCustomer !== undefined) {
      this.customerFromAction = this.oneCustomer.customer
      if (this.oneCustomer.action === "editCustomer" || this.oneCustomer.action === "editCustomerFromFrequentTraveler") {
        this.formGroup.setValue({
          name: this.customerFromAction.name,
          lastName: this.customerFromAction.lastName,
          document: this.customerFromAction.document,
          birthDate: this.formatDate(this.customerFromAction.birthDate),
          phoneNumber: this.customerFromAction.phoneNumber,
          address: this.customerFromAction.address,
          eps: this.customerFromAction.eps,
          email: this.customerFromAction.user.email,
          password: this.customerFromAction.user.password,
        })
      } else if (this.oneCustomer.action === "createFrequentTraveler") {
        if (this.oneCustomer.customer.frequentTraveler !== undefined) {
          for (const element of this.oneCustomer.customer.frequentTraveler) {
            const customer = this.allCustomers.find(c => c.customerId === element.travelerId)
            if (customer !== undefined) {
              this.frequentTravelersList.push(customer)
            }
          }
        }
      }
    }
  }

  validateTitle(): string {
    if (this.oneCustomer !== undefined) {
      if (this.oneCustomer.action === 'createFrequentTraveler') {
        return 'Agregar viajero frecuente'
      } else if (this.oneCustomer.action === 'editCustomer') {
        return 'Editar cliente'
      } else {
        return 'Editar viajero frecuente'
      }
    }
    return 'Registrar cliente'
  }

  validateExistingOneCustomer(): boolean {
    if (this.oneCustomer !== undefined) {
      if (this.oneCustomer.action === 'createFrequentTraveler') {
        return false
      } else if (this.oneCustomer.action === 'editCustomer') {
        return false
      } else {
        return true
      }
    }
    return false
  }

  isCustomerChanges() {
    if (this.hasInformation) {
      if (this.formGroup.value.document !== this.isCustomerInformation.document) {
        this.hasInformation = false
        this.formGroup.reset()
      }
    }
  }

  customerInformation(): boolean {
    if (this.oneCustomer !== undefined) {
      if (this.oneCustomer.action === 'createFrequentTraveler') {
        if (this.formGroup.value.document >= 8) {
          const oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
          if (oneCustomer !== undefined) {
            return true
          }
        }
      }
    }
    return false
  }

  fillCustomerInformation() {
    this.isCustomerInformation = this.allCustomers.find(c => c.document === this.formGroup.value.document)
    this.hasInformation = true
    this.formGroup.setValue({
      name: this.isCustomerInformation.name,
      lastName: this.isCustomerInformation.lastName,
      document: this.isCustomerInformation.document,
      birthDate: this.formatDate(this.isCustomerInformation.birthDate),
      phoneNumber: this.isCustomerInformation.phoneNumber,
      address: this.isCustomerInformation.address,
      eps: this.isCustomerInformation.eps,
      email: this.isCustomerInformation.user.email,
      password: this.isCustomerInformation.user.password,
    })
  }

  save() {
    // if (!this.formGroup.invalid) {

    const role: Role = this.allRoles.find(r => r.name === 'Cliente')
    if (this.oneCustomer !== undefined) {
      if (this.oneCustomer.action === 'editCustomer' || this.oneCustomer.action === "editCustomerFromFrequentTraveler") {
        const user: User = {
          email: this.formGroup.value.email,
          password: this.formGroup.value.password,
          status: 1,
          roleId: role.roleId,
        }
        const customer: Customer = {
          customerId: this.customerFromAction.customerId,
          name: this.formGroup.value.name,
          lastName: this.formGroup.value.lastName,
          document: this.formGroup.value.document,
          birthDate: this.formGroup.value.birthDate,
          phoneNumber: this.formGroup.value.phoneNumber,
          address: this.formGroup.value.address,
          eps: this.formGroup.value.eps,
          userId: this.customerFromAction.userId,
          user: user
        }
        this.store.dispatch(new EditCustomerRequest({ ...customer }))
      } else if (this.oneCustomer.action === 'createFrequentTraveler') {
        const beneficiarieRole: Role = this.allRoles.find((r) => r.name == 'Beneficiario');
        const user: User = {
          email: 'pakitours@pakitours.com',
          password: 'pakitours',
          status: 2,
          roleId: beneficiarieRole.roleId,
        }

        let customer: Customer

        if (this.hasInformation) {
          customer = {
            name: this.isCustomerInformation.name,
            lastName: this.isCustomerInformation.lastName,
            document: this.isCustomerInformation.document,
            birthDate: this.isCustomerInformation.birthDate,
            phoneNumber: this.isCustomerInformation.phoneNumber,
            address: this.isCustomerInformation.address,
            eps: this.isCustomerInformation.eps,
            user: this.isCustomerInformation.user
          }

          const frequentTraveler: FrequentTraveler = {
            customerId: this.customerFromAction.customerId,
            travelerId: this.isCustomerInformation.customerId
          }

          this.store.dispatch(new CreateFrequentTravelerRequest({ ...frequentTraveler }))
        } else {
          customer = {
            name: this.formGroup.value.name,
            lastName: this.formGroup.value.lastName,
            document: this.formGroup.value.document,
            birthDate: this.formGroup.value.birthDate,
            phoneNumber: this.formGroup.value.phoneNumber,
            address: this.formGroup.value.address,
            eps: this.formGroup.value.eps,
            user: user
          }

          this.apiService.addCustomer(customer).subscribe({
            next: (data) => {
              const frequentTraveler: FrequentTraveler = {
                customerId: this.customerFromAction.customerId,
                travelerId: data.customerId
              }
              this.store.dispatch(new CreateFrequentTravelerRequest({ ...frequentTraveler }))
            },
            error: (err) => {
              console.log('Error while creating: ', err)
            }
          })
        }


      }
    } else {
      const user: User = {
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: 1,
        roleId: role.roleId,
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
      this.store.dispatch(new CreateCustomerRequest({ ...customer }))
    }
    // }
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
    this.Visible = !this.Visible
  }

  validateExistingDocument(): boolean {
    if (this.oneCustomer !== undefined) {
      if (this.oneCustomer.action !== 'createFrequentTraveler') {
        const customer: Customer = this.allCustomers.find(c => c.document == this.formGroup.value.document)
        if (customer !== undefined) {
          return true
        }
      } else {
        const customer: Customer = this.frequentTravelersList.find(ft => ft.document == this.formGroup.value.document)
        if (customer !== undefined) {
          return true
        }
      }
    } else {
      const customer: Customer = this.allCustomers.find(c => c.document == this.formGroup.value.document)
      if (customer !== undefined) {
        return true
      }
    }
    return false
  }

  validateExistingEmail(): boolean {
    const customer: Customer = this.allCustomers.find(c => c.user.email == this.formGroup.value.email)
    if (customer !== undefined) {
      return true
    }
    return false
  }

  formatDate(date: any): Date {
    const opcionesFecha = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }

    date = new Date(date)
    let fechaConvertida = date.toLocaleString('en-ES', opcionesFecha).replace(/,/g, '')
    fechaConvertida = new Date(fechaConvertida.replace(/PM GMT-5/g, 'GMT-0500 (Colombia Standard Time)'))

    return fechaConvertida
  }

  birthDateValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value) {
      const birthDate = new Date(control.value)
      const currentDate = new Date()
      const diffTime = currentDate.getTime() - birthDate.getTime()
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)

      // Comprueba si el usuario tiene al menos 18 años (18 años completos)
      if (diffYears < 18) {
        return { 'invalidAge': true }
      }
    }

    return null
  }

  // ... Resto del código del componente ...





  validForm(): boolean {
    return true
  }

  validateBackButton(): boolean {
    if (this.oneCustomer !== undefined) {
      if (this.oneCustomer.action === 'createFrequentTraveler' || this.oneCustomer.action === 'editCustomerFromFrequentTraveler') {
        return true
      }
    }
    return false
  }

  cancel() {
    if (this.oneCustomer !== undefined) {
      if (this.oneCustomer.action === 'createFrequentTraveler') {
        this.modalPrimeNg.close()
        this.store.dispatch(new OpenModalListFrequentTraveler({ ...this.oneCustomer.customer }))
      } else if (this.oneCustomer.action === 'editCustomerFromFrequentTraveler') {
        this.modalPrimeNg.close()
        this.store.dispatch(new OpenModalListFrequentTraveler({ ...this.oneCustomer.titularCustomer }))
      } else {
        this.modalPrimeNg.close()
      }
    } else {
      this.modalPrimeNg.close()
    }
  }
}