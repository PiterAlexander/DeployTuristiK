import { CreateEmployeeRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-employee-form',
  templateUrl: './create-employee-form.component.html',
  styleUrls: ['./create-employee-form.component.scss']
})
export class CreateEmployeeFormComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [null, Validators.required],
      lastName: [null, Validators.required],
      document: [null, Validators.required],
      birthDate: [0, Validators.required],
      phoneNumber: [null, Validators.required],
    });
  }


  saveCostumer() {
    let valueForm = this.formGroup.value
  
    this.store.dispatch(new CreateEmployeeRequest({
      ...valueForm,
    }));

  }

  validForm(): boolean {
    return true
  }

  cancel() {
    this.modalService.dismissAll();
  }
}

