import { Costumer } from '@/models/costumer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Package } from '@/models/package';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { CreateOrderRequest, CreatePaymentRequest, EditOrderRequest, EditPackageRequest, GetAllOrdersRequest, OpenModalCreateOrderDetail, OpenModalPayments } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-payment-form',
  templateUrl: './create-payment-form.component.html',
  styleUrls: ['./create-payment-form.component.scss']
})

export class CreatePaymentFormComponent implements OnInit {

  formGroup: FormGroup;
  private ui: Observable<UiState>
  public orderProcess: Array<any>
  public orderDetail: Array<OrderDetail> = []
  public allOrders: Array<Order>
  public onePackage: Package
  public totalCost: number
  public remainingAmount: number
  public beneficiariesAmount: number
  public oneOrder: Order

  constructor(
    public apiService: ApiService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.orderProcess = state.orderProcess.data
      this.allOrders = state.allOrders.data
    })

    if (this.orderProcess[0].action === 'CreatePayment') {
      this.totalCost = this.orderProcess[0].order.totalCost
      let addition = 0
      this.orderProcess[0].order.payment.forEach(element => {
        if (element != undefined) {
          addition += element.amount
        }
      })
      this.remainingAmount = this.totalCost - addition
    } else {
      this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
      this.onePackage = this.orderProcess[0].order.package
      if (this.orderProcess[0].action === 'CreateOrderDetail') {
        this.oneOrder = this.allOrders.find(o => o.orderId === this.orderProcess[0].order.orderId)
        this.totalCost = this.orderProcess[0].order.totalCost
        let addition = 0
        this.oneOrder.payment.forEach(element => {
          if (element != undefined) {
            addition += element.amount
          }
        })
        const totalCost = this.oneOrder.totalCost + this.totalCost
        this.remainingAmount = totalCost - addition
      } else {
        this.totalCost = this.onePackage.price * this.beneficiariesAmount
      }
    }

    this.formGroup = this.fb.group({
      amount: ['', Validators.required],
      img: [null, Validators.required],
    });
  }

  back() {
    if (this.orderProcess[0].action === 'CreatePayment') {
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalPayments(this.orderProcess[0].order))
    } else if (this.orderProcess[0].action === 'CreateOrderDetail') {
      const order = this.allOrders.find(o => o.orderId === this.orderProcess[0].order.orderId)
      this.orderProcess = [{
        action: 'CreateOrderDetail',
        order: order,
        beneficiaries: this.orderProcess[0].beneficiaries,
        payment: {}
      }]
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreateOrderDetail(this.orderProcess))
    } else {
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreateOrderDetail(this.orderProcess))
    }
  }
  //<--- VALIDATIONS --->

  fromCreatePayment(): boolean {
    if (this.orderProcess[0].action === 'CreatePayment') {
      return true
    }
    return false
  }

  validForm(): boolean {
    return this.formGroup.value.amount > 0 &&
      this.formGroup.value.img != undefined && !this.formGroup.invalid &&
      !this.validateInitialPayment() && !this.validateFullPrice()
  }

  validateInitialPayment(): boolean {
    if (this.orderProcess[0].action === 'CreatePayment') {
      if (this.formGroup.value.amount != undefined) {
        if (this.formGroup.value.amount <= 0) {
          return true
        }
      }
    } else {
      if (this.formGroup.value.amount != undefined) {
        const initialPayment = this.totalCost * 20 / 100
        if (this.formGroup.value.amount < initialPayment) {
          return true
        }
      }
    }
    return false
  }

  validateFullPrice(): boolean {
    if (this.orderProcess[0].action === 'CreatePayment') {
      if (this.formGroup.value.amount != undefined) {
        if (this.formGroup.value.amount > this.remainingAmount) {
          return true
        }
      }
    } else {
      if (this.formGroup.value.amount != undefined) {
        if (!this.validateInitialPayment()) {
          if (this.formGroup.value.amount > this.totalCost) {
            return true
          }
        }
      }
    }
    return false
  }

  //<------------------->

  async save() {
    if (!this.formGroup.invalid) {
      if (this.orderProcess[0].action === 'CreatePayment') {
        let status: number
        if (this.formGroup.value.amount === this.remainingAmount) {
          status = 2
        } else {
          status = 1
        }
        const order: Order = {
          orderId: this.orderProcess[0].order.orderId,
          costumerId: this.orderProcess[0].order.costumerId,
          packageId: this.orderProcess[0].order.packageId,
          totalCost: this.orderProcess[0].order.totalCost,
          status: status,
          payment: this.orderProcess[0].order.payment,
          orderDetail: this.orderProcess[0].order.orderDetail
        }
        this.store.dispatch(new EditOrderRequest(order))
        const payment: Payment = {
          orderId: this.orderProcess[0].order.orderId,
          amount: this.formGroup.value.amount,
          remainingAmount: this.remainingAmount - this.formGroup.value.amount,
          date: new Date(),
          image: "url",
          status: 1
        }

        this.store.dispatch(new CreatePaymentRequest({ ...payment }))
        Swal.fire({
          icon: 'success',
          title: '¡Abono agregado exitosamente!',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        })
      } else {
        const beneficiaries = this.orderProcess[0].beneficiaries;
        const unitPrice = this.totalCost / this.beneficiariesAmount
        const remainingAmount = this.totalCost - this.formGroup.value.amount
        for (const element of beneficiaries) {
          if (element.costumerId === undefined) {
            const costumerModel: Costumer = element;
            const data = await new Promise((resolve, reject) => {
              this.apiService.addCostumer(costumerModel).subscribe({
                next: (data) => {
                  resolve(data);
                },
                error: (err) => {
                  reject(err);
                }
              });
            });
            if (this.orderProcess[0].action === 'CreateOrderDetail') {
              const orderDetail: OrderDetail = {
                orderId: this.orderProcess[0].order.orderId,
                beneficiaryId: data['costumerId'],
                unitPrice: unitPrice
              };
              this.orderDetail.push(orderDetail);
            } else {
              const orderDetail: OrderDetail = {
                beneficiaryId: data['costumerId'],
                unitPrice: unitPrice
              };
              this.orderDetail.push(orderDetail);
            }
          } else {
            if (this.orderProcess[0].action === 'CreateOrderDetail') {
              const orderDetail: OrderDetail = {
                orderId: this.orderProcess[0].order.orderId,
                beneficiaryId: element.costumerId,
                unitPrice: unitPrice
              }
              this.orderDetail.push(orderDetail);
            } else {
              const orderDetail: OrderDetail = {
                beneficiaryId: element.costumerId,
                unitPrice: unitPrice
              }
              this.orderDetail.push(orderDetail);
            }
          }
        }
        if (this.orderProcess[0].action === 'CreateOrderDetail') {
          let status: number
          let addition = 0
          this.oneOrder.payment.forEach(element => {
            if (element != undefined) {
              addition += element.amount
            }
          })
          if (this.oneOrder.totalCost === addition) {
            if (this.formGroup.value.amount === this.totalCost) {
              status = 2
            } else {
              status = 1
            }
          } else {
            status = 1
          }
          const order: Order = {
            orderId: this.oneOrder.orderId,
            costumerId: this.oneOrder.costumerId,
            packageId: this.oneOrder.packageId,
            totalCost: this.oneOrder.totalCost + this.totalCost,
            status: status,
            payment: this.oneOrder.payment,
            orderDetail: this.oneOrder.orderDetail
          }
          this.store.dispatch(new EditOrderRequest(order))

          const updatePackage: Package = {
            packageId: this.oneOrder.package.packageId,
            name: this.oneOrder.package.name,
            destination: this.oneOrder.package.destination,
            details: this.oneOrder.package.details,
            transport: this.oneOrder.package.transport,
            hotel: this.oneOrder.package.hotel,
            arrivalDate: this.oneOrder.package.arrivalDate,
            departureDate: this.oneOrder.package.departureDate,
            departurePoint: this.oneOrder.package.departurePoint,
            totalQuotas: this.oneOrder.package.totalQuotas,
            availableQuotas: this.oneOrder.package.availableQuotas - this.orderDetail.length,
            price: this.oneOrder.package.price,
            type: this.oneOrder.package.type,
            status: this.oneOrder.package.status
          }

          this.store.dispatch(new EditPackageRequest(updatePackage))

          for (const element of this.orderDetail) {
            const orderDetail: OrderDetail = element;
            this.apiService.addOrderDetail(orderDetail).subscribe({
              next: (data) => {
              },
              error: (err) => {
                console.log("Error while creating: ", err);
              }
            })
          }

          const payment: Payment = {
            orderId: this.orderProcess[0].order.orderId,
            amount: this.formGroup.value.amount,
            remainingAmount: this.remainingAmount - this.formGroup.value.amount,
            date: new Date(),
            image: "url",
            status: 1
          }

          this.store.dispatch(new CreatePaymentRequest({ ...payment }))
          Swal.fire({
            icon: 'success',
            title: '¡Beneficiario/s agregado/s exitosamente!',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          })
        } else {
          const payment: Payment = {
            amount: this.formGroup.value.amount,
            remainingAmount: remainingAmount,
            date: new Date(),
            image: "url",
            status: 1
          }

          let status: number
          if (this.formGroup.value.amount === this.totalCost) {
            status = 2
          } else {
            status = 1
          }

          const order: Order = {
            costumerId: this.orderProcess[0].order.costumer.costumerId,
            packageId: this.orderProcess[0].order.package.packageId,
            totalCost: this.totalCost,
            status: status,
            payment: [payment],
            orderDetail: this.orderDetail
          }

          const updatePackage: Package = {
            packageId: this.orderProcess[0].order.package.packageId,
            name: this.orderProcess[0].order.package.name,
            destination: this.orderProcess[0].order.package.destination,
            details: this.orderProcess[0].order.package.details,
            transport: this.orderProcess[0].order.package.transport,
            hotel: this.orderProcess[0].order.package.hotel,
            arrivalDate: this.orderProcess[0].order.package.arrivalDate,
            departureDate: this.orderProcess[0].order.package.departureDate,
            departurePoint: this.orderProcess[0].order.package.departurePoint,
            totalQuotas: this.orderProcess[0].order.package.totalQuotas,
            availableQuotas: this.orderProcess[0].order.package.availableQuotas - this.orderDetail.length,
            price: this.orderProcess[0].order.package.price,
            type: this.orderProcess[0].order.package.type,
            status: this.orderProcess[0].order.package.status
          }

          this.store.dispatch(new EditPackageRequest(updatePackage))
          this.store.dispatch(new CreateOrderRequest({ ...order }))
          Swal.fire({
            icon: 'success',
            title: '¡Pedido agregado exitosamente!',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          })
        }
      }
    }
  }
}