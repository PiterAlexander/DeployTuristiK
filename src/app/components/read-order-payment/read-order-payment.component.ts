import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { OpenModalCreatePayment } from '@/store/ui/actions';
import { Order } from '@/models/order';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-read-order-payment',
  templateUrl: './read-order-payment.component.html',
  styleUrls: ['./read-order-payment.component.scss']
})
export class ReadOrderPaymentComponent {

  public ui: Observable<UiState>
  public order: Order
  public payments: Array<Payment>

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.order = state.oneOrder.data
      this.payments = state.oneOrder.data.payment
    })
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  addPayment() {
    let addition = 0
    this.order.payment.forEach(element => {
      if (element != undefined) {
        addition += element.amount
      }
    })
    const remainingAmount = this.order.totalCost - addition
    if (remainingAmount > 0) {
      this.closeModal()
      const orderProcess = [{
        action: 'CreatePayment',
        order: this.order
      }]
      this.store.dispatch(new OpenModalCreatePayment(orderProcess))
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Ya pagaste la totalidad del pedido :).',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }
}
