import { Customer } from '@/models/customer';
import { Order } from '@/models/order';
import { AppState } from '@/store/state';
import { DeleteOrderDetailRequest, GetAllCustomerRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Role } from '@/models/role';
import { OrderDetail } from '@/models/orderDetail';

@Component({
  selector: 'app-read-order-order-detail',
  templateUrl: './read-order-order-detail.component.html',
  styleUrls: ['./read-order-order-detail.component.scss']
})
export class ReadOrderOrderDetailComponent implements OnInit {

  public ui: Observable<UiState>
  public allRoles: Array<Role>
  public allCustomers: Array<Customer>
  public order: Order
  public orderDetailCustomers: Array<any> = []
  public loading: boolean = true
  public visible: boolean = true

  constructor(
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.order = state.oneOrder.data
      this.allCustomers = state.allCustomers.data
      this.compareCustomerId()
    })
  }

  compareCustomerId() {
    for (const element of this.order.orderDetail) {
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
          userId: customer.userId,
          user: customer.user,
          unitPrice: element.unitPrice
        }
        this.orderDetailCustomers.push(orderDetailCustomer)
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

  addOrderDetailButton(): boolean {
    if (this.order.package.availableQuotas >= 1) {
      return true
    }
    return false
  }

  addOrderDetail() {
    if (this.order.package.availableQuotas >= 1) {
      this.closeModal()
      const orderProcess = [{
        action: 'CreateOrderDetail',
        order: this.order,
        beneficiaries: {}
      }]
      this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
    }
  }

  validateEditAllowing(customer: any): boolean {
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
    const orderDetail: OrderDetail = this.order.orderDetail.find(od => od.beneficiaryId === customer.customerId)
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
      header: '¿Estás seguro de eliminar a ' + customer.name + ' ' + customer.lastName + '?',
      message: 'Ten en cuenta que el precio del pedido no cambiará y no se hará un reembolso por el beneficiario.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-primary p-button-sm',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        const orderDetail: OrderDetail = this.order.orderDetail.find(od => od.beneficiaryId === customer.customerId)
        if (orderDetail !== undefined) {
          this.store.dispatch(new DeleteOrderDetailRequest({ ...orderDetail }))
        }
      }
    })
  }
}
