import { Order } from '@/models/order';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { EditOrderRequest, EditPaymentRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '@services/api.service';
import { MessageService } from 'primeng/api';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-payment-form',
  templateUrl: './edit-payment-form.component.html',
  styleUrls: ['./edit-payment-form.component.scss']
})

export class EditPaymentFormComponent implements OnInit {
  private ui: Observable<UiState>
  public formGroup: FormGroup
  public payment: Payment
  public allOrders: Array<Order>
  public order: Order
  public user: any
  public role: any
  public statuses: any[] = []
  public baseUrl: string = environment.endPoint + 'resources/payments/'

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService,
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allOrders = state.allOrders.data
      this.payment = state.onePayment.data
      this.getOrderById(this.payment.orderId)
    })

    this.formGroup = this.fb.group({
      status: [null, Validators.required],
      details: [null]
    })

    this.statuses = [
      { 'label': 'Aceptado', 'value': 1 },
      { 'label': 'Rechazado', 'value': 2 },
    ]
  }

  async getOrderById(orderId: string) {
    const orderPromise = await new Promise((resolve, reject) => {
      this.apiService.getOrderById(orderId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (orderPromise) {
      const oneOrder: any = {
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
      this.order = oneOrder
    }
  }

  validForm(): boolean {
    if (this.formGroup.value.status === 2) {
      return this.formGroup.valid && this.formGroup.value.details !== null
    } else {
      return this.formGroup.value.status !== null
    }
  }

  back() {
    this.modalPrimeNg.close()
    this.router.navigate(['Home/DetallesPedido/' + this.order.orderId]);
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
      header: '¿Está seguro de ' + action + ' este abono?',
      message: 'Tenga en cuenta que una vez ' + conjugedAction + ' no podrá volver a cambiar su estado',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-primary p-button-sm',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.save()
      }
    })
  }

  save() {
    if (this.formGroup.value.status !== null) {
      let addition: number = 0
      let orderStatus: number
      let pending: boolean = false
      let accepted: boolean = false
      for (const element of this.order.payment) {
        if (element !== undefined && element.status !== 2) {
          if (element.paymentId !== this.payment.paymentId) {
            addition += element.amount
            if (element.status === 0) {
              pending = true
            } else if (element.status === 1) {
              accepted = true
            }
          } else {
            if (this.formGroup.value.status === 1) {
              if (element.paymentId === this.payment.paymentId) {
                addition += element.amount
              }
              accepted = true
            }
          }
        }
      }
      const remainingAmount: number = this.order.totalCost - addition
      if ((accepted && pending && remainingAmount === 0) || (accepted && pending && remainingAmount > 0)) {
        orderStatus = 1
      } else if (accepted && !pending && remainingAmount === 0) {
        orderStatus = 2
      } else if ((!accepted && pending && remainingAmount === 0) || (!accepted && pending && remainingAmount > 0)) {
        orderStatus = 0
      } else if (accepted && !pending && remainingAmount > 0) {
        orderStatus = 1
      } else if (!accepted && !pending) {
        orderStatus = 0
      } else {
        orderStatus = 3
      }
      const order: Order = {
        orderId: this.order.orderId,
        customerId: this.order.customerId,
        packageId: this.order.packageId,
        totalCost: this.order.totalCost,
        orderDate: this.order.orderDate,
        status: orderStatus,
        payment: this.order.payment
      }
      console.log(order);


      this.store.dispatch(new EditOrderRequest({ ...order }))
      let status: number
      if (this.formGroup.value.status === 1) {
        status = 1
      } else {
        status = 2
      }

      const payment: any = {
        paymentId: this.payment.paymentId,
        orderId: this.order.orderId,
        amount: this.payment.amount,
        remainingAmount: this.payment.remainingAmount,
        date: this.payment.date,
        image: this.payment.image,
        status: status
      }
      
      const formData = new FormData();
      formData.append('paymentId', payment.paymentId)
      formData.append('orderId', payment.orderId)
      formData.append('amount', String(payment.amount))
      formData.append('remainingAmount', String(payment.remainingAmount))
      formData.append('date', String(payment.date))
      formData.append('image', String(payment.image))
      formData.append('status', String(payment.status))

      if (payment.imageFile instanceof File) {
        formData.append('imageFile', payment.imageFile, payment.imageFile.name)
      } else {
        formData.append('imageFile', payment.imageFile)
      }

      this.store.dispatch(new EditPaymentRequest({ ...payment }))
      this.apiService.updatePayment(formData.get('paymentId'), formData).subscribe({
        next: (data) => { },
        error: (err) => {
          console.log('Error occured while updating: ', err);
        }
      })
      this.modalPrimeNg.close()
      this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Abono editado exitosamente.' });
    }
  }
}
