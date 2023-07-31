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
import { EditOrderDetailRequest, OpenModalCreateOrder, OpenModalCreatePayment, OpenModalPayments } from '@/store/ui/actions';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-create-order-detail-form',
  templateUrl: './create-order-detail-form.component.html',
  styleUrls: ['./create-order-detail-form.component.scss'],
  providers: [ConfirmationService]
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
  public beneficiaries: Array<any> = []
  public orderDetailCustomers: Array<Customer> = []
  public orderProcess: Array<any>
  public beneficiariesAmount: number
  public visible: boolean = true
  public frequentTravelers: Array<Customer> = []
  public selectedFrequentTravelers: Array<Customer> = []
  public beneficiariesMaxDate: Date
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']

  constructor(
    public apiService: ApiService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.orderProcess = state.orderProcess.data
      if (this.allRoles !== undefined) {
        this.oneRole = this.allRoles.find(r => r.name === 'Beneficiario')
      }
    })

    const currentDate = new Date()
    this.beneficiariesMaxDate = new Date(currentDate);
    this.beneficiariesMaxDate.setDate(currentDate.getDate() - 15);

    this.formGroup = this.fb.group({
      name: ['',
        [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)]],
      lastName: ['',
        [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)]],
      document: ['',
        [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15)
        ]],
      address: ['', [Validators.required]],
      phoneNumber: ['',
        [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        ]],
      birthdate: ['', [Validators.required]],
      eps: [null, [Validators.required]],
      addToFt: [false]
    })

    if (this.orderProcess !== undefined) {
      if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
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
    this.visible = false
    setTimeout(() => this.visible = true, 0)
  }

  //<------------------->

  //<--- BIRTHDATE SECTION --->

  dateFormat(date: any): Date {
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }
    date = new Date(date)
    let convertedDate = date.toLocaleString('en-ES', dateOptions).replace(/,/g, '')
    convertedDate = new Date(convertedDate.replace(/PM GMT-5/g, 'GMT-0500 (Colombia Standard Time)'))

    return convertedDate
  }

  adjustPriceAccordingToAge(date: Date): number {
    const currenDate = new Date();
    const birthdate = new Date(date);
    const milisecondsAge = currenDate.getTime() - birthdate.getTime();
    const yearAge = milisecondsAge / (1000 * 60 * 60 * 24 * 365.25);

    if (yearAge < 5) {
      return this.onePackage.aditionalPrice
    } else if (yearAge >= 5 && yearAge < 10) {
      return this.onePackage.price * 0.70
    } else {
      return this.onePackage.price
    }
  }

  //<------------------->

  //<--- ON INIT FROM DIFFERENT ENTRIES --->

  onInitFromCreateOrderDetail() {
    for (const element of this.orderProcess[0].order.payment) {
      if (element != undefined) {
        for (const anotherElement of element.orderDetail) {
          const customer: Customer = this.allCustomers.find(c => c.customerId === anotherElement.beneficiaryId)
          if (customer !== undefined) {
            this.orderDetailCustomers.push(customer)
          }
        }
      }
    }
    if (this.orderProcess[0].beneficiaries.length > 0) {
      this.fillBeneficiariesArray()
      this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
    } else {
      this.beneficiariesAmount = 1
    }
    this.onePackage = this.orderProcess[0].order.package
    this.fillFrequentTravelersArray()
  }

  onInitFromEditOrderDetail() {
    this.beneficiariesAmount = 1
    this.formGroup.setValue({
      name: this.orderProcess[0].customer.name,
      lastName: this.orderProcess[0].customer.lastName,
      document: this.orderProcess[0].customer.document,
      address: this.orderProcess[0].customer.address,
      phoneNumber: this.orderProcess[0].customer.phoneNumber,
      birthdate: this.dateFormat(this.orderProcess[0].customer.birthDate),
      eps: this.orderProcess[0].customer.eps,
      addToFt: false
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
          if (element.customerId !== undefined) {
            this.beneficiaries.push({
              customerId: element.customerId,
              name: element.name,
              lastName: element.lastName,
              document: element.document,
              birthDate: element.birthDate,
              phoneNumber: element.phoneNumber,
              address: element.address,
              eps: element.eps,
              user: element.user,
              price: element.price,
              addToFt: element.addToFt
            })
          } else {
            this.beneficiaries.push({
              name: element.name,
              lastName: element.lastName,
              document: element.document,
              birthDate: element.birthDate,
              phoneNumber: element.phoneNumber,
              address: element.address,
              eps: element.eps,
              user: element.user,
              price: element.price,
              addToFt: element.addToFt
            })
          }
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
    this.beneficiaries.push({
      customerId: this.oneCustomer.customerId,
      name: this.oneCustomer.name,
      lastName: this.oneCustomer.lastName,
      document: this.oneCustomer.document,
      birthDate: this.oneCustomer.birthDate,
      phoneNumber: this.oneCustomer.phoneNumber,
      address: this.oneCustomer.address,
      eps: this.oneCustomer.eps,
      user: this.oneCustomer.user,
      price: this.adjustPriceAccordingToAge(this.oneCustomer.birthDate),
      addToFt: false
    })
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

  addFrequentTraveler(event: Event, element: any) {
    if (this.selectedFrequentTravelers !== undefined) {
      let flag: boolean = true
      for (const element of this.selectedFrequentTravelers) {
        const alreadyExists = this.beneficiaries.find(b => b.document === element.document)
        const alreadyExistsFromOrderDetail = this.orderDetailCustomers.find(od => od.document === element.document)
        if (alreadyExists === undefined && alreadyExistsFromOrderDetail === undefined) {
          if (this.onePackage.availableQuotas > this.beneficiaries.length) {
            this.beneficiaries.push({
              customerId: element.customerId,
              name: element.name,
              lastName: element.lastName,
              document: element.document,
              birthDate: element.birthDate,
              phoneNumber: element.phoneNumber,
              address: element.address,
              eps: element.eps,
              user: element.user,
              price: this.adjustPriceAccordingToAge(element.birthDate),
              addToFt: false
            })

            if (this.beneficiariesAmount < this.onePackage.availableQuotas) {
              this.beneficiariesAmount++
            }
          } else {
            flag = false
          }
        }
      }
      this.updateVisibility()
      element.hide(event);
      if (!flag) {
        this.confirmationService.confirm({
          header: '¡Uno o varios viajeros frecuentes no se pudieron añadir!',
          message: 'Esto se debe a que no hay suficientes cupos disponibles',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Entendido',
          rejectVisible: false,
          acceptIcon: 'pi pi-check',
          acceptButtonStyleClass: 'p-button-sm',
        })
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
        price: this.adjustPriceAccordingToAge(this.formGroup.value.birthdate),
        addToFt: this.formGroup.value.addToFt
      })
      this.formGroup.reset()
      this.updateVisibility()
    }
  }

  //<------------------->

  //<--- VALIDATIONS --->

  comesFromEdit(): boolean {
    if (this.orderProcess !== undefined) {
      if (this.orderProcess[0].action === 'EditOrderDetail') {
        return true
      }
    }
    return false
  }

  validForm(): boolean {
    if (this.beneficiariesForm()) {
      return this.formGroup.value.name !== '' &&
        this.formGroup.value.phoneNumber !== '' &&
        this.formGroup.value.birthdate !== '' &&
        this.formGroup.value.eps !== 0 && !this.alreadyExists() && !this.customerInformation() &&
        !this.formGroup.invalid && !this.alreadyExistsFromEdit() && this.validateOnlyNumbers() &&
        this.validateOnlyNumbersForPhoneNumber() && !this.validateStatus()
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

  validateStatus(): boolean {
    if (this.orderProcess[0].action !== 'EditOrderDetail') {
      if (!this.alreadyExists()) {
        if (this.oneCustomer !== undefined) {
          const oneRole = this.allRoles.find(r => r.roleId === this.oneCustomer.user.roleId)
          if (oneRole !== undefined) {
            if (this.oneCustomer.user.status === 2 && oneRole.name !== 'Beneficiario') {
              return true
            }
          }
        }
      }
    }
    return false
  }

  customerInformation(): boolean {
    if (this.orderProcess[0].action !== 'EditOrderDetail') {
      this.oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
      if (this.formGroup.value.document !== null) {
        if (this.formGroup.value.document.length >= 8 && !this.validateStatus()) {
          if (this.oneCustomer !== undefined) {
            return true
          }
        }
      }
    }
    return false
  }

  validateOnlyNumbers(): boolean {
    if (this.formGroup.value.document !== null) {
      if (this.formGroup.value.document.length >= 8) {
        const regularExpresion = /^[0-9]+$/;
        return regularExpresion.test(this.formGroup.value.document)
      }
    }
    return true
  }

  validateOnlyNumbersForPhoneNumber(): boolean {
    if (this.formGroup.value.phoneNumber !== null) {
      if (this.formGroup.value.phoneNumber.length >= 10) {
        const regularExpresion = /^[0-9]+$/;
        return regularExpresion.test(this.formGroup.value.phoneNumber)
      }
    }
    return true
  }

  alreadyExistsFromEdit(): boolean {
    if (this.orderProcess[0].action === 'EditOrderDetail') {
      if (this.formGroup.value.document.length >= 8) {
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
      if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
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

  backFromCreateOrderDetail(event: Event) {
    if (this.beneficiaries.length > 0) {
      this.confirmationService.confirm({
        target: event.target,
        header: '¿Está seguro de regresar?',
        message: 'Perderá toda la información previamente ingresada.',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Sí, regresar',
        rejectButtonStyleClass: 'p-button-outlined',
        rejectIcon: 'pi pi-times',
        acceptLabel: 'Permanecer',
        acceptIcon: 'pi pi-check',
        reject: () => {
          this.modalPrimeNg.close()
          this.store.dispatch(new OpenModalPayments({ ...this.orderProcess[0].order }))
        }
      })
    } else {
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalPayments({ ...this.orderProcess[0].order }))
    }
  }

  backFromCreateOrderFromCustomer(event: Event) {
    if (this.beneficiaries.length > 0) {
      this.confirmationService.confirm({
        target: event.target,
        header: '¿Está seguro de regresar?',
        message: 'Perderá toda la información previamente ingresada.',
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
  }

  back(event: Event) {
    if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
      this.backFromCreateOrderDetail(event)
    } else if (this.orderProcess[0].action === 'EditOrderDetail') {
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalPayments({ ...this.orderProcess[0].order }))
    } else if (this.orderProcess[0].action === 'CreateOrderFromCustomer') {
      this.backFromCreateOrderFromCustomer(event)
    } else {
      // BACK FROM createOrderFromAdmin
      this.orderProcess = [{
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
      }]
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreateOrder({ ...this.orderProcess }))
    }
  }

  nextFromCreateOrderDetail() {
    let totalCost: number = 0
    for (const element of this.beneficiaries) {
      if (element !== undefined) {
        totalCost += element.price
      }
    }
    const action: string = this.orderProcess[0].action
    this.orderProcess = [{
      action: action,
      order: {
        orderId: this.orderProcess[0].order.orderId,
        package: this.orderProcess[0].order.package,
        customerId: this.orderProcess[0].order.customerId,
        totalCost: totalCost
      },
      beneficiaries: this.beneficiaries,
    }]
    this.modalPrimeNg.close()
    this.store.dispatch(new OpenModalCreatePayment({ ...this.orderProcess }))
  }

  nextFromEditOrderDetail() {
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
    this.store.dispatch(new EditOrderDetailRequest({ ...customer }))
  }

  nextFromCreateOrderFromCustomer() {
    this.orderProcess = [{
      action: 'CreateOrderFromCustomer',
      order: this.orderProcess[0].order,
      beneficiaries: this.beneficiaries,
    }]
    this.modalPrimeNg.close()
    this.store.dispatch(new OpenModalCreatePayment({ ...this.orderProcess }))
  }

  next() {
    if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
      this.nextFromCreateOrderDetail()
    } else if (this.orderProcess[0].action === 'EditOrderDetail') {
      this.nextFromEditOrderDetail()
    } else if (this.orderProcess[0].action === 'CreateOrderFromCustomer') {
      this.nextFromCreateOrderFromCustomer()
    } else {
      // NEXT FROM CreateOrderFromAdmin
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
