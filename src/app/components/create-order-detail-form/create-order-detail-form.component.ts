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
import { EditOrderDetailRequest, SaveOrderProcess, } from '@/store/ui/actions';
import { ApiService } from '@services/api.service';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-order-detail-form',
  templateUrl: './create-order-detail-form.component.html',
  styleUrls: ['./create-order-detail-form.component.scss'],
  providers: [ConfirmationService]
})

export class CreateOrderDetailFormComponent implements OnInit {
  private ui: Observable<UiState>
  public formGroup: FormGroup
  public role: any
  public user: any
  public allRoles: Array<Role>
  public oneRole: Role | undefined
  public allCustomers: Array<Customer>
  public oneCustomer: Customer | undefined
  public onePackage: Package | undefined
  public orderDetails: Array<OrderDetail>
  public beneficiaries: Array<any> = []
  public orderDetailCustomers: Array<Customer> = []
  public orderProcess: any
  public beneficiariesAmount: number
  public visible: boolean = true
  public frequentTravelers: Array<Customer> = []
  public selectedFrequentTravelers: Array<Customer> = []
  public beneficiariesMaxDate: Date
  public sortOptions: SelectItem[] = []
  public sortOrder: number = 0
  public sortField: string = ''
  public results: string[]
  public allEps: Array<string> = []
  public beneficiariesImages: Array<string> = []
  public customerImages: Array<string> = []
  public beneficiarieImageIndex: number = 0
  public customerImageIndex: number = 0

  constructor(
    public apiService: ApiService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.orderProcess = state.orderProcess.data
      if (this.allRoles !== undefined) {
        this.oneRole = this.allRoles.find(r => r.name === 'Beneficiario')
      }
    })

    this.allEps = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS']

    this.beneficiariesImages = [
      'https://img.freepik.com/vector-gratis/ilustracion-icono-vector-dibujos-animados-perro-lindo-jugando-bola-concepto-icono-deporte-animal-aislado-premium-vector-estilo-dibujos-animados-plana_138676-4121.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/elefante-lindo-ilustracion-icono-vector-dibujos-animados-mano-signo-amor-concepto-icono-naturaleza-animal-aislado-premium-vector-estilo-dibujos-animados-plana_138676-4107.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-hamster-sosteniendo-ilustracion-dibujos-animados-mejilla_138676-2773.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-oveja-agitando-mano-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-plano_138676-4518.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/linda-tortuga-chef-cocinando-ilustracion-dibujos-animados_138676-3230.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-panda-respeto-bambu-bandera-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado_138676-4410.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-unicornio-durmiendo-luna-celebracion-estrella-dibujos-animados-vector-icono-ilustracion-icono-naturaleza-animal_138676-6433.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-premium/cute-sheep-super-hero-cartoon-vector-icono-ilustracion-animal-vacaciones-icono-concepto-aislado-plano_138676-9238.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/cute-panda-summer-waving-hand-cartoon-vector-icon-illustration-concepto-icono-vacaciones-animales-aislado_138676-7160.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587'
    ]

    this.customerImages = [
      'https://img.freepik.com/vector-gratis/lindo-husky-perro-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium_138676-4567.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-unicornio-bebiendo-te-leche-boba-ilustracion-icono-vector-dibujos-animados-arco-iris-icono-bebida-animal_138676-7412.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/cute-rhino-gaming-cartoon-vector-icon-ilustracion-animal-tecnologia-icono-concepto-aislado-premium_138676-7638.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-elefante-sentado-agitando-mano-dibujos-animados-vector-icono-ilustracion_138676-2220.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-vaca-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium-plano_138676-7823.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/ilustracion-icono-vector-dibujos-animados-lindo-sentado-cebra-concepto-icono-naturaleza-animal-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3465.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-unicornio-montando-bicicleta-agitando-mano-dibujos-animados-vector-icono-ilustracion-transporte-animales_138676-6444.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-gato-jugando-mano-telefono-dibujos-animados-vector-icono-ilustracion-concepto-icono-tecnologia-animal-aislado-premium-vector-estilo-dibujos-animados-plana_138676-4231.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
      'https://img.freepik.com/vector-gratis/lindo-pan-chef-agitando-mano-dibujos-animados-vector-icono-ilustracion-comida-objeto-icono-concepto-aislado-plano_138676-4562.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
    ]

    this.sortOptions = [
      { label: 'Precio Alto a Bajo', value: '!price' },
      { label: 'Precio Bajo a Alto', value: 'price' }
    ]

    const currentDate = new Date()
    this.beneficiariesMaxDate = new Date(currentDate)
    this.beneficiariesMaxDate.setDate(currentDate.getDate() - 15)

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
      if (this.orderProcess.action === 'CreateOrderDetail') {
        this.onInitFromCreateOrderDetail()
      } else if ((this.orderProcess.action === 'EditOrderDetail')) {
        this.onInitFromEditOrderDetail()
      } else if (this.orderProcess.action === 'CreateOrder') {
        this.onePackage = this.orderProcess.order.package
        if (this.orderProcess.beneficiaries.length > 0) {
          this.fillBeneficiariesArray()
          if (this.role === 'Cliente') {
            this.beneficiariesAmount = this.orderProcess.beneficiaries.length
          } else {
            if (this.orderProcess.order.beneficiaries > this.orderProcess.beneficiaries.length) {
              this.beneficiariesAmount = this.orderProcess.order.beneficiaries
            } else {
              this.beneficiariesAmount = this.orderProcess.beneficiaries.length
            }
          }
        } else {
          if (this.role === 'Cliente') {
            this.beneficiariesAmount = 1
          } else {
            this.beneficiariesAmount = this.orderProcess.order.beneficiaries
          }
        }
        this.fillFrequentTravelersArray()
      }
    } else {
      this.router.navigate(['Home/Pedidos/'])
    }
  }

  //<--- ON INIT FROM DIFFERENT ENTRIES --->

  searchEps(event: any) {
    const filtered: any[] = []
    const query = event.query.toLowerCase()
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.allEps.length; i++) {
      const Eps = this.allEps[i].toLowerCase()
      if (Eps.includes(query)) {
        filtered.push(this.allEps[i])
      }
    }

    this.results = filtered
  }

  onSortChange(event: any) {
    const value = event.value

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1
      this.sortField = value.substring(1, value.length)
    } else {
      this.sortOrder = 1
      this.sortField = value
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value)
  }

  showLabel(document: string): string {
    if (this.role === 'Cliente') {
      const currentCustomer: Customer = this.allCustomers.find(c => c.userId === this.user['id'])
      if (currentCustomer !== undefined && currentCustomer.document === document) {
        return 'Titular'
      } else {
        const oneCustomer: Customer = this.allCustomers.find(c => c.document === document)
        if (oneCustomer !== undefined) {
          const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
          if (oneRole !== undefined && oneRole.name === 'Cliente') {
            return 'Cliente'
          } else {
            return 'Beneficiario'
          }
        }
      }
    } else {
      if (this.orderProcess.order.customer.document === document) {
        return 'Titular'
      } else {
        const oneCustomer: Customer = this.allCustomers.find(c => c.document === document)
        if (oneCustomer !== undefined) {
          const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
          if (oneRole !== undefined && oneRole.name === 'Cliente') {
            return 'Cliente'
          } else {
            return 'Beneficiario'
          }
        }
        return 'Beneficiario'
      }
    }
  }

  showBadge(document: string): number {
    if (this.orderProcess !== undefined) {
      if (this.role === 'Cliente') {
        const oneCustomer: Customer = this.allCustomers.find(c => c.userId === this.user['id'])
        if (oneCustomer !== undefined && oneCustomer.document === document) {
          return 0
        } else {
          const oneCustomer: Customer = this.allCustomers.find(c => c.document === document)
          if (oneCustomer !== undefined) {
            const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
            if (oneRole !== undefined && oneRole.name === 'Cliente') {
              return 2
            } else {
              return 1
            }
          }
        }
      } else {
        if (this.orderProcess.order.customer.document === document) {
          return 0
        } else {
          const oneCustomer: Customer = this.allCustomers.find(c => c.document === document)
          if (oneCustomer !== undefined) {
            const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
            if (oneRole !== undefined && oneRole.name === 'Cliente') {
              return 2
            } else {
              return 1
            }
          }
          return 1
        }
      }
    }
  }

  onInitFromCreateOrderDetail() {
    for (const element of this.orderProcess.order.payment) {
      if (element !== undefined) {
        for (const anotherElement of element.orderDetail) {
          const customer: Customer = this.allCustomers.find(c => c.customerId === anotherElement.beneficiaryId)
          if (customer !== undefined) {
            this.orderDetailCustomers.push(customer)
          }
        }
      }
    }
    if (this.orderProcess.beneficiaries.length > 0) {
      this.fillBeneficiariesArray()
      this.beneficiariesAmount = this.orderProcess.beneficiaries.length
    } else {
      this.beneficiariesAmount = 1
    }
    this.onePackage = this.orderProcess.order.package
    this.fillFrequentTravelersArray()
  }

  onInitFromEditOrderDetail() {
    this.beneficiariesAmount = 1
    this.formGroup.setValue({
      name: this.orderProcess.customer.name,
      lastName: this.orderProcess.customer.lastName,
      document: this.orderProcess.customer.document,
      address: this.orderProcess.customer.address,
      phoneNumber: this.orderProcess.customer.phoneNumber,
      birthdate: this.dateFormat(this.orderProcess.customer.birthDate),
      eps: this.orderProcess.customer.eps,
      addToFt: false
    })
  }

  //<------------------->

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
    const currenDate = new Date()
    const birthdate = new Date(date)
    const milisecondsAge = currenDate.getTime() - birthdate.getTime()
    const yearAge = milisecondsAge / (1000 * 60 * 60 * 24 * 365.25)

    if (yearAge < 5) {
      return this.onePackage.aditionalPrice
    } else if (yearAge >= 5 && yearAge < 10) {
      return this.onePackage.price * 0.70
    } else {
      return this.onePackage.price
    }
  }

  //<------------------->

  //<--- COMPONENT ACTIONS --->

  setBeneficiarieImage(document: string): string {
    if (this.role === 'Cliente') {
      const oneCustomer: Customer = this.allCustomers.find(c => c.userId === this.user['id'])
      if (oneCustomer !== undefined && oneCustomer.document === document) {
        return 'https://img.freepik.com/vector-gratis/lindo-slot-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium-plano_138676-4995.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587'
      } else {
        return this.nonTitularImage(document)
      }
    } else {
      if (this.orderProcess.order.customer.document === document) {
        return 'https://img.freepik.com/vector-gratis/lindo-slot-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium-plano_138676-4995.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587'
      } else {
        return this.nonTitularImage(document)
      }
    }
  }

  nonTitularImage(document: string): string {
    const oneCustomer: Customer = this.allCustomers.find(c => c.document === document)
    if (oneCustomer !== undefined) {
      const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
      if (oneRole !== undefined && oneRole.name === 'Cliente') {
        return this.customerImage()
      } else {
        return this.beneficiarieImage()
      }
    }
    return this.beneficiarieImage()
  }

  customerImage(): string {
    const image = this.customerImages[this.customerImageIndex]
    if (this.customerImageIndex === 8) {
      this.customerImageIndex = 0
    } else {
      this.customerImageIndex++
    }
    return image
  }

  beneficiarieImage(): string {
    const image = this.beneficiariesImages[this.beneficiarieImageIndex]
    if (this.beneficiarieImageIndex === 8) {
      this.beneficiarieImageIndex = 0
    } else {
      this.beneficiarieImageIndex++
    }
    return image
  }

  fillBeneficiariesArray() {
    for (const element of this.orderProcess.beneficiaries) {
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
              image: this.setBeneficiarieImage(element.document),
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
              image: this.setBeneficiarieImage(element.document),
              price: element.price,
              addToFt: element.addToFt
            })
          }
        }
      }
    }
  }

  canSelect(frequentTraveler: Customer): boolean {
    const exists: any = this.beneficiaries.find(b => b.document === frequentTraveler.document)
    if (exists !== undefined) {
      return true
    }
    return false
  }

  areDisabled(selected: any): boolean {
    let areDisabled: boolean = false
    let arentDisabled: boolean = false
    for (const element of selected) {
      const exists: any = this.beneficiaries.find(b => b.document === element.document)
      if (exists !== undefined) {
        areDisabled = true
      } else {
        arentDisabled = true
      }
    }
    return arentDisabled
  }

  fillFrequentTravelersArray() {
    if (this.orderProcess.order.customer.frequentTraveler !== undefined) {
      for (const element of this.orderProcess.order.customer.frequentTraveler) {
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
      image: this.setBeneficiarieImage(this.oneCustomer.document),
      price: this.adjustPriceAccordingToAge(this.oneCustomer.birthDate),
      addToFt: false
    })
    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario agregado exitosamente.' })
    this.formGroup.reset()
    this.updateVisibility()
  }

  deleteBeneficiarie(document: string) {
    const oneCustomer = this.beneficiaries.find(c => c.document === document)
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Está seguro de eliminar a ' + oneCustomer.name + ' ' + oneCustomer.lastName + '?',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-outlined',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass: 'p-button-danger',
      acceptIcon: 'pi pi-trash',
      accept: () => {
        const index = this.beneficiaries.indexOf(oneCustomer)
        this.beneficiaries.splice(index, 1)
        if (this.beneficiariesAmount > 1) {
          this.beneficiariesAmount--
        }
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario eliminado exitosamente.' })
        this.updateVisibility()
      }
    })
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
              image: this.setBeneficiarieImage(element.document),
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
      element.hide(event)
      if (!flag) {
        this.messageService.add({ key: 'alert-message', severity: 'warn', summary: '¡Cupos insuficientes!', detail: 'Uno o varios Beneficiarios no se pudieron añadir.' })
      } else {
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario/s agregado/s exitosamente.' })
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
      const beneficiarie: any = {
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        address: this.formGroup.value.address,
        phoneNumber: this.formGroup.value.phoneNumber,
        birthDate: this.formGroup.value.birthdate,
        eps: this.formGroup.value.eps,
        user: user,
        image: this.setBeneficiarieImage(this.formGroup.value.document),
        price: this.adjustPriceAccordingToAge(this.formGroup.value.birthdate),
        addToFt: this.formGroup.value.addToFt
      }

      this.beneficiaries.push(beneficiarie)
      this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario agregado exitosamente.' })
      this.formGroup.reset()
      this.updateVisibility()
    }
  }

  //<------------------->

  //<--- VALIDATIONS --->

  comesFromEdit(): boolean {
    if (this.orderProcess !== undefined) {
      if (this.orderProcess.action === 'EditOrderDetail') {
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
    if (this.orderProcess.action !== 'EditOrderDetail') {
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
    if (this.orderProcess.action !== 'EditOrderDetail') {
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
        const regularExpresion = /^[0-9]+$/
        return regularExpresion.test(this.formGroup.value.document)
      }
    }
    return true
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

  alreadyExistsFromEdit(): boolean {
    if (this.orderProcess.action === 'EditOrderDetail') {
      if (this.formGroup.value.document.length >= 8) {
        this.oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
        if (this.oneCustomer !== undefined) {
          if (this.oneCustomer.document === this.orderProcess.customer.document) {
            return false
          }
          return true
        }
      }
    }
    return false
  }

  alreadyExists(): boolean {
    if (this.orderProcess.action !== 'EditOrderDetail') {
      if (this.orderProcess.action === 'CreateOrderDetail') {
        const oneCustomer = this.orderDetailCustomers.find(b => b.document === this.formGroup.value.document)
        const anotherCustomer = this.beneficiaries.find(b => b.document === this.formGroup.value.document)
        if (anotherCustomer === undefined && oneCustomer === undefined) {
          return false
        }
      } else if (this.orderProcess.action === 'CreateOrder') {
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
          this.router.navigate(['Home/DetallesPedido/' + this.orderProcess.order.orderId])
        }
      })
    } else {
      this.router.navigate(['Home/DetallesPedido/' + this.orderProcess.order.orderId])
    }
  }

  backFromCreateOrder(event: Event) {
    if (this.role === 'Cliente') {
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
            this.router.navigate(['Home/DetallesPaquete/' + this.orderProcess.order.package.packageId])
          }
        })
      } else {
        this.router.navigate(['Home/DetallesPaquete/' + this.orderProcess.order.package.packageId])
      }
    } else {
      this.orderProcess = {
        order: this.orderProcess.order,
        beneficiaries: this.beneficiaries,
      }
      this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
      this.router.navigate(['Home/CrearPedido/asas'])
    }
  }

  back(event: Event) {
    if (this.orderProcess.action === 'CreateOrderDetail') {
      this.backFromCreateOrderDetail(event)
    } else if (this.orderProcess.action === 'EditOrderDetail') {
      this.router.navigate(['Home/DetallesAbono/' + this.orderProcess.paymentId])
    } else if (this.orderProcess.action === 'CreateOrder') {
      this.backFromCreateOrder(event)
    }
  }

  nextFromCreateOrderDetail() {
    let totalCost: number = 0
    for (const element of this.beneficiaries) {
      if (element !== undefined) {
        totalCost += element.price
      }
    }
    const action: string = this.orderProcess.action
    this.orderProcess = {
      action: action,
      order: {
        orderId: this.orderProcess.order.orderId,
        package: this.orderProcess.order.package,
        customer: this.orderProcess.order.customer,
        totalCost: totalCost
      },
      beneficiaries: this.beneficiaries,
    }
    this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
    this.router.navigate(['Home/CrearAbono/asas'])
  }

  nextFromEditOrderDetail() {
    const customer: Customer = {
      customerId: this.orderProcess.customer.customerId,
      name: this.formGroup.value.name,
      lastName: this.formGroup.value.lastName,
      document: this.formGroup.value.document,
      birthDate: this.formGroup.value.birthdate,
      phoneNumber: this.formGroup.value.phoneNumber,
      address: this.formGroup.value.address,
      eps: this.formGroup.value.eps,
      userId: this.orderProcess.customer.userId
    }
    this.store.dispatch(new EditOrderDetailRequest({ ...customer }))
    this.router.navigate(['Home/DetallesAbono/' + this.orderProcess.paymentId])
  }

  nextFromCreateOrder() {
    this.orderProcess = {
      action: 'CreateOrder',
      order: this.orderProcess.order,
      beneficiaries: this.beneficiaries,
    }
    this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
    this.router.navigate(['Home/CrearAbono/asas'])
  }

  next() {
    if (this.orderProcess.action === 'CreateOrderDetail') {
      this.nextFromCreateOrderDetail()
    } else if (this.orderProcess.action === 'EditOrderDetail') {
      this.nextFromEditOrderDetail()
    } else if (this.orderProcess.action === 'CreateOrder') {
      this.nextFromCreateOrder()
    }
  }
}
