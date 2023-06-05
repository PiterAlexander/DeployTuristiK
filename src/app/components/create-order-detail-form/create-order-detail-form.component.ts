import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OrderService } from '@services/order.service';

@Component({
  selector: 'app-create-order-detail-form',
  templateUrl: './create-order-detail-form.component.html',
  styleUrls: ['./create-order-detail-form.component.scss']
})
export class CreateOrderDetailFormComponent implements OnInit {

  formGroup: FormGroup;

  public orderData: Array<any> = []

  constructor(
    private orderService: OrderService,

    private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.orderService.DataTrigger.subscribe(data => {
      this.orderData = data
    })
    this.formGroup = this.fb.group({
      Name: [null, Validators.required],
      LastName: [null, Validators.required],
      Document: [null, Validators.required],
      Address: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      BirthDate: [null, Validators.required],
      Eps: [null, Validators.required],
    });

  }

  validForm() {

  }

  back() {
    console.log("desde detail",this.orderData)
  }

  next() {

  }
}
