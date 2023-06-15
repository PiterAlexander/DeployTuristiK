import { Costumer } from '@/models/costumer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Payment } from '@/models/payment';
import { AppState } from '@/store/state';
import { CreateOrderRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
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
  // public orderDetail: Array<OrderDetail> = []
  public travelerIds: Array<any> = []
  public orderIdArray: Array<any> = []
  public orderDetail: { orderDetailId?: any, orderId?: any, beneficiaryId: any, unitPrice: number }[] = [];

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
    })
    console.log(this.orderProcess)
    this.formGroup = this.fb.group({
      amount: ['', Validators.required],
      img: ['', Validators.required],
    });
  }

  validForm(): boolean {
    return this.formGroup.value.amount > 0 &&
      this.formGroup.value.img != null
  }

  back() {
    this.modalService.dismissAll();
    this.store.dispatch(new OpenModalCreateOrderDetail)
  }

  async save() {
    const beneficiaries = this.orderProcess[0].beneficiaries;
    const unitPrice = this.orderProcess[0].order.totalCost / this.orderProcess[0].order.beneficiaries
    const remainingAmount = this.orderProcess[0].order.totalCost - this.formGroup.value.amount

    for (const element of beneficiaries) {
      const costumerModel: Costumer = element;
      this.apiService.addCostumer(costumerModel).subscribe({
        next: (data) => {
          this.travelerIds.push(data.costumerId)
        }, error: (err) => {
          console.log("Error:", err);
        }
      })
    }

    const payment: Payment = {
      amount: this.formGroup.value.amount,
      remainingAmount: remainingAmount,
      date: new Date(),
      image: "url",
      status: 1
    }

    for (let index = 0; index < this.travelerIds.length; index++) {
    }

    const order: Order = {
      costumerId: this.orderProcess[0].order.costumerId,
      packageId: this.orderProcess[0].order.packageId,
      totalCost: this.orderProcess[0].order.totalCost,
      status: this.orderProcess[0].order.status,
      payment: [payment],
    }

    // this.apiService.addOrder(order).subscribe({
    //   next: (data) => {
    //     this.orderIdArray.push(data.orderId)
    //   }, error: (err) => {
    //     console.log("Error:", err);
    //   }
    // })

    // for (let element of this.travelerIds) {
    //   this.orderDetail.push({
    //     orderId: this.orderIdArray[0],
    //     beneficiaryId: element,
    //     unitPrice: unitPrice
    //   })
    // }
    console.log(this.orderDetail)
  }
}