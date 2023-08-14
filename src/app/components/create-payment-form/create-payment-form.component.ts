import { Customer } from '@/models/customer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Package } from '@/models/package';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { EditOrderRequest, GetAllCustomerRequest, GetAllOrdersRequest, OpenModalCreateOrderDetail, OpenModalPayments } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-payment-form',
  templateUrl: './create-payment-form.component.html',
  styleUrls: ['./create-payment-form.component.scss']
})

export class CreatePaymentFormComponent implements OnInit {
  public formGroup: FormGroup;
  private ui: Observable<UiState>
  public role: any
  public user: any
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
  public imageFile: File

  constructor(
    public apiService: ApiService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.orderProcess = state.orderProcess.data
      this.allOrders = state.allOrders.data
    })

    this.formGroup = this.fb.group({
      amount: [null, Validators.required],
      img: [],
    });

    if (this.orderProcess[0].action === 'CreatePayment') {
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
      if (this.orderProcess[0].action === 'CreateOrderDetail') {
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
    if (this.orderProcess[0].action === 'CreatePayment' || this.orderProcess[0].action === 'RetryPayment') {
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalPayments(this.orderProcess[0].order))
    } else if (this.orderProcess[0].action === 'CreateOrderDetail') {
      const action: string = this.orderProcess[0].action
      this.orderProcess = [{
        action: action,
        order: this.oneOrder,
        beneficiaries: this.orderProcess[0].beneficiaries
      }]
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreateOrderDetail(this.orderProcess))
    } else if (this.orderProcess[0].action === 'CreateOrder') {
      this.modalPrimeNg.close()
      this.store.dispatch(new OpenModalCreateOrderDetail(this.orderProcess))
    }
  }

  onUploadFile(event: any) {
    this.imageFile = event.target.files[0]
  }

  //<--- VALIDATIONS --->

  fromCreatePayment(): boolean {
    if (this.orderProcess[0].action === 'CreatePayment') {
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
      aditionalPrice: onePackage.aditionalPrice,
      photos: onePackage.photos
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
    let paymentStatus: number
    let orderStatus: number
    if (this.role === 'Cliente') {
      paymentStatus = 0
      orderStatus = this.orderProcess[0].order.status
    } else {
      paymentStatus = 1
      if (this.formGroup.value.amount === this.remainingAmount) {
        orderStatus = 2
      } else {
        orderStatus = 1
      }
    }

    const order: Order = {
      orderId: this.orderProcess[0].order.orderId,
      customerId: this.orderProcess[0].order.customerId,
      packageId: this.orderProcess[0].order.packageId,
      totalCost: this.orderProcess[0].order.totalCost,
      status: orderStatus,
      payment: this.orderProcess[0].order.payment,
    }

    this.store.dispatch(new EditOrderRequest({ ...order }))

    const payment: Payment = {
      orderId: this.orderProcess[0].order.orderId,
      amount: this.formGroup.value.amount,
      remainingAmount: this.remainingAmount - this.formGroup.value.amount,
      date: new Date(),
      imageFile: this.imageFile,
      status: paymentStatus
    }

    const formData = new FormData();
    formData.append('orderId', payment.orderId)
    formData.append('amount', String(payment.amount))
    formData.append('remainingAmount', String(payment.remainingAmount))
    formData.append('date', payment.date.toISOString())
    formData.append('status', String(payment.status))

    if (payment.imageFile instanceof File) {
      formData.append('imageFile', payment.imageFile, payment.imageFile.name)
    } else {
      formData.append('imageFile', payment.imageFile)
    }

    this.apiService.addPayment(formData).subscribe({
      next: (data) => { },
      error: (err) => {
        console.log('Error occured while creating: ', err);
      }
    })
    this.modalPrimeNg.close()
    this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Abono agregado exitosamente.' });
    this.store.dispatch(new GetAllOrdersRequest)
  }

  // saveFromCreatePaymentFromCustomer() {
  //   const payment: Payment = {
  //     orderId: this.orderProcess[0].order.orderId,
  //     amount: this.formGroup.value.amount,
  //     remainingAmount: this.remainingAmount - this.formGroup.value.amount,
  //     date: new Date(),
  //     imageFile: this.imageFile,
  //     status: 0
  //   }

  //   const formData = new FormData();
  //   formData.append('orderId', payment.orderId)
  //   formData.append('amount', String(payment.amount))
  //   formData.append('remainingAmount', String(payment.remainingAmount))
  //   formData.append('date', payment.date.toISOString())
  //   formData.append('status', String(payment.status))

  //   if (payment.imageFile instanceof File) {
  //     formData.append('imageFile', payment.imageFile, payment.imageFile.name)
  //   } else {
  //     formData.append('imageFile', payment.imageFile)
  //   }

  //   this.apiService.addPayment(formData).subscribe({
  //     next: (data) => { },
  //     error: (err) => {
  //       console.log('Error occured while creating: ', err);
  //     }
  //   })
  //   this.modalPrimeNg.close()
  //   this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Abono agregado exitosamente.' });
  // }

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
      this.store.dispatch(new EditOrderRequest({ ...order }))

      const payment: Payment = {
        paymentId: this.orderProcess[0].payment.paymentId,
        orderId: this.orderProcess[0].order.orderId,
        amount: this.formGroup.value.amount,
        remainingAmount: remainingAmount,
        date: new Date(),
        image: this.orderProcess[0].payment.image,
        imageFile: this.imageFile,
        status: 0,
      }

      const formData = new FormData();
      formData.append('paymentId', payment.paymentId)
      formData.append('orderId', payment.orderId)
      formData.append('amount', String(payment.amount))
      formData.append('remainingAmount', String(payment.remainingAmount))
      formData.append('date', payment.date.toISOString())
      formData.append('image', String(payment.image))
      formData.append('status', String(payment.status))

      if (payment.imageFile instanceof File) {
        formData.append('imageFile', payment.imageFile, payment.imageFile.name)
      } else {
        formData.append('imageFile', payment.imageFile)
      }

      // this.store.dispatch(new EditPaymentRequest({ ...payment }))
      this.apiService.updatePayment(formData.get('paymentId'), formData).subscribe({
        next: (data) => { },
        error: (err) => {
          console.log('Error occured while updating: ', err);
        }
      })
      this.modalPrimeNg.close()
      this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Reintento exitoso.' });
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
          image: this.orderProcess[0].payment.image,
          imageFile: this.imageFile,
          status: 1
        }

        const formData = new FormData();
        formData.append('paymentId', payment.paymentId)
        formData.append('orderId', payment.orderId)
        formData.append('amount', String(payment.amount))
        formData.append('remainingAmount', String(payment.remainingAmount))
        formData.append('date', payment.date.toISOString())
        formData.append('image', String(payment.image))
        formData.append('status', String(payment.status))

        if (payment.imageFile instanceof File) {
          formData.append('imageFile', payment.imageFile, payment.imageFile.name)
        } else {
          formData.append('imageFile', payment.imageFile)
        }

        // this.store.dispatch(new EditPaymentRequest({ ...payment }))
        this.apiService.updatePayment(formData.get('paymentId'), formData).subscribe({
          next: (data) => { },
          error: (err) => {
            console.log('Error occured while updating: ', err);
          }
        })
        this.modalPrimeNg.close()
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Reintento exitoso.' });
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
          image: this.orderProcess[0].payment.image,
          imageFile: this.imageFile,
          status: 0,
        }

        const formData = new FormData();
        formData.append('paymentId', payment.paymentId)
        formData.append('orderId', payment.orderId)
        formData.append('amount', String(payment.amount))
        formData.append('remainingAmount', String(payment.remainingAmount))
        formData.append('date', payment.date.toISOString())
        formData.append('image', String(payment.image))
        formData.append('status', String(payment.status))

        if (payment.imageFile instanceof File) {
          formData.append('imageFile', payment.imageFile, payment.imageFile.name)
        } else {
          formData.append('imageFile', payment.imageFile)
        }

        // this.store.dispatch(new EditPaymentRequest({ ...payment }))
        this.apiService.updatePayment(formData.get('paymentId'), formData).subscribe({
          next: (data) => { },
          error: (err) => {
            console.log('Error occured while updating: ', err);
          }
        })
        this.modalPrimeNg.close()
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Reintento exitoso.' });
      }
    }
  }

  async save() {
    if (this.formGroup.valid) {
      if (this.orderProcess[0].action === 'CreatePayment') { // IF THE PROCESS COMES FROM CREATE PAYMENT FROM ADMIN/EMPLOYEE
        this.saveFromCreatePayment()
      } else if (this.orderProcess[0].action === 'RetryPayment') { // IF THE PROCESS COMES FROM RETRY PAYMENT
        this.saveFromRetryPayment()
      } else if (this.orderProcess[0].action === 'CreateOrderDetail') { // IF THE PROCESS COMES FROM CREATE ORDER DETAIL FROM ADMIN/EMPLOYEE OR CREATE ORDER DETAIL FROM CUSTOMER

        // WE´RE DEFINYING SOME VARIABLES TO SET ORDER AND PAYMENT STATUS
        let addition: number = 0
        let paymentStatus: number
        let orderStatus: number

        // FOR EACH ELEMENT OF ORDER'S PAYMENTS (this.oneOrder WAS DEFINED ABOVE IN THE FUNCTION getOrderById())
        for (const element of this.oneOrder.payment) {

          // IF THE PAYMENT IS NOT UNDEFINED AND ITS STATUS IS ACCEPTED OR PENDING
          if (element !== undefined && element.status === 1 || element.status === 0) {

            // THE ADDITION VARIABLE WILL ACOMULATE THE PAYMENT'S AMOUNT THAT CUMPLIES THE ABOVE CONDITION
            addition += element.amount
          }
        }

        // THIS CONST WILL BE A FORMULA OF THE ORDER'S TOTAL COST PLUS THE TOTAL COST OF THE BENEFICIARIES MINUS -
        // - THE ALREADY ACOMULATED ADDITION MINUS THE PAYMENT AMOUNT GIVEN IN THE FORM
        const orderDetailRemainingAmount = this.oneOrder.totalCost + this.totalCost - addition - this.formGroup.value.amount

        if (this.role === 'Cliente') { // IF THE PROCESS COMES FROM CREATE ORDER DETAIL FROM CUSTOMER
          paymentStatus = 0 // THE PAYMENT STATUS WILL BE PENDING BY DEFAULT
          if (this.oneOrder.status === 0) {
            orderStatus = 0 // IF THE ORDER STATUS WAS ALREADY PENDING, IT'S STATUS WILL STAY AS PENDING
          } else if (this.oneOrder.status === 1) {
            orderStatus = 1 // IF THE ORDER STATUS WAS IN PROGRESS, IT'S STATUS WILL STAY AS IN PROGRESS
          } else if (this.oneOrder.status === 2) {
            orderStatus = 1 // IF THE ORDER STATUS WAS PAID, IT'S STATUS WILL BE SET AS IN PROGRESS
          }
        } else { // IF THE PROCESS COMES FROM CREATE ORDER DETAIL FROM ADMIN/EMPLOYEE
          paymentStatus = 1 // THE PAYMENT STATUS WILL BE ACCEPTED BY DEFAULT
          if (orderDetailRemainingAmount === 0) {
            orderStatus = 2 // IF THE ABOVE CALCUTATION OF THE REMAINING AMOUNT RESULTED IN 0 THE ORDER STATUS WILL BE SET AS PAID
          }
          else if (orderDetailRemainingAmount > 0) {
            orderStatus = 1 // IF THE ABOVE CALCUTATION OF THE REMAINING AMOUNT RESULTED GREATER THAN 0 THE ORDER STATUS WILL BE SET AS IN PROGRESS
          }
          else {
            orderStatus = 3 // ANY OTHER WAY THE ORDER STATUS WILL BE SET AS CANCELED
          }
        }

        // WE'RE DEFINYING THE ORDER MODEL WITH ITS NEW STATUS
        const order: Order = {
          orderId: this.oneOrder.orderId,
          customerId: this.oneOrder.customerId,
          packageId: this.oneOrder.packageId,
          totalCost: this.oneOrder.totalCost + this.totalCost,
          status: orderStatus,
          payment: this.oneOrder.payment
        }

        // WE'RE CALLING THE PUT ACTION OF ORDER
        this.store.dispatch(new EditOrderRequest({ ...order }))

        // WE'RE DEFINYING THE PAYMENT MODEL WITH ITS CORRESPONDING VALUES
        const payment: Payment = {
          orderId: this.orderProcess[0].order.orderId,
          amount: this.formGroup.value.amount,
          remainingAmount: orderDetailRemainingAmount,
          date: new Date(),
          imageFile: this.imageFile,
          status: paymentStatus,
        }

        // WE'RE CREATING A FORMDATA OBJETC, THIS IS NECESSARY TO CREATE THE PAYMENT WITH ITS IMAGE
        const formData = new FormData();
        formData.append('orderId', String(payment.orderId))
        formData.append('amount', String(payment.amount))
        formData.append('remainingAmount', String(payment.remainingAmount))
        formData.append('date', payment.date.toISOString())
        formData.append('status', String(payment.status))

        // WE'RE VALIDATING THAT THE ATRIBUTTE IMAGEFILE HAS AN INSTANCFE OF TYPE FILE
        if (payment.imageFile instanceof File) {
          formData.append('imageFile', payment.imageFile, payment.imageFile.name) // IF SO, WE'RE APPENDING TO THE FORMDATA OBJECT THE IMAGEFILE & ITS NAME
        } else {
          formData.append('imageFile', payment.imageFile) // IF NOT, WE'RE APPENDING TO THE FORMDATA OBJECT ONLY THE IMAGEFILE
        }

        // WE'RE CALLING THE POST PETITION FOR PAYMENT
        const paymentResolved = await new Promise((resolve, reject) => {
          this.apiService.addPayment(formData).subscribe({
            next: (data) => {
              resolve(data)
            },
            error: (err) => {
              reject(err)
            }
          })
        });

        this.createCustomersAndOrderDetails(paymentResolved['paymentId'], this.oneOrder.package, this.orderProcess[0].order.customerId)

        // SOME NECESSARY ACTIONS TO END THE PROCESS
        this.modalPrimeNg.close()
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Beneficiario/s agregado/s exitosamente.' });
        this.store.dispatch(new GetAllCustomerRequest)
        this.store.dispatch(new GetAllOrdersRequest)

        // IF THE PROCESS COMES FROM CREATE ORDER FROM CUSTOMER THE NEXT CODE WILL EXECUTE
      } else if (this.orderProcess[0].action === 'CreateOrder') { // IF THE PROCESS COMES FROM CREATE ORDER FROM ADMIN/EMPLOYEE

        // HERE WE'RE DEFINYING THE ORDER STATUS
        let orderStatus: number
        let paymentStatus: number
        if (this.role === 'Cliente') {
          orderStatus = 0
          paymentStatus = 0
        } else {
          paymentStatus = 1
          if (this.formGroup.value.amount === this.totalCost) { // IF THE PAYMENT AMOUNT GIVEN EQUALS TO THE ORDER'S TOTAL COST
            orderStatus = 2 // THE ORDER STATUS WILL BE SETTED AS PAID
          } else { // IF THE PAYMENT AMOUNT GIVEN IS LOWER TO THE ORDER'S TOTAL COST
            orderStatus = 1 // THE ORDER STATUS WILL BE SETTED AS IN PROGRESS
          }
        }

        // WE'RE DEFINYING THE ORDER MODEL WITH ITS NEW STATUS
        const order: Order = {
          customerId: this.orderProcess[0].order.customer.customerId,
          packageId: this.orderProcess[0].order.package.packageId,
          totalCost: this.totalCost,
          status: orderStatus,
        }

        // WE'RE CALLING THE POST ACTION OF ORDER
        const orderResolved = await new Promise((resolve, reject) => {
          this.apiService.addOrder(order).subscribe({
            next: (data) => {
              resolve(data)
            },
            error: (err) => {
              reject(err)
            }
          })
        })

        // DEFINYING REMAINING AMOUNT
        const remainingAmount = this.totalCost - this.formGroup.value.amount

        // WE'RE DEFINYING THE PAYMENT MODEL WITH ITS CORRESPONDING VALUES
        const payment: Payment = {
          orderId: orderResolved['orderId'],
          amount: this.formGroup.value.amount,
          remainingAmount: remainingAmount,
          date: new Date(),
          imageFile: this.imageFile,
          status: paymentStatus,
        }

        // WE'RE CREATING A FORMDATA OBJETC, THIS IS NECESSARY TO CREATE THE PAYMENT WITH ITS IMAGE
        const formData = new FormData();
        formData.append('orderId', String(payment.orderId))
        formData.append('amount', String(payment.amount))
        formData.append('remainingAmount', String(payment.remainingAmount))
        formData.append('date', payment.date.toISOString())
        formData.append('status', String(payment.status))

        // WE'RE VALIDATING THAT THE ATRIBUTTE IMAGEFILE HAS AN INSTANCFE OF TYPE FILE
        if (payment.imageFile instanceof File) {
          formData.append('imageFile', payment.imageFile, payment.imageFile.name) // IF SO, WE'RE APPENDING TO THE FORMDATA OBJECT THE IMAGEFILE & ITS NAME
        } else {
          formData.append('imageFile', payment.imageFile) // IF NOT, WE'RE APPENDING TO THE FORMDATA OBJECT ONLY THE IMAGEFILE
        }

        // WE'RE CALLING THE POST PETITION FOR PAYMENT
        const paymentResolved = await new Promise((resolve, reject) => {
          this.apiService.addPayment(formData).subscribe({
            next: (data) => {
              resolve(data)
            },
            error: (err) => {
              reject(err)
            }
          })
        });

        this.createCustomersAndOrderDetails(paymentResolved['paymentId'], this.orderProcess[0].order.package, this.orderProcess[0].order.customer.customerId)

        // SOME NECESSARY ACTIONS TO END THE PROCESS
        this.modalPrimeNg.close()
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Pedido registrado exitosamente.' });
        this.store.dispatch(new GetAllCustomerRequest)
        this.store.dispatch(new GetAllOrdersRequest)
      }
    }
  }

  async createCustomersAndOrderDetails(paymentId: string, onePackage: Package, oneCustomerId: string) {
    // WE'RE ADDING THE BENEFICIARIES ARRAY TO A CONST
    const beneficiaries = this.orderProcess[0].beneficiaries

    // FOR EACH ELEMENT OF BENEFICIARIES' ARRAY
    for (const element of beneficiaries) {

      // HERE WE'RE VALIDATING IF THE BENEFICIARIE ALREADY HAS A CUSTOMERID. IF SO, THERE'S NO NEED TO CREATE A CUSTOMER
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

        // CONST (PROMISE) THAT CONTAINS THE CREATED CUSTOMER INFORMATION
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

        // // DEFINYING CUSTOMERID (TITULARID) FOR FREQUENT TRAVELERS
        // const customerId: string = oneCustomerId

        //DEFINYING ORDER DETAIL WITH THE CURRENT CUSTOMER INFORMATION
        const orderDetail: OrderDetail = {
          paymentId: paymentId,
          beneficiaryId: data['customerId'],
          unitPrice: element.price
        };

        // PUSHING THAT ORDER DETAIL INTO AN ARRAY OF ORDER DETAILS
        this.orderDetail.push(orderDetail)

        // HERE WE'RE DOING SOME VALIDATIONS TO KNOW IF THE BENEFICIARIE MUST GO TO THE CUSTOMER FREQUENT TRAVELERS OR NOT
        if (element.addToFt !== null) {
          if (element.addToFt) {

            //DEFINYING FREQUENT TRAVELER WITH THE CURRENT CUSTOMER INFORMATION
            const frequentTraveler: FrequentTraveler = {
              customerId: oneCustomerId,
              travelerId: data['customerId']
            }

            console.log(frequentTraveler);


            // ADDING THE FREQUENT TRAVELER TO THE CUSTOMER FREQUENT TRAVELERS
            this.apiService.addFrequentTraveler(frequentTraveler).subscribe({
              next: (data) => {
              },
              error: (err) => {
                console.log("Error while creating: ", err);
              }
            })
          }
        }
      } else {
        // THE BENEFICIARIE ALREADY HAS A CUSTOMERID. SO THERE'S NO NEED TO CREATE A NEW CUSTOMER

        //DEFINYING ORDER DETAIL WITH THE ALREADY EXISTED CUSTOMER INFORMATION
        const orderDetail: OrderDetail = {
          paymentId: paymentId,
          beneficiaryId: element.customerId,
          unitPrice: element.price
        }

        // PUSHING THAT ORDER DETAIL INTO AN ARRAY OF ORDER DETAILS
        this.orderDetail.push(orderDetail)
      }
    }
    // END OF FOR

    // FOR EACH ELEMENT OF ORDERDETAIL'S ARRAY
    for (const element of this.orderDetail) {
      const orderDetailModel: OrderDetail = {
        paymentId: element.paymentId,
        beneficiaryId: element.beneficiaryId,
        unitPrice: element.unitPrice
      }

      this.apiService.addOrderDetail(orderDetailModel).subscribe({
        next: () => {
        },
        error: (err) => {
          console.log('Error while creating: ', err);
        }
      })
    }
    // END OF FOR

    // WE'RE UPDATING THE ORDER'S PACKAGE AVAILABLE QUOTES
    this.editPackage(onePackage)
  }
}
