import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { Customer } from '@/models/customer';
import { Package } from '@/models/package';
import { OrderDetail } from '@/models/orderDetail';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditCustomerRequest, GetAllRoleRequest, OpenModalCreateOrder, OpenModalCreatePayment, OpenModalOrderDetails } from '@/store/ui/actions';

@Component({
  selector: 'app-create-order-detail-form',
  templateUrl: './create-order-detail-form.component.html',
  styleUrls: ['./create-order-detail-form.component.scss']
})

export class CreateOrderDetailFormComponent implements OnInit {
  private ui: Observable<UiState>
  public formGroup: FormGroup
  public allRoles: Array<Role>
  public oneRole: Role | undefined
  public allCustomers: Array<Customer>
  public oneCustomer: Customer | undefined
  public onePackage: Package | undefined
  public orderDetails: Array<OrderDetail>
  public beneficiaries: Array<Customer> = []
  public orderDetailCustomers: Array<Customer> = []
  public orderProcess: Array<any>
  public beneficiariesAmount: number
  public visible: boolean = true
  public frequentTravelers: Array<Customer> = []
  public selectedFrequentTravelers: Array<Customer> = []
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllRoleRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.orderProcess = state.orderProcess.data
      if (this.allRoles !== undefined) {
        this.oneRole = this.allRoles.find(r => r.name === 'Beneficiario')
      }
    })

    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      birthdate: ['', Validators.required],
      eps: [null, Validators.required],
      addToFt: [false]
    })

    if (this.orderProcess !== undefined) {
      if (this.orderProcess[0].action === 'CreateOrderDetail') {
        this.onInitFromCreateOrderDetail()
      } else if ((this.orderProcess[0].action === 'EditOrderDetail')) {
        this.onInitFromEditOrderDetail()
      } else if (this.orderProcess[0].action === 'CreateOrderFromCustomer') {
        this.onInitFromCreateOrderFromCustomer()
      } else {
        // onInitFromCreateOrderFromAdmin
        this.onePackage = this.orderProcess[0].order.package
        if (this.orderProcess[0].beneficiaries.length > 0) {
          this.fillBeneficiariesArray()
          if (this.orderProcess[0].order.beneficiaries > this.orderProcess[0].beneficiaries.length) {
            this.beneficiariesAmount = this.orderProcess[0].order.beneficiaries
          } else {
            this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
          }
        } else {
          this.beneficiariesAmount = this.orderProcess[0].order.beneficiaries
        }
        this.fillFrequentTravelersArray()
      }
    }
  }

  //<--- TABLE UPDATE PROCESS --->

  updateVisibility(): void {
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  //<------------------->

  //<--- ON INIT FROM DIFFERENT ENTRIES --->

  onInitFromCreateOrderDetail() {
    this.orderDetails = this.orderProcess[0].order.orderDetail
    for (const element of this.orderDetails) {
      const customer = this.allCustomers.find(c => c.customerId === element.beneficiaryId)
      if (customer !== undefined) {
        this.orderDetailCustomers.push(customer)
      }
    }
    this.onePackage = this.orderProcess[0].order.package
    if (this.orderProcess[0].beneficiaries.length > 0) {
      this.fillBeneficiariesArray()
      this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
    } else {
      this.beneficiariesAmount = 1
    }
    this.fillFrequentTravelersArray()
  }

  onInitFromEditOrderDetail() {
    this.beneficiariesAmount = 1
    const birthDateValue = this.orderProcess[0].customer.birthDate.split('T')[0]
    this.formGroup.setValue({
      name: this.orderProcess[0].customer.name,
      lastName: this.orderProcess[0].customer.lastName,
      document: this.orderProcess[0].customer.document,
      address: this.orderProcess[0].customer.address,
      phoneNumber: this.orderProcess[0].customer.phoneNumber,
      birthdate: birthDateValue,
      eps: this.orderProcess[0].customer.eps,
    })
  }

  onInitFromCreateOrderFromCustomer() {
    this.onePackage = this.orderProcess[0].order.package
    if (this.orderProcess[0].beneficiaries.length > 0) {
      this.fillBeneficiariesArray()
      this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
    } else {
      this.beneficiariesAmount = 1
    }
    this.fillFrequentTravelersArray()
  }

  //<------------------->

  //<--- COMPONENT ACTIONS --->

  fillBeneficiariesArray() {
    for (const element of this.orderProcess[0].beneficiaries) {
      if (element !== undefined) {
        const exists = this.beneficiaries.find(b => b.document === element.document)
        if (exists === undefined) {
          this.beneficiaries.push(element)
        }
      }
    }
  }

  fillFrequentTravelersArray() {
    if (this.orderProcess[0].order.customer.frequentTraveler !== undefined) {
      for (const element of this.orderProcess[0].order.customer.frequentTraveler) {
        const customer = this.allCustomers.find(c => c.customerId === element.travelerId)
        if (customer !== undefined) {
          this.frequentTravelers.push(customer)
        }
      }
    }
  }

  fillCustomerInformation() {
    this.beneficiaries.push(this.oneCustomer)
    this.formGroup.reset()
    this.updateVisibility()
  }

  deleteBeneficiarie(document: string) {
    const oneCustomer = this.beneficiaries.find(c => c.document === document)
    const index = this.beneficiaries.indexOf(oneCustomer)
    this.beneficiaries.splice(index, 1)
    if (this.beneficiariesAmount > 1) {
      this.beneficiariesAmount--
    }
    this.updateVisibility()
  }

  addFrequentTraveler() {
    if (this.selectedFrequentTravelers !== undefined) {
      for (const element of this.selectedFrequentTravelers) {
        const alreadyExists = this.beneficiaries.find(b => b.document === element.document)
        const alreadyExistsFromOrderDetail = this.orderDetailCustomers.find(od => od.document === element.document)
        if (alreadyExists === undefined && alreadyExistsFromOrderDetail === undefined) {
          this.beneficiaries.push(element)
          this.beneficiariesAmount++
          this.updateVisibility()
        }
      }
    }
  }

  addAnotherBeneficiarieButton(): boolean {
    if (this.onePackage.availableQuotas >= this.beneficiariesAmount + 1) {
      return true
    }
    return false
  }

  addAnotherBeneficiarie() {
    if (this.onePackage.availableQuotas >= this.beneficiariesAmount + 1) {
      this.beneficiariesAmount++
    }
  }

  reduceBeneficiariesAmount() {
    if (this.beneficiariesAmount > this.beneficiaries.length) {
      if (this.beneficiariesAmount > 1) {
        this.beneficiariesAmount--
      }
    }
  }

  add() {
    if (!this.formGroup.invalid) {
      const user: User = {
        email: 'pakitours@pakitours.com',
        password: 'pakitours',
        status: 2,
        roleId: this.oneRole.roleId,
      }
      this.beneficiaries.push({
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        address: this.formGroup.value.address,
        phoneNumber: this.formGroup.value.phoneNumber,
        birthDate: this.formGroup.value.birthdate,
        eps: this.formGroup.value.eps,
        user: user,
      })
      this.formGroup.reset()
      this.updateVisibility()
    }
  }
  //<------------------->

  //<--- VALIDATIONS --->

  validForm(): boolean {
    if (this.beneficiariesForm()) {
      return this.formGroup.value.name !== '' &&
        this.formGroup.value.phoneNumber !== '' &&
        this.formGroup.value.birthdate !== '' &&
        this.formGroup.value.eps !== 0 && !this.alreadyExists() && !this.customerInformation() &&
        !this.formGroup.invalid && !this.alreadyExistsFromEdit()
    } else {
      return true
    }
  }

  beneficiariesForm() {
    if (this.beneficiaries.length === this.beneficiariesAmount) {
      return false
    }
    return true
  }

  customerInformation(): boolean {
    if (this.orderProcess[0].action !== 'EditOrderDetail') {
      if (this.formGroup.value.document >= 8) {
        this.oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
        if (this.oneCustomer !== undefined) {
          return true
        }
      }
    }
    return false
  }

  alreadyExistsFromEdit(): boolean {
    if (this.orderProcess[0].action === 'EditOrderDetail') {
      if (this.formGroup.value.document >= 8) {
        this.oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
        if (this.oneCustomer !== undefined) {
          if (this.oneCustomer.document === this.orderProcess[0].customer.document) {
            return false
          }
          return true
        }
      }
    }
    return false
  }

  alreadyExists(): boolean {
    if (this.orderProcess[0].action !== 'EditOrderDetail') {
      if (this.orderProcess[0].action === 'CreateOrderDetail') {
        const oneCustomer = this.orderDetailCustomers.find(b => b.document === this.formGroup.value.document)
        const anotherCustomer = this.beneficiaries.find(b => b.document === this.formGroup.value.document)
        if (anotherCustomer === undefined && oneCustomer === undefined) {
          return false
        }
      } else {
        const oneCustomer = this.beneficiaries.find(b => b.document === this.formGroup.value.document)
        if (oneCustomer === undefined) {
          return false
        }
      }
      return true
    }
  }

  showBeneficiariesTable(): boolean {
    if (this.beneficiaries.length > 0) {
      return true
    }
    return false
  }

  //<------------------->

  //<--- BACK AND NEXT ACTIONS --->

  back(event: Event) {
    if (this.orderProcess[0].action === 'CreateOrderDetail') {
      if (this.beneficiaries.length > 0) {
        this.confirmationService.confirm({
          target: event.target,
          message: '¿Estás seguro? Perderás toda la información previamente ingresada.',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Sí, regresar',
          rejectButtonStyleClass: 'p-button-outlined',
          rejectIcon: 'pi pi-times',
          acceptLabel: 'Permanecer',
          acceptIcon: 'pi pi-check',
          reject: () => {
            this.modalPrimeNg.close()
            this.store.dispatch(new OpenModalOrderDetails({ ...this.orderProcess[0].order }))
          }
        })
      } else {
        this.modalPrimeNg.close()
        this.store.dispatch(new OpenModalOrderDetails({ ...this.orderProcess[0].order }))
      }
    } else if (this.orderProcess[0].action === 'EditOrderDetail') {
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalOrderDetails({ ...this.orderProcess[0].order }))
    } else if (this.orderProcess[0].action === 'CreateOrderFromCustomer') {
      if (this.beneficiaries.length > 0) {
        this.confirmationService.confirm({
          target: event.target,
          message: '¿Estás seguro? Perderás toda la información previamente ingresada.',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Sí, regresar',
          rejectButtonStyleClass: 'p-button-outlined',
          rejectIcon: 'pi pi-times',
          acceptLabel: 'Permanecer',
          acceptIcon: 'pi pi-check',
          reject: () => {
            this.modalPrimeNg.close()
          }
        })
      } else {
        this.modalPrimeNg.close()
      }
    } else {
      this.orderProcess = [{
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
      }]
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreateOrder({ ...this.orderProcess }))
    }
  }

  next() {
    if (this.orderProcess[0].action === 'CreateOrderDetail') {
      this.orderProcess = [{
        action: 'CreateOrderDetail',
        order: {
          orderId: this.orderProcess[0].order.orderId,
          package: this.orderProcess[0].order.package,
          customerId: this.orderProcess[0].order.customerId,
          totalCost: this.orderProcess[0].order.package.price * this.beneficiaries.length
        },
        beneficiaries: this.beneficiaries,
      }]
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreatePayment({ ...this.orderProcess }))
    } else if (this.orderProcess[0].action === 'EditOrderDetail') {
      const customer: Customer = {
        customerId: this.orderProcess[0].customer.customerId,
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthdate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.formGroup.value.eps,
        userId: this.orderProcess[0].customer.userId
      }
      this.store.dispatch(new EditCustomerRequest({ ...customer }))
      this.modalPrimeNg.close()
    } else if (this.orderProcess[0].action === 'CreateOrderFromCustomer') {
      this.orderProcess = [{
        action: 'CreateOrderFromCustomer',
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
      }]
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreatePayment({ ...this.orderProcess }))
    } else {
      this.orderProcess = [{
        action: 'CreateOrder',
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
      }]
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreatePayment({ ...this.orderProcess }))
    }
  }
}
