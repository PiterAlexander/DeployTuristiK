import { Customer } from '@/models/customer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { AppState } from '@/store/state';
import { GetAllCustomerRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-read-order-order-detail',
  templateUrl: './read-order-order-detail.component.html',
  styleUrls: ['./read-order-order-detail.component.scss']
})
export class ReadOrderOrderDetailComponent implements OnInit {

  public ui: Observable<UiState>
  public orderDetails: Array<OrderDetail>
  public allCustomers: Array<Customer>
  public order: Order
  public orderDetailCustomers: Array<Customer> = []

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.order = state.oneOrder.data
      this.orderDetails = state.oneOrder.data.orderDetail
      this.allCustomers = state.allCustomers.data
      this.compareCustomerId()
    })
  }

  compareCustomerId() {
    for (const element of this.orderDetails) {
      const customer = this.allCustomers.find(c => c.customerId === element.beneficiaryId)
      if (customer != undefined) {
        this.orderDetailCustomers.push(customer)
      }
    }
  }

  closeModal() {
    this.modalService.dismissAll()
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
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Lo sentimos no quedan cupos disponibles.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }

  editOrdelDetail(customer: Customer) {
    const orderDetail = this.orderDetails.find(od => od.beneficiaryId === customer.customerId)
    const orderProcess = [{
      action: 'EditOrderDetail',
      customer: customer,
      orderDetail: orderDetail,
      order: this.order
    }]
    this.modalService.dismissAll();
    this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess))
  }
}
