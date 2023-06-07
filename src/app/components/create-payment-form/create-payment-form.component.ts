import { Costumer } from '@/models/costumer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Payment } from '@/models/payment';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateCostumerRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
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

  constructor(
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

  save() {
    // this.store.dispatch(new CreateCostumerRequest(this.orderProcess[0].beneficiaries[0]))

    const payment: Payment = {
      amount: this.formGroup.value.amount,
      remainingAmount: this.orderProcess[0].order.totalCost,
      date: new Date(),
      image: "url",
      status: 1
    }

    // const order: Order = {
    //   costumerId: this.orderProcess[0].order.costumerId,
    //   packageId: this.orderProcess[0].order.packageId,
    //   totalCost: this.orderProcess[0].order.totalCost,
    //   status: this.orderProcess[0].order.status,
    //   payment: [payment],
    //   orderDetail: [orderDetail],
    // }
  }
}
