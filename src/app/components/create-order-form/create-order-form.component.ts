import { AppState } from '@/store/state';
import { OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OrderService } from '@services/order.service';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.scss']
})
export class CreateOrderFormComponent implements OnInit {

  @Input() OrderData: Array<any> = []

  formGroup: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      CostumerId: [0, Validators.required],
      PackageId: [0, Validators.required],
      BeneficiariesAmount: [0, Validators.required],
    });
  }

  validForm(): boolean {
    return this.formGroup.valid &&
      this.formGroup.value.CostumerId != 0 &&
      this.formGroup.value.PackageId != 0 &&
      this.formGroup.value.BeneficiariesAmount > 0
  }

  // cancel() {
  //   this.modalService.dismissAll();
  // }

  Data() {
    this.OrderData.push({
      costumer: this.formGroup.value.CostumerId,
      package: this.formGroup.value.PackageId,
      benefiiaries: this.formGroup.value.BeneficiariesAmount
    })
    this.orderService.DataTrigger.emit({
      data: this.OrderData
    })
    console.log(this.OrderData)
  }

  next() {
    this.Data()
    // this.cancel()
    this.store.dispatch(new OpenModalCreateOrderDetail());
  }
}
