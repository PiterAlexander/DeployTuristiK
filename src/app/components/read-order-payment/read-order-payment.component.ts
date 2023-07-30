import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DeleteOrderDetailRequest, OpenModalCreateOrderDetail, OpenModalCreatePayment, OpenModalEditPayment } from '@/store/ui/actions';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Customer } from '@/models/customer';
import { OrderDetail } from '@/models/orderDetail';
import { ConfirmationService } from 'primeng/api';
import { Role } from '@/models/role';
import { Order } from '@/models/order';

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
  public allCustomers: Array<Customer>
  public order: Order
  public payments: Array<any> = []
  public statuses: any[] = [];
  public remainingAmount: number
  public loading: boolean = true
  public visible: boolean = true
  public orderDetailCustomers: Array<OrderDetail> = []
  public orderDetails: Array<OrderDetail> = []
  public pendingPayments: boolean = false

  constructor(
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.order = state.oneOrder.data
      this.pushPayments()
    })

    this.statuses = [
      { 'label': 'Pendiente', 'code': 0 },
      { 'label': 'Aceptado', 'code': 1 },
      { 'label': 'Rechazado', 'code': 2 },
    ]
  }

  validateExtendibleAllowing(payment: any) {
    if (payment.orderDetail.length > 0) {
      return true
    }
    return false
  }

  validateEditAllowing(payment: Payment): boolean {
    if (this.user['role'] !== 'Cliente') {
      if (payment.status === 0) {
        return true
      }
    }
    return false
  }

  pushPayments() {
    for (const element of this.order.payment) {
      if (element != undefined) {
        const orderDetailCustomersPerPayment: Array<any> = []
        for (const anotherElement of element.orderDetail) {
          const customer: Customer = this.allCustomers.find(c => c.customerId === anotherElement.beneficiaryId)
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
              userId: customer.userId,
              user: customer.user,
              unitPrice: anotherElement.unitPrice
            }
            orderDetailCustomersPerPayment.push(orderDetailCustomer)
            this.orderDetailCustomers.push(orderDetailCustomer)
            this.orderDetails.push(anotherElement)
          }
        }
        const payment: any = {
          paymentId: element.paymentId,
          orderId: element.orderId,
          amount: element.amount,
          remainingAmount: element.remainingAmount,
          date: element.date,
          image: element.image,
          status: element.status,
          orderDetail: orderDetailCustomersPerPayment
        }
        this.payments.push(payment)
      }
    }
    this.updateVisibility()
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  closeModal() {
    this.modalPrimeNg.close()
  }

  editPayment(payment: Payment) {
    this.closeModal()
    this.store.dispatch(new OpenModalEditPayment(payment))
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

  addPayment() {
    if (this.remainingAmount > 0) {
      if (this.user['role'] === 'Cliente') {
        const orderProcess = [{
          action: 'CreatePaymentFromCustomer',
          order: this.order
        }]
        this.closeModal()
        this.store.dispatch(new OpenModalCreatePayment(orderProcess))
      } else {
        const orderProcess = [{
          action: 'CreatePayment',
          order: this.order
        }]
        this.closeModal()
        this.store.dispatch(new OpenModalCreatePayment(orderProcess))
      }
    }
  }

  validateEditBeneficiarieAllowing(customer: any): boolean {
    if (this.allRoles !== undefined) {
      const role = this.allRoles.find(r => r.roleId === customer.user.roleId)
      if (role !== undefined) {
        if (role.name === 'Beneficiario') {
          return true
        }
      }
    }
    return false
  }

  editOrderDetail(customer: Customer) {
    const orderDetail: OrderDetail = this.orderDetailCustomers.find(od => od.beneficiaryId === customer.customerId)
    const orderProcess = [{
      action: 'EditOrderDetail',
      customer: customer,
      orderDetail: orderDetail,
      order: this.order
    }]
    this.modalPrimeNg.close()
    this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
  }

  deleteOrderDetail(customer: Customer) {
    this.confirmationService.confirm({
      header: '¿Está seguro de eliminar a ' + customer.name + '?',
      message: 'Tenga en cuenta que:<br><br>- El precio del pedido no cambiará.<br>- No se hará un reembolso por el beneficiario.<br>- Deberá volver a realizar un pago si desea agregar a ' + customer.name + ' de nuevo.',
      icon: 'pi pi-exclamation-triangle text-red-500',
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
        }
      }
    })
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
        const orderProcess = [{
          action: 'RetryPayment',
          order: this.order,
          payment: onePayment
        }]
        this.closeModal()
        this.store.dispatch(new OpenModalCreatePayment(orderProcess))
      }
    }
  }

  addOrderDetailButton(): boolean {
    if (this.order.package.availableQuotas >= 1) {
      return true
    }
    return false
  }

  addOrderDetail() {
    if (this.order.package.availableQuotas >= 1) {
      this.closeModal()
      if (this.user['role'] === 'Cliente') {
        const orderProcess = [{
          action: 'CreateOrderDetailFromCustomer',
          order: this.order,
          beneficiaries: {}
        }]
        this.closeModal()
        this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
      } else {
        const orderProcess = [{
          action: 'CreateOrderDetail',
          order: this.order,
          beneficiaries: {}
        }]
        this.closeModal()
        this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
      }
    }
  }
}
