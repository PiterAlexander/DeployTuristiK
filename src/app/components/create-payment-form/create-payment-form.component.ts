import { Costumer } from '@/models/costumer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Package } from '@/models/package';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { CreateOrderRequest, CreatePaymentRequest, GetAllOrdersRequest, GetAllPackagesRequest, OpenModalCreateOrderDetail, OpenModalPayments } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';

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
  public allPackages: Array<Package>
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
    this.store.dispatch(new GetAllPackagesRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.oneOrder = state.oneOrder.data
      if (this.oneOrder != null) {
        this.totalCost = this.oneOrder.totalCost
        let addition = 0
        this.oneOrder.payment.forEach(element => {
          if (element != undefined) {
            addition += element.amount
          }
        })
        this.remainingAmount = this.totalCost - addition
      } else {
        this.orderProcess = state.orderProcess.data
        this.allPackages = state.allPackages.data
        this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
        this.onePackage = this.allPackages.find(p => p.packageId === this.orderProcess[0].order.package.packageId)
        this.totalCost = this.onePackage.price * this.beneficiariesAmount
      }
    })
    this.formGroup = this.fb.group({
      amount: ['', Validators.required],
      img: [null, Validators.required],
    });
  }

  back() {
    if (this.oneOrder != null) {
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalPayments(this.oneOrder))
    } else {
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreateOrderDetail)
    }
  }

  //<--- VALIDATIONS --->

  fromCreatePayment(): boolean {
    if (this.oneOrder != null) {
      return true
    }
    return false
  }

  validForm(): boolean {
    return this.formGroup.value.amount > 0 &&
      this.formGroup.value.img != null && !this.formGroup.invalid &&
      !this.validateInitialPayment() && !this.validateFullPrice()
  }

  validateInitialPayment(): boolean {
    if (this.oneOrder != null) {
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
    if (this.oneOrder != null) {
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
      if (this.oneOrder != null) {
        const payment: Payment = {
          orderId: this.oneOrder.orderId,
          amount: this.formGroup.value.amount,
          remainingAmount: this.remainingAmount - this.formGroup.value.amount,
          date: new Date(),
          image: "url",
          status: 1
        }

        this.store.dispatch(new CreatePaymentRequest({ ...payment }))
        // this.apiService.addPayment(payment).subscribe({
        //   next: (data) => {
        //     this.store.dispatch(new GetAllOrdersRequest)
        //     this.ui.subscribe((state: UiState) => {
        //       this.allOrders = state.allOrders.data
        //     })
        //     const oneOrder = this.allOrders.find(o => o.orderId === this.oneOrder.costumerId)
        //     this.modalService.dismissAll();
        //     this.store.dispatch(new OpenModalPayments(oneOrder))
        //   },
        //   error: (err) => {
        //   }
        // });
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

            const orderDetail: OrderDetail = {
              beneficiaryId: data['costumerId'],
              unitPrice: unitPrice
            };

            this.orderDetail.push(orderDetail);
          } else {
            const orderDetail: OrderDetail = {
              beneficiaryId: element.costumerId,
              unitPrice: unitPrice
            };

            this.orderDetail.push(orderDetail);
          }
        }

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
          costumerId: this.orderProcess[0].order.costumerId,
          packageId: this.orderProcess[0].order.package.packageId,
          totalCost: this.totalCost,
          status: status,
          payment: [payment],
          orderDetail: this.orderDetail
        }

        this.store.dispatch(new CreateOrderRequest({ ...order }))
      }
    }
  }
}