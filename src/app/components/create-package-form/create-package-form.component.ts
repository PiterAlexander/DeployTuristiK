import { CreatePackageRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-package-form',
  templateUrl: './create-package-form.component.html',
  styleUrls: ['./create-package-form.component.scss']
})
export class CreatePackageFormComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    
    this.formGroup = this.fb.group({
      name: [null, Validators.required],
      destination: [null, Validators.required],
      details: [null, Validators.required],
      transport: [0, Validators.required],
      hotel: [null, Validators.required],
      departureDate: [null, Validators.required],
      arrivalDate: [null, Validators.required],
      departurePoint: [null, Validators.required],
      totalQuotas: [null, Validators.required],
      availableQuotas: [null],
      price: [null, Validators.required],
      image: [null, Validators.required],
      status: [0, Validators.required]
    });
  }


  savePackage() {
    let valueForm = this.formGroup.value
  
    this.store.dispatch(new CreatePackageRequest({
      ...valueForm,
      availableQuotas: this.formGroup.value.totalQuotas
    }));

  }

  validForm(): boolean {
    return this.formGroup.valid && this.formGroup.value.status != 0 && this.formGroup.value.transport != 0
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
