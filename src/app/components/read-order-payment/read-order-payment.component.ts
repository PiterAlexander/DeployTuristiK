import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SaveOrderProcess } from '@/store/ui/actions';
import { ApiService } from '@services/api.service';
import { Role } from '@/models/role';
import { Order } from '@/models/order';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-read-order-payment',
  templateUrl: './read-order-payment.component.html',
  styleUrls: ['./read-order-payment.component.scss']
})

export class ReadOrderPaymentComponent {
  public ui: Observable<UiState>
  public role: any
  public user: any
  public allRoles: Array<Role>
  public order: Order
  public payments: Array<any> = []
  public statuses: any[] = [];
  public remainingAmount: number
  public loading: boolean = true
  public visible: boolean = true
  public pendingPayments: boolean = false
  public baseUrl: string = environment.endPoint + 'resources/payments/'
  public orderId: string

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.route.paramMap.subscribe((params) => {
        this.orderId = params.get('id');
        this.getOrderById()
      });
    })

    this.statuses = [
      { 'label': 'Pendiente', 'code': 0 },
      { 'label': 'Aceptado', 'code': 1 },
      { 'label': 'Rechazado', 'code': 2 },
    ]
  }

  async getOrderById() {
    const orderPromise = await new Promise((resolve, reject) => {
      this.apiService.getOrderById(this.orderId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (orderPromise) {
      this.order = {
        orderId: orderPromise['orderId'],
        customerId: orderPromise['customerId'],
        customer: orderPromise['customer'],
        packageId: orderPromise['packageId'],
        package: orderPromise['package'],
        totalCost: orderPromise['totalCost'],
        status: orderPromise['status'],
        orderDate: orderPromise['orderDate'],
        payment: orderPromise['payment']
      }
      this.pushPayments()
    }
  }

  validateEditAllowing(payment: Payment): boolean {
    if (this.role !== 'Cliente') {
      if (payment.status === 0) {
        return true
      }
    }
    return false
  }

  pushPayments() {
    for (const element of this.order.payment) {
      if (element != undefined) {
        const payment: any = {
          paymentId: element.paymentId,
          orderId: element.orderId,
          amount: element.amount,
          remainingAmount: element.remainingAmount,
          date: element.date,
          image: element.image,
          status: element.status,
        }
        const onePayment: any = this.payments.find(p => p.paymentId === element.paymentId)
        if (onePayment === undefined) {
          this.payments.push(payment)
        }
      }
    }
    this.updateVisibility()
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  editPayment(payment: Payment) {
    // this.store.dispatch(new OpenModalEditPayment({ ...payment }))
    this.router.navigate(['Home/RevisionAbono/' + payment.paymentId])
  }

  showStatus(status: any): string {
    for (let statuse of this.statuses) {
      if (status === statuse.code) {
        return statuse.label
      }
    }
  }

  existingRemainingAmount(): boolean {
    let addition = 0
    if (this.order !== undefined) {
      for (const element of this.order.payment) {
        if (element !== undefined) {
          if (element.status === 1 || element.status === 0) {
            addition += element.amount
            if (element.status === 0) {
              this.pendingPayments = true
            }
          }
        }
      }
      this.remainingAmount = this.order.totalCost - addition
      if (this.remainingAmount > 0) {
        return true
      }
      return false
    }
  }

  addPayment() {
    if (this.remainingAmount > 0) {
      const orderProcess = {
        action: 'CreatePayment',
        order: this.order
      }
      this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
      this.router.navigate(['Home/ProcesoAbonos/Agregar']);
    }
  }

  validateRetryPaymentAllowing(payment: Payment): boolean {
    if (payment.status === 2) {
      return true
    }
    return false
  }

  retryPayment(payment: Payment) {
    const onePayment: Payment = this.order.payment.find(p => p.paymentId === payment.paymentId)
    if (onePayment !== undefined) {
      if (payment.status === 2) {
        const orderProcess = {
          action: 'RetryPayment',
          order: this.order,
          payment: onePayment
        }
        this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
        this.router.navigate(['Home/ProcesoAbonos/asas']);
      }
    }
  }

  addOrderDetailButton(): boolean {
    if (this.order !== undefined) {
      if (this.order.package.availableQuotas >= 1) {
        return true
      }
      return false
    }
  }

  addOrderDetail() {
    if (this.order.package.availableQuotas >= 1) {
      const orderProcess = {
        action: 'CreateOrderDetail',
        order: this.order,
        beneficiaries: {}
      }
      this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
      this.router.navigate(['Home/ProcesoBeneficiarios/asas']);
    }
  }

  paymentDetails(paymentId: string) {
    this.router.navigate(['Home/DetallesAbono/' + paymentId]);
  }
}
