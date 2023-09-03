import { Component, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Router } from '@angular/router';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';
import { Customer } from '@/models/customer';
import { ApiService } from '@services/api.service';
import { SelectItem } from 'primeng/api';
import { Role } from '@/models/role';
import { ActivatedRoute } from '@angular/router';
import { Payment } from '@/models/payment';
import { OrderDetail } from '@/models/orderDetail';
import { environment } from 'environments/environment';
import { ConfirmationService } from 'primeng/api';
import { DeleteOrderDetailRequest, GetAllCustomerRequest, GetUsersRequest, SaveOrderProcess } from '@/store/ui/actions';
import { User } from '@/models/user';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})

export class PaymentDetailsComponent implements OnInit {
  private ui: Observable<UiState>
  public role: any
  public user: any
  public allCustomers: Array<Customer>
  public orderProcess: any
  public visible: boolean = true
  public beneficiariesVisibility: boolean = false
  public beneficiaries: Array<any> = []
  public sortOptions: SelectItem[] = []
  public sortOrder: number = 0;
  public allUsers: Array<User>
  public oneUser: User
  public sortField: string = '';
  public allRoles: Array<Role>
  public beneficiariesImages: Array<string> = []
  public customerImages: Array<string> = []
  public beneficiarieImageIndex: number = 0
  public customerImageIndex: number = 0
  public paymentId: string
  public onePayment: Payment
  public orderDetails: Array<OrderDetail> = []
  public baseUrl: string = environment.endPoint + 'resources/payments/'

  constructor(
    public apiService: ApiService,
    private store: Store<AppState>,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest)
    this.store.dispatch(new GetUsersRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allRoles = state.allRoles.data
      this.allUsers = state.allUsers.data
      this.allCustomers = state.allCustomers.data
      this.orderProcess = state.orderProcess.data
      this.route.paramMap.subscribe((params) => {
        this.paymentId = params.get('id');
        this.getPaymentById()
      });
    })

    this.beneficiariesImages = [
      'assets/img/avatars/od/beneficiaries/perro-futbol.jpeg',
      'assets/img/avatars/od/beneficiaries/elefante.jpeg',
      'assets/img/avatars/od/beneficiaries/hamster.jpeg',
      'assets/img/avatars/od/beneficiaries/oveja.jpeg',
      'assets/img/avatars/od/beneficiaries/tortuga-chef.jpeg',
      'assets/img/avatars/od/beneficiaries/panda-bambu.jpeg',
      'assets/img/avatars/od/beneficiaries/unicornio-luna.jpeg',
      'assets/img/avatars/od/beneficiaries/dinosaurio.jpeg',
      'assets/img/avatars/od/beneficiaries/panda-gafas.jpeg'
    ]

    this.customerImages = [
      'assets/img/avatars/od/customers/husky.jpeg',
      'assets/img/avatars/od/customers/unicornio-bebiendo.jpeg',
      'assets/img/avatars/od/customers/rino-gamer.jpeg',
      'assets/img/avatars/od/customers/elefante-saludando.jpeg',
      'assets/img/avatars/od/customers/vaca-sentada.jpeg',
      'assets/img/avatars/od/customers/cebra-sentada.jpeg',
      'assets/img/avatars/od/customers/unicornio-bici.jpeg',
      'assets/img/avatars/od/customers/gato-telefono.jpeg',
      'assets/img/avatars/od/customers/pan-chef.jpeg',
    ]

    this.sortOptions = [
      { label: 'Precio Alto a Bajo', value: '!unitPrice' },
      { label: 'Precio Bajo a Alto', value: 'unitPrice' }
    ];
  }

  async getPaymentById() {
    const paymentPromise = await new Promise((resolve, reject) => {
      this.apiService.getPaymentById(this.paymentId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (paymentPromise) {
      this.onePayment = {
        paymentId: paymentPromise['paymentId'],
        amount: paymentPromise['amount'],
        remainingAmount: paymentPromise['remainingAmount'],
        date: paymentPromise['date'],
        orderDetail: paymentPromise['orderDetail'],
        image: paymentPromise['image'],
        status: paymentPromise['status'],
        orderId: paymentPromise['orderId'],
        order: paymentPromise['order']
      }
      if (this.allUsers !== undefined) {
        this.oneUser = this.allUsers.find(u => u.userId === this.onePayment.order.customer.userId)
      }
      this.pushOrderDetail()
    }
  }

  pushOrderDetail() {
    if (this.onePayment.orderDetail.length > 0) {
      this.beneficiariesVisibility = true
      for (const element of this.onePayment.orderDetail) {
        const customer: Customer = this.allCustomers.find(c => c.customerId === element.beneficiaryId)
        if (customer !== undefined) {
          const orderDetailCustomer: any = {
            customerId: customer.customerId,
            name: customer.name,
            lastName: customer.lastName,
            document: customer.document,
            birthDate: customer.birthDate,
            phoneNumber: customer.phoneNumber,
            address: customer.address,
            eps: customer.eps,
            image: this.setBeneficiarieImage(customer.document),
            userId: customer.userId,
            user: customer.user,
            unitPrice: element.unitPrice
          }
          const exists = this.beneficiaries.find(b => b.customerId === orderDetailCustomer.customerId)
          if (exists === undefined) {
            this.beneficiaries.push(orderDetailCustomer)
            this.orderDetails.push(element)
          }
        }
      }
      this.updateVisibility()
    }
  }

  updateVisibility(): void {
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  setBeneficiarieImage(document: string): string {
    if (this.onePayment !== undefined && this.onePayment.order.customer.document === document) {
      return 'assets/img/avatars/titular.jpeg'
    } else {
      return this.nonTitularImage(document)
    }
  }

  nonTitularImage(document: any): string {
    const oneCustomer: any = this.allCustomers.find(c => c.document === document)
    if (oneCustomer !== undefined) {
      const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
      if (oneRole !== undefined && oneRole.name === 'Cliente') {
        return this.customerImage()
      } else {
        return this.beneficiarieImage()
      }
    }
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

  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  showLabel(document: string): string {
    if (this.onePayment !== undefined && this.onePayment.order.customer.document === document) {
      return 'Titular'
    } else {
      const oneCustomer: Customer = this.beneficiaries.find(c => c.document === document)
      if (oneCustomer !== undefined) {
        const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
        if (oneRole !== undefined && oneRole.name === 'Cliente') {
          return 'Cliente'
        } else {
          return 'Beneficiario'
        }
      }
    }
  }

  showBadge(document: string): number {
    if (this.onePayment !== undefined && this.onePayment.order.customer.document === document) {
      return 0
    } else {
      const oneCustomer: Customer = this.beneficiaries.find(c => c.document === document)
      if (oneCustomer !== undefined) {
        const oneRole = this.allRoles.find(r => r.roleId === oneCustomer.user.roleId)
        if (oneRole !== undefined && oneRole.name === 'Cliente') {
          return 2
        } else {
          return 1
        }
      }
    }
  }

  validateEditBeneficiarieAllowing(customer: any): boolean {
    if (this.onePayment.order.status !== 3) {
      if (this.allRoles !== undefined) {
        const role = this.allRoles.find(r => r.roleId === customer.user.roleId)
        if (role !== undefined) {
          if (role.name === 'Beneficiario') {
            return true
          }
        }
      }
    }
    return false
  }

  editBeneficiarie(customer: Customer) {
    if (this.onePayment !== undefined) {
      const orderProcess = {
        action: 'EditOrderDetail',
        customer: customer,
        order: this.onePayment.order,
        paymentId: this.onePayment.paymentId,
      }
      this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
      this.router.navigate(['Home/ProcesoBeneficiarios/asas']);
    }
  }

  orderProcessingBar(): string {
    if (this.onePayment !== undefined) {
      if (this.onePayment.order.status === 0) {
        return 'w-1'
      } else if (this.onePayment.order.status === 1) {
        return 'w-6'
      } else if (this.onePayment.order.status === 2) {
        return 'w-12'
      }
    }
  }

  orderProcessingLabel(label: number): string {
    if (this.onePayment !== undefined) {
      if (this.onePayment.order.status === 0) {
        if (label === 0) {
          return 'text-900 font-medium'
        }
        if (label === 1) {
          return 'text-500'
        }
        if (label === 2) {
          return 'text-500'
        }
      } else if (this.onePayment.order.status === 1) {
        if (label === 0) {
          return 'text-800'
        }
        if (label === 1) {
          return 'text-900 font-medium'
        }
        if (label === 2) {
          return 'text-500'
        }
      } else if (this.onePayment.order.status === 2) {
        if (label === 0) {
          return 'text-800'
        }
        if (label === 1) {
          return 'text-800'
        }
        if (label === 2) {
          return 'text-900 font-medium'
        }
      }
    }
  }

  back() {
    if (this.orderProcess !== undefined) {
      if (this.orderProcess.action === 'CreateOrder') {
        this.store.dispatch(new SaveOrderProcess(undefined))
        if (this.role === 'Cliente') {
          this.router.navigate(['Home/Paquetes'])
        } else {
          this.router.navigate(['Home/Pedidos'])
        }
      } else if (this.orderProcess.action === 'CreateOrderDetail' || this.orderProcess.action === 'CreatePayment') {
        this.store.dispatch(new SaveOrderProcess(undefined))
        this.router.navigate(['Home/DetallesPedido/' + this.onePayment.orderId])
      } else {
        this.store.dispatch(new SaveOrderProcess(undefined))
        this.router.navigate(['Home/DetallesPedido/' + this.onePayment.orderId])
      }
    } else {
      this.router.navigate(['Home/DetallesPedido/' + this.onePayment.orderId])
    }
  }

  async deleteOrderDetail(customer: Customer) {
    this.confirmationService.confirm({
      key: 'confirmation-message',
      header: '¿Está seguro de eliminar a ' + customer.name + '?',
      message: 'Tenga en cuenta que:<br><br>- El precio del pedido no cambiará.<br>- No se hará un reembolso por el beneficiario.<br>- Deberá volver a realizar un abono si desea agregar a ' + customer.name + ' de nuevo.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        const orderDetail: OrderDetail = this.orderDetails.find(od => od.beneficiaryId === customer.customerId)
        if (orderDetail !== undefined) {
          this.store.dispatch(new DeleteOrderDetailRequest({ ...orderDetail }))
          const oneBeneficiarie: any = this.beneficiaries.find(b => b.customerId === orderDetail.beneficiaryId)
          if (oneBeneficiarie !== undefined) {
            const index = this.beneficiaries.indexOf(oneBeneficiarie)
            this.beneficiaries.splice(index, 1)
            this.updateVisibility()
            if (this.beneficiaries.length === 0) {
              this.beneficiariesVisibility = false
            }
          }
        }
      }
    })
  }

  showButtonLabel(): string {
    if (this.orderProcess !== undefined) {
      if (this.orderProcess.action === 'CreateOrder') {
        return 'Regresar al Inicio'
      } else if (this.orderProcess.action === 'CreateOrderDetail' || this.orderProcess.action === 'CreatePayment' || this.orderProcess.action === 'RetryPayment') {
        return 'Regresar a Detalles'
      } else {
        return 'Regresar'
      }
    } else {
      return 'Regresar'
    }
  }
}
