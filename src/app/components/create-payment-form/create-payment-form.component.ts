import { Customer } from '@/models/customer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Package } from '@/models/package';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { AdminMailReceptionRequest, AdminMailReceptionToCustomerRequest, EditOrderRequest, SaveOrderProcess, } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { mailRecepcion } from '@/models/mail';

@Component({
  selector: 'app-create-payment-form',
  templateUrl: './create-payment-form.component.html',
  styleUrls: ['./create-payment-form.component.scss']
})

export class CreatePaymentFormComponent implements OnInit {
  private ui: Observable<UiState>
  public formGroup: FormGroup
  public role: any
  public user: any
  public orderProcess: any
  public orderDetail: Array<OrderDetail> = []
  public allOrders: Array<Order>
  public allCustomers: Array<Customer>
  public onePackage: Package
  public totalCost: number
  public remainingAmount: number
  public beneficiariesAmount: number
  public oneOrder: Order
  public file: any
  public higherRemainingAmountFromRetryPayment: boolean = false
  public orderRemainingAmountsZero: boolean = false
  public imageFile: File
  public hasBeenSelected: boolean = false
  public acceptedFiles: string

  public sortOptions: SelectItem[] = []
  public sortOrder: number = 0
  public sortField: string = ''
  public visible: boolean = true

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allCustomers = state.allCustomers.data
      this.orderProcess = state.orderProcess.data
      this.allOrders = state.allOrders.data
    })

    this.formGroup = this.fb.group({
      amount: new FormControl(null, [Validators.required]),
      termsAndConditions: new FormControl(false),
    })

    this.acceptedFiles = ".png, .jpg, .jpeg"

    if (this.orderProcess !== undefined) {
      if (this.orderProcess.action === 'CreatePayment') {
        this.totalCost = this.orderProcess.order.totalCost
        let addition = 0
        for (const element of this.orderProcess.order.payment) {
          if (element != undefined && element.status === 1 || element.status === 0) {
            addition += element.amount
          }
        }
        this.remainingAmount = this.totalCost - addition
      } else if (this.orderProcess.action === 'RetryPayment') {
        const orderTotalCost = this.orderProcess.order.totalCost
        let orderAddition: number = 0

        for (const element of this.orderProcess.order.payment) {
          if (element !== undefined && element.status === 0 || element.status === 1) {
            orderAddition += element.amount
          }
        }
        const orderRemainingAmount: number = orderTotalCost - orderAddition
        let totalCost: number = 0
        if (this.orderProcess.payment.orderDetail.length > 0) {
          for (const element of this.orderProcess.payment.orderDetail) {
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
        this.beneficiariesAmount = this.orderProcess.beneficiaries.length
        this.onePackage = this.orderProcess.order.package
        if (this.orderProcess.action === 'CreateOrderDetail') {
          this.getOneOrderById(this.orderProcess.order.orderId)
          this.totalCost = this.orderProcess.order.totalCost
          this.remainingAmount = this.totalCost * 20 / 100
        } else {
          let totalCost: number = 0
          for (const element of this.orderProcess.beneficiaries) {
            if (element !== undefined) {
              totalCost += element.price
            }
          }
          this.totalCost = totalCost
          this.remainingAmount = this.totalCost * 20 / 100
        }
        // this.fillBeneficiariesArray()
      }
    } else {
      this.router.navigate(['Home/Pedidos'])
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
        orderDate: orderPromise['orderDate'],
        status: orderPromise['status'],
        payment: orderPromise['payment']
      }
      this.oneOrder = oneOrder
    }
  }

  back() {
    if (this.orderProcess.action === 'CreatePayment' || this.orderProcess.action === 'RetryPayment') {
      const orderId: string = this.orderProcess.order.orderId
      this.store.dispatch(new SaveOrderProcess(undefined))
      this.router.navigate(['Home/DetallesPedido/' + orderId])
    } else if (this.orderProcess.action === 'CreateOrderDetail') {
      const action: string = this.orderProcess.action
      const takenQuotas: number = this.orderProcess.order.takenQuotas
      this.orderProcess = {
        action: action,
        order: {
          order: this.oneOrder,
          takenQuotas: takenQuotas
        },
        beneficiaries: this.orderProcess.beneficiaries
      }
      this.store.dispatch(new SaveOrderProcess({ ...this.orderProcess }))
      this.router.navigate(['Home/ProcesoBeneficiarios'])
    } else if (this.orderProcess.action === 'CreateOrder') {
      const orderProcess = {
        action: this.orderProcess.action,
        beneficiaries: this.orderProcess.beneficiaries,
        order: {
          beneficiaries: this.orderProcess.beneficiaries.length,
          customer: this.orderProcess.order.customer,
          package: this.orderProcess.order.package,
          takenQuotas: this.orderProcess.order.takenQuotas
        }
      }

      this.store.dispatch(new SaveOrderProcess(orderProcess))
      this.router.navigate(['Home/ProcesoBeneficiarios'])
    }
  }

  fileTooltip(): string {
    if (this.hasBeenSelected) {
      if (this.imageFile !== undefined) {
        return 'Descartar comprobante'
      } else {
        return 'Subir comprobante'
      }
    }
  }

  onUploadFile(event: any, fileUpload: any) {
    if (this.imageFile === undefined) {
      this.imageFile = event.files[0]
      if (this.imageFile !== undefined) {
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Comprobante subido correctamente.' })
        this.hasBeenSelected = true
      }
    } else {
      this.imageFile = undefined
      this.hasBeenSelected = false
      fileUpload.clear()
      this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Comprobante descartado correctamente.' })
    }
  }

  //<--- VALIDATIONS --->

  fromCreatePayment(): boolean {
    if (this.orderProcess.action === 'CreatePayment') {
      return true
    }
    return false
  }

  validForm(): boolean {
    if (this.orderProcess.action === 'CreateOrder') {
      return this.formGroup.valid && this.formGroup.value.termsAndConditions !== false
    } else {
      return this.formGroup.valid
    }
  }

  async saveFromCreatePayment() {
    let paymentStatus: number
    let orderStatus: number
    if (this.role === 'Cliente') {
      paymentStatus = 0
      orderStatus = this.orderProcess.order.status
    } else {
      paymentStatus = 1
      if (this.formGroup.value.amount === this.remainingAmount) {
        orderStatus = 2
      } else {
        orderStatus = 1
      }
    }

    const order: Order = {
      orderId: this.orderProcess.order.orderId,
      customerId: this.orderProcess.order.customerId,
      packageId: this.orderProcess.order.packageId,
      totalCost: this.orderProcess.order.totalCost,
      orderDate: this.orderProcess.order.orderDate,
      status: orderStatus,
      payment: this.orderProcess.order.payment,
    }

    this.store.dispatch(new EditOrderRequest({ ...order }))

    const payment: Payment = {
      orderId: this.orderProcess.order.orderId,
      amount: this.formGroup.value.amount,
      remainingAmount: this.remainingAmount - this.formGroup.value.amount,
      date: new Date().toISOString(),
      imageFile: this.imageFile,
      status: paymentStatus
    }

    const formData = new FormData()
    formData.append('orderId', payment.orderId)
    formData.append('amount', String(payment.amount))
    formData.append('remainingAmount', String(payment.remainingAmount))
    formData.append('date', payment.date)
    formData.append('status', String(payment.status))

    if (payment.imageFile instanceof File) {
      formData.append('imageFile', payment.imageFile, payment.imageFile.name)
    } else {
      formData.append('imageFile', payment.imageFile)
    }

    const paymentResolved = await new Promise((resolve, reject) => {
      this.apiService.addPayment(formData).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })

    // FUNCTION TO SEND THE MAIL RECEPTION
    this.sendMails(this.orderProcess.order.orderId, payment.amount)


    // SOME NECESSARY ACTIONS TO END THE PROCESS
    const orderProcess: any = {
      action: 'CreatePayment'
    }

    this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
    this.router.navigate(['Home/DetallesAbono/' + paymentResolved['paymentId']])
  }

  async saveFromRetryPayment() {
    let acepted: boolean = false
    let pending: boolean = false
    let addition: number = 0
    for (const element of this.orderProcess.order.payment) {
      if (this.higherRemainingAmountFromRetryPayment) {
        if (element !== undefined && element.status === 1 || element.status === 0) {
          addition += element.amount
          if (element.status === 1) {
            acepted = true
          } else {
            pending = true
          }
        }
      } else {
        if (element !== undefined) {
          if (element.status === 1) {
            acepted = true
          } else if (element.status === 0) {
            pending = true
          }
        }
      }
    }

    let remainingAmount: number
    if (!this.higherRemainingAmountFromRetryPayment) {
      remainingAmount = this.orderProcess.order.totalCost - addition - this.formGroup.value.amount
    } else {
      if (this.orderRemainingAmountsZero) {
        remainingAmount = 0
      } else {
        remainingAmount = this.remainingAmount - this.formGroup.value.amount
      }
    }

    let orderStatus: number
    if (acepted && !pending && !this.orderRemainingAmountsZero) {
      orderStatus = 1
    } else if (acepted && !pending && this.orderRemainingAmountsZero) {
      orderStatus = 2
    } else if (!acepted && pending) {
      if (this.role === 'Cliente') {
        orderStatus = 0
      } else {
        orderStatus = 1
      }
    } else if (!acepted && !pending) {
      if (this.role === 'Cliente') {
        orderStatus = 0
      } else {
        orderStatus = 1
      }
    } else if (acepted && pending) {
      orderStatus = 1
    }

    const order: Order = {
      orderId: this.orderProcess.order.orderId,
      customerId: this.orderProcess.order.customerId,
      packageId: this.orderProcess.order.packageId,
      totalCost: this.orderProcess.order.totalCost,
      orderDate: this.orderProcess.order.orderDate,
      status: orderStatus,
      payment: this.orderProcess.order.payment,
    }

    this.store.dispatch(new EditOrderRequest({ ...order }))

    let amount: number
    let status: number
    if (!this.orderRemainingAmountsZero) {
      amount = this.formGroup.value.amount
      if (this.role === 'Cliente') {
        status = 0
      } else {
        status = 1
      }
    } else {
      amount = 0
      status = 1
    }

    const payment: Payment = {
      paymentId: this.orderProcess.payment.paymentId,
      orderId: this.orderProcess.order.orderId,
      amount: amount,
      remainingAmount: remainingAmount,
      date: new Date().toISOString(),
      image: this.orderProcess.payment.image,
      imageFile: this.imageFile,
      status: status,
    }

    const formData = new FormData()
    formData.append('paymentId', payment.paymentId)
    formData.append('orderId', payment.orderId)
    formData.append('amount', String(payment.amount))
    formData.append('remainingAmount', String(payment.remainingAmount))
    formData.append('date', payment.date.toLocaleString())
    formData.append('image', String(payment.image))
    formData.append('status', String(payment.status))

    if (payment.imageFile instanceof File) {
      formData.append('imageFile', payment.imageFile, payment.imageFile.name)
    } else {
      formData.append('imageFile', payment.imageFile)
    }

    this.apiService.updatePayment(formData.get('paymentId'), formData).subscribe({
      next: (data) => {
      },
      error: (err) => {
      }
    })

    // FUNCTION TO SEND THE MAIL RECEPTION
    this.sendMails(this.orderProcess.order.orderId, payment.amount)

    const orderProcess = {
      action: 'RetryPayment'
    }

    const paymentId: string = this.orderProcess.payment.paymentId
    this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
    this.router.navigate(['Home/DetallesAbono/' + paymentId])
  }

  async save() {
    if (this.validForm() && this.imageFile !== undefined) {
      if (this.orderProcess.action === 'CreatePayment') { // IF THE PROCESS COMES FROM CREATE PAYMENT FROM ADMIN/EMPLOYEE
        this.saveFromCreatePayment()
      } else if (this.orderProcess.action === 'RetryPayment') { // IF THE PROCESS COMES FROM RETRY PAYMENT
        this.saveFromRetryPayment()
      } else if (this.orderProcess.action === 'CreateOrder' || this.orderProcess.action === 'CreateOrderDetail') { // IF THE PROCESS COMES FROM CREATE ORDER DETAIL/ORDER FROM ADMIN/EMPLOYEE OR CREATE ORDER DETAIL/ORDER FROM CUSTOMER
        this.saveFromCreateOrderOrDetail()
      }
    }
  }

  async saveFromCreateOrderOrDetail() {
    // WE'RE ADDING THE BENEFICIARIES ARRAY TO A CONST
    const beneficiaries = this.orderProcess.beneficiaries

    // // DEFINYING CUSTOMERID (TITULARID) FOR FREQUENT TRAVELERS
    let customerId: string = this.orderProcess.order.customer.customerId

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
              resolve(data)
            },
            error: (err) => {
              reject(err)
            }
          })
        })

        //DEFINYING ORDER DETAIL WITH THE CURRENT CUSTOMER INFORMATION
        const orderDetail: OrderDetail = {
          // paymentId: paymentId,
          beneficiaryId: data['customerId'],
          unitPrice: element.price
        }

        // PUSHING THAT ORDER DETAIL INTO AN ARRAY OF ORDER DETAILS
        this.orderDetail.push(orderDetail)

        // HERE WE'RE DOING SOME VALIDATIONS TO KNOW IF THE BENEFICIARIE MUST GO TO THE CUSTOMER FREQUENT TRAVELERS OR NOT
        if (element.addToFt !== null) {
          if (element.addToFt) {

            //DEFINYING FREQUENT TRAVELER WITH THE CURRENT CUSTOMER INFORMATION
            const frequentTraveler: FrequentTraveler = {
              customerId: customerId,
              travelerId: data['customerId']
            }

            // ADDING THE FREQUENT TRAVELER TO THE CUSTOMER FREQUENT TRAVELERS
            this.apiService.addFrequentTraveler(frequentTraveler).subscribe({
              next: (data) => {
              },
              error: (err) => {
                console.log("Error while creating: ", err)
              }
            })
          }
        }
      } else {
        // THE BENEFICIARIE ALREADY HAS A CUSTOMERID. SO THERE'S NO NEED TO CREATE A NEW CUSTOMER

        //DEFINYING ORDER DETAIL WITH THE ALREADY EXISTED CUSTOMER INFORMATION
        const orderDetail: OrderDetail = {
          // paymentId: paymentId,
          beneficiaryId: element.customerId,
          unitPrice: element.price
        }

        // PUSHING THAT ORDER DETAIL INTO AN ARRAY OF ORDER DETAILS
        this.orderDetail.push(orderDetail)
      }
    }
    // END OF FOR

    // SENDING TO EDIT PACKAGE

    //ENDING PROCESS FROM DIFFERENT ENTRIES
    if (this.orderProcess.action === 'CreateOrder') {

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
        customerId: this.orderProcess.order.customer.customerId,
        packageId: this.orderProcess.order.package.packageId,
        totalCost: this.totalCost,
        orderDate: new Date(),
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
        date: new Date().toISOString(),
        imageFile: this.imageFile,
        status: paymentStatus,
      }

      // CONVERTING THE ORDERDETAIL JSON INTO A STRING SO WE CAN EXECUTE A CASCADE POST PETITION
      const orderDetailJson = JSON.stringify(this.orderDetail)

      // WE'RE CREATING A FORMDATA OBJETC, THIS IS NECESSARY TO CREATE THE PAYMENT WITH ITS IMAGE
      const formData = new FormData()
      formData.append('orderId', String(payment.orderId))
      formData.append('amount', String(payment.amount))
      formData.append('remainingAmount', String(payment.remainingAmount))
      formData.append('date', payment.date.toLocaleString())
      formData.append('status', String(payment.status))
      formData.append('OrderDetailJson', orderDetailJson)

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
      })

      // FUNCTION TO SEND THE MAIL RECEPTION
      this.sendMails(orderResolved['orderId'], payment.amount)

      // SOME NECESSARY ACTIONS TO END THE PROCESS
      const orderProcess: any = {
        action: 'CreateOrder'
      }

      this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
      this.router.navigate(['Home/DetallesAbono/' + paymentResolved['paymentId']])

      //IF COMES FROM CREATE ORDER DETAIL FROM ADMIN, EMPLOYEE OR CUSTOMER
    } else if (this.orderProcess.action === 'CreateOrderDetail') {

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
        orderDate: new Date(),
        payment: this.oneOrder.payment
      }

      // WE'RE CALLING THE PUT ACTION OF ORDER
      this.store.dispatch(new EditOrderRequest({ ...order }))

      // WE'RE DEFINYING THE PAYMENT MODEL WITH ITS CORRESPONDING VALUES
      const payment: Payment = {
        orderId: this.orderProcess.order.orderId,
        amount: this.formGroup.value.amount,
        remainingAmount: orderDetailRemainingAmount,
        date: new Date().toISOString(),
        imageFile: this.imageFile,
        status: paymentStatus,
      }

      // CONVERTING THE ORDERDETAIL JSON INTO A STRING SO WE CAN EXECUTE A CASCADE POST PETITION
      const orderDetailJson = JSON.stringify(this.orderDetail)

      // WE'RE CREATING A FORMDATA OBJETC, THIS IS NECESSARY TO CREATE THE PAYMENT WITH ITS IMAGE
      const formData = new FormData()
      formData.append('orderId', String(payment.orderId))
      formData.append('amount', String(payment.amount))
      formData.append('remainingAmount', String(payment.remainingAmount))
      formData.append('date', payment.date.toLocaleString())
      formData.append('status', String(payment.status))
      formData.append('OrderDetailJson', orderDetailJson)

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
      })

      // FUNCTION TO SEND THE MAIL RECEPTION
      this.sendMails(this.orderProcess.order.orderId, payment.amount)

      // SOME NECESSARY ACTIONS TO END THE PROCESS
      const orderProcess: any = {
        action: 'CreateOrderDetail'
      }

      this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
      this.router.navigate(['Home/DetallesAbono/' + paymentResolved['paymentId']])
    }
  }

  sendMails(orderId: string, amount: number) {
    // HERE WE'LL DEFINE THE MAIL MODEL THATS GOING TO BE SEND
    const mailModel: mailRecepcion = {
      orderId: orderId,
      amount: amount
    }

    // HERE WE'LL NOTIFY THE ADMIN ABOUT THE PAYMENT
    this.store.dispatch(new AdminMailReceptionRequest({ ...mailModel }))

    // HERE WE'LL NOTIFY THE CUSTOMER ABOUT THE ADMIN RECEPTION OF THE MAIL ABOUT THEIR PAYMENT
    this.store.dispatch(new AdminMailReceptionToCustomerRequest({ ...mailModel }))
  }
}
