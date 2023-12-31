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
import { ConfirmationService } from 'primeng/api';
import { SaveOrderProcess, } from '@/store/ui/actions';
import { ApiService } from '@services/api.service';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

interface Avatar {
  assetRoute: string;
  link: string;
}
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
  public beneficiaries: Array<any> = []
  public orderDetailCustomers: Array<Customer> = []
  public orderProcess: any
  public oneOrder: any
  public beneficiariesAmount: number
  public visible: boolean = true
  public frequentTravelers: Array<Customer> = []
  public selectedFrequentTravelers: Array<Customer> = []
  public beneficiariesMaxDate: Date
  public sortOptions: SelectItem[] = []
  public sortOrder: number = 0
  public sortField: string = ''
  public addButtonLoading: boolean = false
  public reduceButtonLoading: boolean = false
  public takenQuotas: number = 0
  public results: string[]
  public allEps: Array<string> = []
  public beneficiarieImageIndex: number = 0
  public customerImageIndex: number = 0
  public ftCheck: boolean = false
  public customerImageLink: string = 'https://www.freepik.es/vector-gratis/lindo-slot-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium-plano_27313232.htm#query=perezoso&position=13&from_view=author'
  public authorImagesLink: string = 'https://www.freepik.es/autor/catalyststuff'


  public beneficiariesImages: Array<Avatar> = [
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/perro-futbol.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/ilustracion-icono-vector-dibujos-animados-perro-lindo-jugando-bola-concepto-icono-deporte-animal-aislado-premium-vector-estilo-dibujos-animados-plana_22407119.htm#query=Perro%20lindo%20jugando%20con%20bola&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/elefante.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/elefante-lindo-ilustracion-icono-vector-dibujos-animados-mano-signo-amor-concepto-icono-naturaleza-animal-aislado-premium-vector-estilo-dibujos-animados-plana_22383451.htm#query=elefante%20lindo&position=1&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/hamster.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-hamster-sosteniendo-ilustracion-dibujos-animados-mejilla_13037994.htm#query=lindo%20hamster%20sosteniendo&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/oveja.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-oveja-agitando-mano-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-plano_24563921.htm#query=linda%20oveja%20agitando%20mano&position=1&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/tortuga-chef.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/linda-tortuga-chef-cocinando-ilustracion-dibujos-animados_14877534.htm#query=linda%20tortuga%20chef&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/panda-bambu.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-panda-bambu-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-vector-aislado_23767976.htm#query=lindo%20panda%20bambu&position=9&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/unicornio-luna.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-unicornio-durmiendo-luna-celebracion-estrella-dibujos-animados-vector-icono-ilustracion-icono-naturaleza-animal_33777473.htm#query=lindo%20unicornio%20durmiendo&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/dinosaurio.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/ilustracion-icono-vector-dibujos-animados-pie-dinosaurio-lindo-naturaleza-animal-icono-concepto-aislado-premium_34010129.htm#page=6&position=19&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/beneficiaries/panda-gafas.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/cute-panda-summer-waving-hand-cartoon-vector-icon-illustration-concepto-icono-vacaciones-animales-aislado_36890859.htm#query=cute%20panda%20summer%20waving&position=0&from_view=author'
    }
  ];

  public customerImages: Array<Avatar> = [
    {
      'assetRoute': 'assets/img/avatars/od/customers/husky.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-husky-perro-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium_24921543.htm#query=lindo%20husky%20perro%20sentado&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/unicornio-bebiendo.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-unicornio-bebiendo-te-leche-boba-ilustracion-icono-vector-dibujos-animados-arco-iris-icono-bebida-animal_38195156.htm#query=lindo%20unicornio%20bebiendo&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/rino-gamer.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/cute-rhino-gaming-cartoon-vector-icon-ilustracion-animal-tecnologia-icono-concepto-aislado-premium_39515589.htm#query=cute%20rinho%20gaming&position=4&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/elefante-saludando.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-elefante-sentado-agitando-mano-dibujos-animados-vector-icono-ilustracion_11047569.htm#query=lindo%20elefante%20sentado&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/vaca-sentada.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-vaca-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium-plano_40605642.htm#query=lindo%20vaca%20sentado&position=1&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/cebra-sentada.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/ilustracion-icono-vector-dibujos-animados-lindo-sentado-cebra-concepto-icono-naturaleza-animal-aislado-vector-premium-estilo-dibujos-animados-plana_16704035.htm#query=lindo%20sentado%20cebra&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/unicornio-bici.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-unicornio-montando-bicicleta-agitando-mano-dibujos-animados-vector-icono-ilustracion-transporte-animales_33777511.htm#query=lindo%20unicornio%20montando%20bicicleta&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/gato-telefono.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-gato-jugando-mano-telefono-dibujos-animados-vector-icono-ilustracion-concepto-icono-tecnologia-animal-aislado-premium-vector-estilo-dibujos-animados-plana_23006671.htm#query=lindo%20gato%20jugando%20mano%20telefono&position=0&from_view=author'
    },
    {
      'assetRoute': 'assets/img/avatars/od/customers/pan-chef.jpeg',
      'link': 'https://www.freepik.es/vector-gratis/lindo-pan-chef-agitando-mano-dibujos-animados-vector-icono-ilustracion-comida-objeto-icono-concepto-aislado-plano_24921538.htm#query=pan%20chef&position=0&from_view=author'
    }
  ];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
        Validators.minLength(6),
        Validators.maxLength(15)
        ]],
      address: ['',
        [Validators.required,
        Validators.minLength(15)
        ]],
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
        this.takenQuotas = this.orderProcess.order.takenQuotas
        this.oneOrder = this.orderProcess.order
        this.onePackage = this.oneOrder.package
        if (this.orderProcess.beneficiaries.length > 0) {
          this.fillBeneficiariesArray()
          if (this.role === 'Cliente') {
            this.beneficiariesAmount = this.orderProcess.beneficiaries.length
          } else {
            if (this.oneOrder.beneficiaries > this.orderProcess.beneficiaries.length) {
              this.beneficiariesAmount = this.oneOrder.beneficiaries
            } else {
              this.beneficiariesAmount = this.orderProcess.beneficiaries.length
            }
          }
        } else {
          if (this.role === 'Cliente') {
            this.beneficiariesAmount = 1
          } else {
            this.beneficiariesAmount = this.oneOrder.beneficiaries
          }
        }
        this.fillFrequentTravelersArray()
      }
    } else {
      this.router.navigate(['Home/Pedidos/'])
    }
  }

  //<--- ON INIT FROM DIFFERENT ENTRIES --->

  onAddressChange(address: any) {
    if (this.formGroup) {
      const addressHtml = address.adr_address;
      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.display = 'none';
      hiddenDiv.innerHTML = addressHtml;
      const locality = hiddenDiv.querySelector('.locality')?.textContent || '';
      const country = hiddenDiv.querySelector('.country-name')?.textContent || '';
      const regionElements = hiddenDiv.querySelectorAll('.region');
      if (regionElements.length >= 2) {
        const region = regionElements[0].textContent || '';
        const extractedText = `${address.name}, ${locality}, ${region}, ${country}`;
        this.formGroup.get('address').setValue(extractedText);
      }
    }
  }

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
      if (this.oneOrder.customer.document === document) {
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
        if (this.oneOrder.customer.document === document) {
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
    this.takenQuotas = this.orderProcess.order.takenQuotas
    this.oneOrder = this.orderProcess.order.order
    for (const element of this.oneOrder.payment) {
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
    this.onePackage = this.oneOrder.package
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

    const price: number = this.onePackage.price + this.onePackage.aditionalPrice
    if (yearAge < 5) {
      return this.onePackage.aditionalPrice
    } else if (yearAge >= 5 && yearAge < 10) {
      return price * 0.70
    } else {
      return price
    }
  }

  //<------------------->

  //<--- COMPONENT ACTIONS --->

  setBeneficiarieImage(document: string): string {
    if (this.role === 'Cliente') {
      const oneCustomer: Customer = this.allCustomers.find(c => c.userId === this.user['id'])
      if (oneCustomer !== undefined && oneCustomer.document === document) {
        return 'assets/img/avatars/titular.jpeg'
      } else {
        return this.nonTitularImage(document)
      }
    } else {
      if (this.oneOrder.customer.document === document) {
        return 'assets/img/avatars/titular.jpeg'
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
    const image = this.customerImages[this.customerImageIndex].assetRoute
    if (this.customerImageIndex === 8) {
      this.customerImageIndex = 0
    } else {
      this.customerImageIndex++
    }
    return image
  }

  beneficiarieImage(): string {
    const image = this.beneficiariesImages[this.beneficiarieImageIndex].assetRoute
    if (this.beneficiarieImageIndex === 8) {
      this.beneficiarieImageIndex = 0
    } else {
      this.beneficiarieImageIndex++
    }
    return image
  }

  getUrlAvatar(assetRoute: string): string {
    if (this.beneficiariesImages.length > 0) {
      const bUrl = this.beneficiariesImages.find(b => b.assetRoute === assetRoute)
      if (!bUrl) {
        const cUrl = this.customerImages.find(b => b.assetRoute === assetRoute)
        if (!cUrl) {
          return this.customerImageLink
        }
        return cUrl.link
      }
      return bUrl.link
    }
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

  //<--- FREQUENT TRAVELER ACTIONS --->

  hasCheckedFt(): boolean {
    if (this.selectedFrequentTravelers.length > 0) {
      for (const element of this.selectedFrequentTravelers) {
        const alreadyExistsFromBeneficiaries: any = this.beneficiaries.find(b => b.document === element.document)
        const alreadyExistsFromOrderDetail: Customer = this.orderDetailCustomers.find(od => od.customerId === element.customerId)
        if (alreadyExistsFromBeneficiaries !== undefined || alreadyExistsFromOrderDetail !== undefined) {
          return true
        }
        return false
      }
    }
  }

  canSelect(frequentTraveler: Customer): boolean {
    const alreadyExistsFromBeneficiaries: any = this.beneficiaries.find(b => b.document === frequentTraveler.document)
    const alreadyExistsFromOrderDetail: Customer = this.orderDetailCustomers.find(od => od.customerId === frequentTraveler.customerId)
    if (alreadyExistsFromBeneficiaries !== undefined || alreadyExistsFromOrderDetail !== undefined) {
      return true
    }
    return false
  }

  areDisabled(selected: any): boolean {
    let areDisabled: boolean = false
    let arentDisabled: boolean = false
    if (selected.length > 0) {
      for (const element of selected) {
        const alreadyExistsFromBeneficiaries: any = this.beneficiaries.find(b => b.customerId === element.customerId)
        const alreadyExistsFromOrderDetail: Customer = this.orderDetailCustomers.find(od => od.customerId === element.customerId)
        if (alreadyExistsFromBeneficiaries !== undefined || alreadyExistsFromOrderDetail !== undefined) {
          areDisabled = true
        } else {
          arentDisabled = true
        }
      }
    }
    return arentDisabled
  }

  preSelectedFrequentTravelers(frequentTraveler: Customer) {
    const alreadyExistsFromBeneficiaries: any = this.beneficiaries.find(b => b.customerId === frequentTraveler.customerId)
    const alreadyExistsFromOrderDetail: Customer = this.orderDetailCustomers.find(od => od.customerId === frequentTraveler.customerId)
    if (alreadyExistsFromOrderDetail !== undefined || alreadyExistsFromBeneficiaries !== undefined) {
      this.selectedFrequentTravelers.push(frequentTraveler)
    }
  }

  fillFrequentTravelersArray() {
    if (this.oneOrder.customer.frequentTraveler !== undefined) {
      for (const element of this.oneOrder.customer.frequentTraveler) {
        const customer = this.allCustomers.find(c => c.customerId === element.travelerId)
        if (customer !== undefined) {
          this.preSelectedFrequentTravelers(customer)
          const exists = this.frequentTravelers.find(ft => ft.customerId === customer.customerId)
          if (exists === undefined) {
            this.frequentTravelers.push(customer)
          }
        }
      }
    }
  }

  async addFrequentTraveler(event: Event, element: any) {
    if (this.selectedFrequentTravelers !== undefined) {
      let flag: boolean = true
      let counter: number = this.beneficiariesAmount
      let quotasToReduce: number = 0
      for (const element of this.selectedFrequentTravelers) {
        const alreadyExists = this.beneficiaries.find(b => b.document === element.document)
        const alreadyExistsFromOrderDetail = this.orderDetailCustomers.find(od => od.document === element.document)
        if (alreadyExists === undefined && alreadyExistsFromOrderDetail === undefined) {
          if (this.onePackage.availableQuotas + this.takenQuotas > this.beneficiaries.length) {
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
            if (this.beneficiariesAmount < this.onePackage.availableQuotas + this.takenQuotas && this.beneficiariesForm()) {
              if (this.beneficiaries.length > this.beneficiariesAmount) {
                counter++
                quotasToReduce++
              }
            }
          } else {
            flag = false
          }
        }
      }
      await this.quotasToReduceFromPackage(quotasToReduce)
      this.updateVisibility()
      element.hide(event)
      if (!flag) {
        this.messageService.add({ key: 'alert-message', severity: 'warn', summary: '¡Cupos insuficientes!', detail: 'Uno o más Beneficiarios no se pudieron añadir.' })
      } else {
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario/s agregado/s exitosamente.' })
      }
    }
  }

  async quotasToReduceFromPackage(quotas: number) {
    const packagePromise: Package = await new Promise((resolve, reject) => {
      this.apiService.getPackageById(this.onePackage.packageId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (packagePromise) {
      const onePackage = {
        packageId: packagePromise['packageId'],
        name: packagePromise['name'],
        destination: packagePromise['destination'],
        details: packagePromise['details'],
        transport: packagePromise['transport'],
        hotel: packagePromise['hotel'],
        arrivalDate: packagePromise['arrivalDate'],
        departureDate: packagePromise['departureDate'],
        departurePoint: packagePromise['departurePoint'],
        totalQuotas: packagePromise['totalQuotas'],
        availableQuotas: packagePromise['availableQuotas'],
        price: packagePromise['price'],
        type: packagePromise['type'],
        status: packagePromise['status'],
        aditionalPrice: packagePromise['aditionalPrice'],
        photos: packagePromise['photos']
      }
      if (this.onePackage.availableQuotas + this.takenQuotas >= this.beneficiariesAmount + 1) {
        const updatePackage: Package = {
          packageId: onePackage.packageId,
          name: onePackage.name,
          destination: onePackage.destination,
          details: onePackage.details,
          transport: onePackage.transport,
          hotel: onePackage.hotel,
          arrivalDate: onePackage.arrivalDate,
          departureDate: onePackage.departureDate,
          departurePoint: onePackage.departurePoint,
          totalQuotas: onePackage.totalQuotas,
          availableQuotas: onePackage.availableQuotas - quotas,
          price: onePackage.price,
          type: onePackage.type,
          status: onePackage.status,
          aditionalPrice: onePackage.aditionalPrice,
          photos: onePackage.photos
        }
        const updatedPackagePromise: boolean = await new Promise((resolve, reject) => {
          this.apiService.updatePackage(updatePackage.packageId, updatePackage).subscribe({
            next: () => {
              resolve(true)
            },
            error: (err) => {
              reject(err)
            }
          })
        })
        if (updatedPackagePromise) {
          this.onePackage = updatePackage
          this.beneficiariesAmount += quotas
          this.takenQuotas += quotas
        }
      }
    }
  }

  //<-------------->

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
      key: 'confirmation-message',
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
          this.reduceBeneficiariesAmountAction()
        }
        if (this.beneficiaries.length === 0) {
          this.ftCheck = false
        }
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario eliminado exitosamente.' })
        this.updateVisibility()
      }
    })
  }

  async reduceBeneficiariesAmountAction() {
    const packagePromise: Package = await new Promise((resolve, reject) => {
      this.apiService.getPackageById(this.onePackage.packageId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (packagePromise) {
      const onePackage = {
        packageId: packagePromise['packageId'],
        name: packagePromise['name'],
        destination: packagePromise['destination'],
        details: packagePromise['details'],
        transport: packagePromise['transport'],
        hotel: packagePromise['hotel'],
        arrivalDate: packagePromise['arrivalDate'],
        departureDate: packagePromise['departureDate'],
        departurePoint: packagePromise['departurePoint'],
        totalQuotas: packagePromise['totalQuotas'],
        availableQuotas: packagePromise['availableQuotas'],
        price: packagePromise['price'],
        type: packagePromise['type'],
        status: packagePromise['status'],
        aditionalPrice: packagePromise['aditionalPrice'],
        photos: packagePromise['photos']
      }
      const updatePackage: Package = {
        packageId: onePackage.packageId,
        name: onePackage.name,
        destination: onePackage.destination,
        details: onePackage.details,
        transport: onePackage.transport,
        hotel: onePackage.hotel,
        arrivalDate: onePackage.arrivalDate,
        departureDate: onePackage.departureDate,
        departurePoint: onePackage.departurePoint,
        totalQuotas: onePackage.totalQuotas,
        availableQuotas: onePackage.availableQuotas + 1,
        price: onePackage.price,
        type: onePackage.type,
        status: onePackage.status,
        aditionalPrice: onePackage.aditionalPrice,
        photos: onePackage.photos
      }
      const updatedPackagePromise: boolean = await new Promise((resolve, reject) => {
        this.apiService.updatePackage(updatePackage.packageId, updatePackage).subscribe({
          next: () => {
            resolve(true)
          },
          error: (err) => {
            reject(err)
          }
        })
      })
      if (updatedPackagePromise) {
        this.onePackage = updatePackage
        this.beneficiariesAmount--
        this.takenQuotas--
      }
    }
  }

  addAnotherBeneficiarieButton(): boolean {
    if (this.onePackage.availableQuotas + this.takenQuotas >= this.beneficiariesAmount + 1) {
      return true
    }
    return false
  }

  async addAnotherBeneficiarie() {
    if (this.onePackage.availableQuotas + this.takenQuotas >= this.beneficiariesAmount + 1) {
      this.addButtonLoading = true
      await this.quotasToReduceFromPackage(1)
      this.addButtonLoading = false
    }
  }

  async reduceBeneficiariesAmount() {
    if (this.beneficiariesAmount > this.beneficiaries.length) {
      if (this.beneficiariesAmount > 1) {
        this.reduceButtonLoading = true
        await this.reduceBeneficiariesAmountAction()
        this.reduceButtonLoading = false
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
      if (this.formGroup.value.document.length >= 6) {
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

  async editPackage(quotas: number) {
    const packagePromise: Package = await new Promise((resolve, reject) => {
      this.apiService.getPackageById(this.onePackage.packageId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (packagePromise) {
      const onePackage = {
        packageId: packagePromise['packageId'],
        name: packagePromise['name'],
        destination: packagePromise['destination'],
        details: packagePromise['details'],
        transport: packagePromise['transport'],
        hotel: packagePromise['hotel'],
        arrivalDate: packagePromise['arrivalDate'],
        departureDate: packagePromise['departureDate'],
        departurePoint: packagePromise['departurePoint'],
        totalQuotas: packagePromise['totalQuotas'],
        availableQuotas: packagePromise['availableQuotas'],
        price: packagePromise['price'],
        type: packagePromise['type'],
        status: packagePromise['status'],
        aditionalPrice: packagePromise['aditionalPrice'],
        photos: packagePromise['photos']
      }
      const updatePackage: Package = {
        packageId: onePackage.packageId,
        name: onePackage.name,
        destination: onePackage.destination,
        details: onePackage.details,
        transport: onePackage.transport,
        hotel: onePackage.hotel,
        arrivalDate: onePackage.arrivalDate,
        departureDate: onePackage.departureDate,
        departurePoint: onePackage.departurePoint,
        totalQuotas: onePackage.totalQuotas,
        availableQuotas: onePackage.availableQuotas + quotas,
        price: onePackage.price,
        type: onePackage.type,
        status: onePackage.status,
        aditionalPrice: onePackage.aditionalPrice,
        photos: onePackage.photos
      }
      this.apiService.updatePackage(updatePackage.packageId, updatePackage).subscribe({
        next: (data) => {
        },
        error: (err) => {
          console.log("Error while updating: ", err)
        }
      })
    }
  }

  alreadyExistsFromEdit(): boolean {
    if (this.orderProcess.action === 'EditOrderDetail') {
      if (this.formGroup.value.document.length >= 6) {
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

  backFromCreateOrderDetail() {
    if (this.beneficiaries.length > 0) {
      this.confirmationService.confirm({
        key: 'confirmation-message',
        header: '¿Está seguro de regresar?',
        message: 'Perderá toda la información previamente ingresada.',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Permanecer',
        rejectIcon: 'pi pi-check',
        acceptLabel: 'Sí, regresar',
        acceptIcon: 'pi pi-times',
        acceptButtonStyleClass: 'p-button-outlined',
        accept: () => {
          const orderId: string = this.oneOrder.orderId
          this.editPackage(this.takenQuotas)
          this.store.dispatch(new SaveOrderProcess(undefined))
          this.router.navigate(['Home/DetallesPedido/' + orderId])
        }
      })
    } else {
      const orderId: string = this.oneOrder.orderId
      this.editPackage(this.takenQuotas)
      this.store.dispatch(new SaveOrderProcess(undefined))
      this.router.navigate(['Home/DetallesPedido/' + orderId])
    }
  }

  backFromCreateOrder() {
    if (this.role === 'Cliente') {
      if (this.beneficiaries.length > 0) {
        this.confirmationService.confirm({
          key: 'confirmation-message',
          header: '¿Está seguro de regresar?',
          message: 'Perderá toda la información previamente ingresada.',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Permanecer',
          rejectIcon: 'pi pi-check',
          acceptLabel: 'Sí, regresar',
          acceptIcon: 'pi pi-times',
          acceptButtonStyleClass: 'p-button-outlined',
          accept: () => {
            this.editPackage(this.takenQuotas)
            const packageId: string = this.oneOrder.package.packageId
            this.store.dispatch(new SaveOrderProcess(undefined))
            this.router.navigate(['Home/DetallesPaquete/' + packageId])
          }
        })
      } else {
        this.editPackage(this.takenQuotas)
        const packageId: string = this.oneOrder.package.packageId
        this.store.dispatch(new SaveOrderProcess(undefined))
        this.router.navigate(['Home/DetallesPaquete/' + packageId])
      }
    } else {
      this.orderProcess = {
        action: 'CreateOrder',
        order: {
          customer: this.oneOrder.customer,
          package: this.oneOrder.package,
          beneficiaries: this.oneOrder.beneficiaries,
          takenQuotas: this.takenQuotas
        },
        beneficiaries: this.beneficiaries,
      }
      this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
      this.router.navigate(['Home/RegistrarPedido'])
    }
  }

  back() {
    if (this.orderProcess.action === 'CreateOrderDetail') {
      this.backFromCreateOrderDetail()
    } else if (this.orderProcess.action === 'EditOrderDetail') {
      const paymentId: string = this.orderProcess.paymentId
      this.store.dispatch(new SaveOrderProcess(undefined))
      this.router.navigate(['Home/DetallesAbono/' + paymentId])
    } else if (this.orderProcess.action === 'CreateOrder') {
      this.backFromCreateOrder()
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
        orderId: this.oneOrder.orderId,
        package: this.oneOrder.package,
        customer: this.oneOrder.customer,
        totalCost: totalCost,
        takenQuotas: this.takenQuotas
      },
      beneficiaries: this.beneficiaries,
    }
    this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
    this.router.navigate(['Home/ProcesoAbonos'])
  }

  async nextFromEditOrderDetail() {
    const customer: Customer = {
      customerId: this.orderProcess.customer.customerId,
      name: this.formGroup.value.name,
      lastName: this.formGroup.value.lastName,
      document: this.orderProcess.customer.document,
      birthDate: this.orderProcess.customer.birthDate,
      phoneNumber: this.formGroup.value.phoneNumber,
      address: this.formGroup.value.address,
      eps: this.formGroup.value.eps,
      userId: this.orderProcess.customer.userId
    }

    this.apiService.updateCustomer(customer.customerId, customer).subscribe({
      next: (data) => { },
      error: (err) => {
        console.log(err)
      }
    })

    this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
    this.router.navigate(['Home/DetallesAbono/' + this.orderProcess.paymentId])
  }

  nextFromCreateOrder() {
    this.orderProcess = {
      action: 'CreateOrder',
      order: {
        customer: this.oneOrder.customer,
        package: this.oneOrder.package,
        beneficiaries: this.beneficiariesAmount,
        takenQuotas: this.takenQuotas
      },
      beneficiaries: this.beneficiaries,
    }
    this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
    this.router.navigate(['Home/ProcesoAbonos'])
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
