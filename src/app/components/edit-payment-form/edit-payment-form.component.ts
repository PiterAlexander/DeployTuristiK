import { Order } from '@/models/order';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { EditPaymentRequest, OpenModalPayments } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit-payment-form',
  templateUrl: './edit-payment-form.component.html',
  styleUrls: ['./edit-payment-form.component.scss']
})
export class EditPaymentFormComponent implements OnInit {

  private ui: Observable<UiState>
  public payment: Payment
  public allOrders: Array<Order>
  public order: Order
  public user: any
  public role: any

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.payment = state.onePayment.data
      this.allOrders = state.allOrders.data
      this.order = this.allOrders.find(o => o.orderId === this.payment.orderId)
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
    })
  }

  back() {
    this.modalService.dismissAll()
    this.store.dispatch(new OpenModalPayments(this.order))
  }

  approve() {
    const payment: Payment = {
      paymentId: this.payment.paymentId,
      orderId: this.order.orderId,
      amount: this.payment.amount,
      remainingAmount: this.payment.remainingAmount,
      date: this.payment.date,
      image: this.payment.image,
      status: 1
    }

    this.store.dispatch(new EditPaymentRequest(payment))
    this.modalService.dismissAll()
  }

  decline() {
    const payment: Payment = {
      paymentId: this.payment.paymentId,
      orderId: this.order.orderId,
      amount: this.payment.amount,
      remainingAmount: this.payment.remainingAmount,
      date: this.payment.date,
      image: this.payment.image,
      status: 2
    }
    this.store.dispatch(new EditPaymentRequest(payment))
    this.modalService.dismissAll()
  }
}
