import { Customer } from '@/models/customer';
import { Order } from '@/models/order';
import { AppState } from '@/store/state';
import { GetAllCustomerRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';
import { Role } from '@/models/role';

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
      if (customer != undefined) {
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
    console.log(this.orderDetailCustomers);

    this.updateVisibility()
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  validateEditAllowing(beneficiarie: any): boolean {
    if (this.allRoles !== undefined) {
      const role = this.allRoles.find(r => r.roleId === beneficiarie.user.roleId)
      if (role !== undefined) {
        if (role.name !== 'Cliente') {
          return true
        }
      }
    }
    return false
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
      this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess))
    }
  }

  editOrderDetail(customer: Customer) {
    const orderDetail = this.order.orderDetail.find(od => od.beneficiaryId === customer.customerId)
    const orderProcess = [{
      action: 'EditOrderDetail',
      customer: customer,
      orderDetail: orderDetail,
      order: this.order
    }]
    this.modalPrimeNg.close()
    this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess))
  }
}
