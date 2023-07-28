import { Order } from '@/models/order';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { EditOrderRequest, EditPaymentRequest, OpenModalPayments } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api'

@Component({
  selector: 'app-edit-payment-form',
  templateUrl: './edit-payment-form.component.html',
  styleUrls: ['./edit-payment-form.component.scss']
})
export class EditPaymentFormComponent implements OnInit {

  private ui: Observable<UiState>
  public formGroup: FormGroup;
  public payment: Payment
  public allOrders: Array<Order>
  public order: Order
  public user: any
  public role: any
  public statuses: any[] = []

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService
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

    this.formGroup = this.fb.group({
      status: [null, Validators.required],
    });

    this.formGroup.setValue({
      status: this.payment.status
    })

    this.statuses = [
      { 'label': 'Aceptado', 'value': 1 },
      { 'label': 'Rechazado', 'value': 2 },
    ]
  }

  validForm(): boolean {
    return this.formGroup.value.status !== null
  }

  back() {
    this.modalPrimeNg.close()
    this.store.dispatch(new OpenModalPayments(this.order))
  }

  confirmation() {
    let action: string
    let conjugedAction: string
    if (this.formGroup.value.status === 1) {
      action = 'aceptar'
      conjugedAction = 'aceptado'
    } else {
      action = 'rechazar'
      conjugedAction = 'rechazado'
    }
    this.confirmationService.confirm({
      header: '¿Estás seguro de ' + action + ' este abono?', // Cambia el encabezado del cuadro de confirmación
      message: 'Ten en cuenta que una vez ' + conjugedAction + ' no podrás volver a cambiar su estado',
      icon: 'pi pi-exclamation-triangle', // Cambia el icono del cuadro de confirmación
      acceptLabel: 'Aceptar', // Cambia el texto del botón de aceptar
      rejectLabel: 'Cancelar', // Cambia el texto del botón de rechazar
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-primary p-button-sm', // Agrega una clase CSS al botón de aceptar
      rejectButtonStyleClass: 'p-button-outlined p-button-sm', // Agrega una clase CSS al botón de rechazar
      accept: () => {
        this.save()
      }
    })
  }

  save() {
    if (!this.formGroup.invalid) {
      let addition: number = 0
      let orderStatus: number
      let refused: boolean = false
      let pending: boolean = false
      let accepted: boolean = false
      for (const element of this.order.payment) {
        if (element !== undefined) {
          addition += element.amount
          if (element.paymentId !== this.payment.paymentId) {
            if (element.status === 0) {
              pending = true
            } else if (element.status === 1) {
              accepted = true
            } else if (element.status === 2) {
              refused = true
            }
          } else {
            if (this.formGroup.value.status === 1) {
              accepted = true
            } else if (this.formGroup.value.status === 2) {
              refused = true
            }
          }
        }
      }
      const remainingAmount: number = this.order.totalCost - addition
      if ((!accepted && pending) || (!accepted && refused)) {
        orderStatus = 0
      } else if ((accepted && pending) || (accepted && refused)) {
        orderStatus = 1
      }
      else if (accepted && !refused && !pending && remainingAmount === 0) {
        orderStatus = 2
      }
      else if (accepted && !refused && !pending && remainingAmount > 0) {
        orderStatus = 1
      }
      else {
        orderStatus = 3
      }
      const order: Order = {
        orderId: this.order.orderId,
        customerId: this.order.customerId,
        packageId: this.order.packageId,
        totalCost: this.order.totalCost,
        status: orderStatus,
        payment: this.order.payment,
        orderDetail: this.order.orderDetail
      }
      this.store.dispatch(new EditOrderRequest({ ...order }))
      let status: number
      if (this.formGroup.value.status === 1) {
        status = 1
      } else {
        status = 2
      }
      const payment: Payment = {
        paymentId: this.payment.paymentId,
        orderId: this.order.orderId,
        amount: this.payment.amount,
        remainingAmount: this.payment.remainingAmount,
        date: this.payment.date,
        image: this.payment.image,
        status: status
      }
      this.modalPrimeNg.close()
      this.store.dispatch(new EditPaymentRequest({ ...payment }))
    }
  }
}
