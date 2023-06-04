import { CreateCostumerRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Costumer } from '@/models/costumer';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-createcostumerform',
  templateUrl: './createcostumerform.component.html',
  styleUrls: ['./createcostumerform.component.scss']
})
export class CreatecostumerformComponent implements OnInit {
  
  public ui: Observable<UiState>
  public ActionTitle: string = "Agregar"
  formGroup: FormGroup;
  public costumerData

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [null, Validators.required],
      lastName: [null, Validators.required],
      document: [null, Validators.required],
      birthDate: [0, Validators.required],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      eps: [null, Validators.required],
      user:[null, Validators.required],
    });
  }


  saveCostumer() {
    if (this.costumerData == null) {
      const model: Costumer = {
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        EPS: this.formGroup.value.eps,
        User:[],
        frequentTravel: []
      }
      this.store.dispatch(new CreateCostumerRequest({...model}));
      console.log(model)
    } else {
      const model: Costumer = {
        costumerId: this.costumerData.costumerId,
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        EPS: this.formGroup.value.eps,
        User: [],
        frequentTravel: []
      }
      ;
    }

  }

  validForm(): boolean {
    return true
  }

  cancel() {
    this.modalService.dismissAll();
  }
}

