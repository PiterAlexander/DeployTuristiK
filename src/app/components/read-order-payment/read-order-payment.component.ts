import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OpenModalCreatePayment, OpenModalEditPayment } from '@/store/ui/actions';
import { Order } from '@/models/order';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-read-order-payment',
  templateUrl: './read-order-payment.component.html',
  styleUrls: ['./read-order-payment.component.scss']
})
export class ReadOrderPaymentComponent {

  public ui: Observable<UiState>
  public order: Order
  public payments: Array<Payment> = []
  public statuses: any[] = [];
  public remainingAmount: number
  public loading: boolean = true
  public visible: boolean = true

  constructor(
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.order = state.oneOrder.data
      this.pushPayments()
    })

    this.statuses = [
      { 'label': 'Pendiente', 'code': 0 },
      { 'label': 'Aceptado', 'code': 1 },
      { 'label': 'Rechazado', 'code': 2 },
    ]
  }

  validateEditAllowing(payment: Payment): boolean {
    if (payment.status === 0) {
      return true
    }
    return false
  }

  pushPayments() {
    for (const element of this.order.payment) {
      if (element != undefined) {
        this.payments.push(element)
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
    this.order.payment.forEach(element => {
      if (element != undefined) {
        if (element.status === 1) {
          addition += element.amount
        }
      }
    })
    this.remainingAmount = this.order.totalCost - addition
    if (this.remainingAmount > 0) {
      return true
    }
    return false
  }

  addPayment() {
    if (this.remainingAmount > 0) {
      this.closeModal()
      const orderProcess = [{
        action: 'CreatePayment',
        order: this.order
      }]
      this.store.dispatch(new OpenModalCreatePayment(orderProcess))
    }
  }
}
