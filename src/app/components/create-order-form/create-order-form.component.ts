import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.scss']
})
export class CreateOrderFormComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      costumerId: [0, Validators.required],
      packageId: [0, Validators.required],
      beneficiaries: [null, Validators.required],
    });
  }

  validForm(): boolean {
    return this.formGroup.valid && this.formGroup.value.costumerId != 0 && this.formGroup.value.packageId != 0
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
