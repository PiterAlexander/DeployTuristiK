import { Customer } from '@/models/customer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Package } from '@/models/package';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { CreateOrderDetailRequest, CreateOrderRequest, CreatePaymentRequest, EditOrderRequest, EditPaymentRequest, OpenModalCreateOrderDetail, OpenModalPayments } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FrequentTraveler } from '@/models/frequentTraveler';


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
  public file: any
  public higherRemainingAmountFromRetryPayment: boolean = false
  public orderRemainingAmountsZero: boolean = false

  constructor(
    public apiService: ApiService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.orderProcess = state.orderProcess.data
      this.allOrders = state.allOrders.data
    })

    if (this.orderProcess[0].action === 'CreatePayment' || this.orderProcess[0].action === 'CreatePaymentFromCustomer') {
      this.totalCost = this.orderProcess[0].order.totalCost
      let addition = 0
      for (const element of this.orderProcess[0].order.payment) {
        if (element != undefined && element.status === 1 || element.status === 0) {
          addition += element.amount
        }
      }
      this.remainingAmount = this.totalCost - addition
    } else if (this.orderProcess[0].action === 'RetryPayment') {
      const orderTotalCost = this.orderProcess[0].order.totalCost
      let orderAddition: number = 0

      for (const element of this.orderProcess[0].order.payment) {
        if (element !== undefined && element.status === 0 || element.status === 1) {
          orderAddition += element.amount
        }
      }
      console.log(orderAddition);

      const orderRemainingAmount: number = orderTotalCost - orderAddition
      console.log(orderRemainingAmount);
      let totalCost: number = 0
      if (this.orderProcess[0].payment.orderDetail.length > 0) {
        for (const element of this.orderProcess[0].payment.orderDetail) {
          if (element !== undefined) {
            totalCost += element.unitPrice
          }
        }
      } else {
        totalCost = orderTotalCost
      }

      console.log(totalCost);

      this.totalCost = totalCost
      if (totalCost > orderRemainingAmount) {
        this.remainingAmount = orderRemainingAmount
        this.higherRemainingAmountFromRetryPayment = true
        if (orderRemainingAmount === 0) {
          this.orderRemainingAmountsZero = true
        }
      } else {
        this.remainingAmount = this.totalCost * 20 / 100
      }
    } else {
      this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
      this.onePackage = this.orderProcess[0].order.package
      if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
        this.getOneOrderById(this.orderProcess[0].order.orderId)
        this.totalCost = this.orderProcess[0].order.totalCost
        this.remainingAmount = this.totalCost * 20 / 100
      } else {
        let totalCost: number = 0
        for (const element of this.orderProcess[0].beneficiaries) {
          if (element !== undefined) {
            totalCost += element.price
          }
        }
        this.totalCost = totalCost
        this.remainingAmount = this.totalCost * 20 / 100
      }
    }

    this.formGroup = this.fb.group({
      amount: [null, Validators.required],
      img: [null],
    });
  }

  async getOneOrderById(orderId: string) {
    const orderPromise: Order = await new Promise((resolve, reject) => {
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
      const oneOrder: Order = {
        orderId: orderPromise['orderId'],
        customerId: orderPromise['customerId'],
        customer: orderPromise['customer'],
        packageId: orderPromise['packageId'],
        package: orderPromise['package'],
        totalCost: orderPromise['totalCost'],
        status: orderPromise['status'],
        payment: orderPromise['payment']
      }
      this.oneOrder = oneOrder
    }
  }

  back() {
    if (this.orderProcess[0].action === 'CreatePayment' || this.orderProcess[0].action === 'CreatePaymentFromCustomer' || this.orderProcess[0].action === 'RetryPayment') {
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalPayments(this.orderProcess[0].order))
    } else if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
      const action: string = this.orderProcess[0].action
      this.orderProcess = [{
        action: action,
        order: this.oneOrder,
        beneficiaries: this.orderProcess[0].beneficiaries
      }]
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreateOrderDetail(this.orderProcess))
    } else {
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreateOrderDetail(this.orderProcess))
    }
  }
  //<--- VALIDATIONS --->

  fromCreatePayment(): boolean {
    if (this.orderProcess[0].action === 'CreatePayment' || this.orderProcess[0].action === 'CreatePaymentFromCustomer') {
      return true
    }
    return false
  }

  validForm(): boolean {
    return this.formGroup.value.amount !== null
  }


  editPackage(onePackage: Package) {
    const updatePackage: Package = {
      packageId: onePackage.packageId,
      name: onePackage.name,
      destination: onePackage.destination,
      details: onePackage.details,
      transport: onePackage.transport,
      hotel: onePackage.hotel,
      arrivalDate: onePackage.arrivalDate,
      departureDate: onePackage.departureDate,
      departurePoint: onePackage.departurePoint,
      totalQuotas: onePackage.totalQuotas,
      availableQuotas: onePackage.availableQuotas - this.orderDetail.length,
      price: onePackage.price,
      type: onePackage.type,
      status: onePackage.status,
      aditionalPrice: onePackage.aditionalPrice
    }

    this.apiService.updatePackage(updatePackage.packageId, updatePackage).subscribe({
      next: (data) => {
      },
      error: (err) => {
        console.log("Error while creating: ", err);
      }
    })
  }

  saveFromCreatePayment() {
    let status: number
    if (this.formGroup.value.amount === this.remainingAmount) {
      status = 2
    } else {
      status = 1
    }
    const order: Order = {
      orderId: this.orderProcess[0].order.orderId,
      customerId: this.orderProcess[0].order.customerId,
      packageId: this.orderProcess[0].order.packageId,
      totalCost: this.orderProcess[0].order.totalCost,
      status: status,
      payment: this.orderProcess[0].order.payment,
    }
    this.store.dispatch(new EditOrderRequest(order))
    const payment: Payment = {
      orderId: this.orderProcess[0].order.orderId,
      amount: this.formGroup.value.amount,
      remainingAmount: this.remainingAmount - this.formGroup.value.amount,
      date: new Date(),
      image: 'url',
      status: 1
    }
    this.store.dispatch(new CreatePaymentRequest({ ...payment }))
  }

  saveFromCreatePaymentFromCustomer() {
    const payment: Payment = {
      orderId: this.orderProcess[0].order.orderId,
      amount: this.formGroup.value.amount,
      remainingAmount: this.remainingAmount - this.formGroup.value.amount,
      date: new Date(),
      image: 'url',
      status: 0
    }
    this.store.dispatch(new CreatePaymentRequest({ ...payment }))
  }

  saveFromRetryPayment() {
    if (!this.higherRemainingAmountFromRetryPayment) {
      let acepted: boolean = false
      let pending: boolean = false
      let addition: number = 0
      for (const element of this.orderProcess[0].order.payment) {
        if (element !== undefined && element.status === 1 || element.status === 0) {
          addition += element.amount
          if (element.status === 1) {
            acepted = true
          } else {
            pending = true
          }
        }
      }
      const remainingAmount = this.orderProcess[0].order.totalCost - addition - this.formGroup.value.amount
      let status: number
      if (acepted && !pending) {
        status = 1
      } else if (!acepted && pending) {
        status = 0
      } else if (!acepted && !pending) {
        status = 0
      } else if (acepted && pending) {
        status = 1
      }

      const order: Order = {
        orderId: this.orderProcess[0].order.orderId,
        customerId: this.orderProcess[0].order.customerId,
        packageId: this.orderProcess[0].order.packageId,
        totalCost: this.orderProcess[0].order.totalCost,
        status: status,
        payment: this.orderProcess[0].order.payment,
      }
      this.store.dispatch(new EditOrderRequest(order))

      const payment: Payment = {
        paymentId: this.orderProcess[0].payment.paymentId,
        orderId: this.orderProcess[0].order.orderId,
        amount: this.formGroup.value.amount,
        remainingAmount: remainingAmount,
        date: new Date(),
        image: 'url',
        status: 0,
        orderDetail: this.orderProcess[0].payment.orderDetail
      }
      this.store.dispatch(new EditPaymentRequest({ ...payment }))
    } else {
      if (this.orderRemainingAmountsZero) {
        let acepted: boolean = false
        let pending: boolean = false
        for (const element of this.orderProcess[0].order.payment) {
          if (element !== undefined) {
            if (element.status === 1) {
              acepted = true
            } else if (element.status === 0) {
              pending = true
            }
          }
        }
        let status: number
        if (acepted && !pending) {
          status = 2
        } else if (!acepted && pending) {
          status = 0
        } else if (!acepted && !pending) {
          status = 0
        } else if (acepted && pending) {
          status = 1
        }
        const order: Order = {
          orderId: this.orderProcess[0].order.orderId,
          customerId: this.orderProcess[0].order.customerId,
          packageId: this.orderProcess[0].order.packageId,
          totalCost: this.orderProcess[0].order.totalCost,
          status: status,
          payment: this.orderProcess[0].order.payment,
        }
        this.store.dispatch(new EditOrderRequest(order))

        const payment: Payment = {
          paymentId: this.orderProcess[0].payment.paymentId,
          orderId: this.orderProcess[0].order.orderId,
          amount: 0,
          remainingAmount: 0,
          date: new Date(),
          image: 'url',
          status: 1,
          orderDetail: this.orderProcess[0].payment.orderDetail
        }
        this.store.dispatch(new EditPaymentRequest({ ...payment }))
      } else {
        let acepted: boolean = false
        let pending: boolean = false
        for (const element of this.orderProcess[0].order.payment) {
          if (element !== undefined) {
            if (element.status === 1) {
              acepted = true
            } else if (element.status === 0) {
              pending = true
            }
          }
        }
        let status: number
        if (acepted && !pending) {
          status = 1
        } else if (!acepted && pending) {
          status = 0
        } else if (!acepted && !pending) {
          status = 0
        } else if (acepted && pending) {
          status = 1
        }
        const remainingAmount = this.remainingAmount - this.formGroup.value.amount
        const order: Order = {
          orderId: this.orderProcess[0].order.orderId,
          customerId: this.orderProcess[0].order.customerId,
          packageId: this.orderProcess[0].order.packageId,
          totalCost: this.orderProcess[0].order.totalCost,
          status: status,
          payment: this.orderProcess[0].order.payment,
        }
        this.store.dispatch(new EditOrderRequest(order))

        const payment: Payment = {
          paymentId: this.orderProcess[0].payment.paymentId,
          orderId: this.orderProcess[0].order.orderId,
          amount: this.formGroup.value.amount,
          remainingAmount: remainingAmount,
          date: new Date(),
          image: 'url',
          status: 0,
          orderDetail: this.orderProcess[0].payment.orderDetail
        }
        this.store.dispatch(new EditPaymentRequest({ ...payment }))
      }
    }
  }

  async save() {
    if (this.validForm()) {
      if (this.orderProcess[0].action === 'CreatePayment') {
        this.saveFromCreatePayment()
      } else if (this.orderProcess[0].action === 'CreatePaymentFromCustomer') {
        this.saveFromCreatePaymentFromCustomer()
      } else if (this.orderProcess[0].action === 'RetryPayment') {
        this.saveFromRetryPayment()
      } else {
        const beneficiaries = this.orderProcess[0].beneficiaries
        const remainingAmount = this.totalCost - this.formGroup.value.amount
        for (const element of beneficiaries) {
          if (element.customerId === undefined) {
            const customerModel: Customer = {
              name: element.name,
              lastName: element.lastName,
              document: element.document,
              address: element.address,
              phoneNumber: element.phoneNumber,
              birthDate: element.birthDate,
              eps: element.eps,
              user: element.user,
            }
            const data = await new Promise((resolve, reject) => {
              this.apiService.addCustomer(customerModel).subscribe({
                next: (data) => {
                  resolve(data);
                },
                error: (err) => {
                  reject(err);
                }
              });
            });
            if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
              const orderDetail: OrderDetail = {
                beneficiaryId: data['customerId'],
                unitPrice: element.price
              };
              this.orderDetail.push(orderDetail)
              if (element.addToFt) {
                const frequentTraveler: FrequentTraveler = {
                  customerId: this.orderProcess[0].order.customerId,
                  travelerId: data['customerId']
                }
                this.apiService.addFrequentTraveler(frequentTraveler).subscribe({
                  next: (data) => {
                  },
                  error: (err) => {
                    console.log("Error while creating: ", err);
                  }
                })
              }
            } else {
              const orderDetail: OrderDetail = {
                beneficiaryId: data['customerId'],
                unitPrice: element.price
              };
              this.orderDetail.push(orderDetail);
              if (element.addToFt !== null) {
                if (element.addToFt) {
                  const frequentTraveler: FrequentTraveler = {
                    customerId: this.orderProcess[0].order.customer.customerId,
                    travelerId: data['customerId']
                  }
                  this.apiService.addFrequentTraveler(frequentTraveler).subscribe({
                    next: (data) => {
                    },
                    error: (err) => {
                      console.log("Error while creating: ", err);
                    }
                  })
                }
              }
            }
          } else {
            if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
              const orderDetail: OrderDetail = {
                beneficiaryId: element.customerId,
                unitPrice: element.price
              }
              this.orderDetail.push(orderDetail);
            } else {
              const orderDetail: OrderDetail = {
                beneficiaryId: element.customerId,
                unitPrice: element.price
              }
              this.orderDetail.push(orderDetail);
            }
          }
        }
        if (this.orderProcess[0].action === 'CreateOrderDetail' || this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
          let addition: number = 0
          let paymentStatus: number
          let orderStatus: number
          for (const element of this.oneOrder.payment) {
            if (element !== undefined && element.status === 1) {
              addition += element.amount
            }
          }
          const orderDetailRemainingAmount = this.oneOrder.totalCost + this.totalCost - addition - this.formGroup.value.amount

          if (this.orderProcess[0].action === 'CreateOrderDetailFromCustomer') {
            paymentStatus = 0
            if (this.oneOrder.status === 0) {
              orderStatus = 0
            } else if (this.oneOrder.status === 1) {
              orderStatus = 1
            } else if (this.oneOrder.status === 2) {
              orderStatus = 1
            }
          } else if (this.orderProcess[0].action === 'CreateOrderDetail') {
            paymentStatus = 1
            if (orderDetailRemainingAmount === 0) {
              orderStatus = 2
            }
            else if (orderDetailRemainingAmount > 0) {
              orderStatus = 1
            }
            else {
              orderStatus = 3
            }
          }
          const order: Order = {
            orderId: this.oneOrder.orderId,
            customerId: this.oneOrder.customerId,
            packageId: this.oneOrder.packageId,
            totalCost: this.oneOrder.totalCost + this.totalCost,
            status: orderStatus,
            payment: this.oneOrder.payment
          }
          this.store.dispatch(new EditOrderRequest({ ...order }))

          // UPDATE PACAKGE
          this.editPackage(this.oneOrder.package)

          const payment: Payment = {
            orderId: this.orderProcess[0].order.orderId,
            amount: this.formGroup.value.amount,
            remainingAmount: orderDetailRemainingAmount,
            date: new Date(),
            image: "url",
            status: paymentStatus,
            orderDetail: this.orderDetail
          }

          this.store.dispatch(new CreateOrderDetailRequest({ ...payment }))
        } else if (this.orderProcess[0].action === 'CreateOrderFromCustomer') {
          const payment: Payment = {
            amount: this.formGroup.value.amount,
            remainingAmount: remainingAmount,
            date: new Date(),
            image: "url",
            status: 0,
            orderDetail: this.orderDetail
          }

          const order: Order = {
            customerId: this.orderProcess[0].order.customer.customerId,
            packageId: this.orderProcess[0].order.package.packageId,
            totalCost: this.totalCost,
            status: 0,
            payment: [payment]
          }

          //UPDATE PACKAGE
          this.editPackage(this.orderProcess[0].order.package)

          this.store.dispatch(new CreateOrderRequest({ ...order }))
        } else {
          const payment: Payment = {
            amount: this.formGroup.value.amount,
            remainingAmount: remainingAmount,
            date: new Date(),
            image: "url",
            status: 1,
            orderDetail: this.orderDetail
          }

          let status: number
          if (this.formGroup.value.amount === this.totalCost) {
            status = 2
          } else {
            status = 1
          }

          const order: Order = {
            customerId: this.orderProcess[0].order.customer.customerId,
            packageId: this.orderProcess[0].order.package.packageId,
            totalCost: this.totalCost,
            status: status,
            payment: [payment]
          }

          //UPDATE PACKAGE
          this.editPackage(this.orderProcess[0].order.package)

          this.store.dispatch(new CreateOrderRequest({ ...order }))
        }
      }
    }
  }
}