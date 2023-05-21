import { CreatePackageRequest, EditPackageRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Package } from '@/models/package';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-package-form',
  templateUrl: './create-package-form.component.html',
  styleUrls: ['./create-package-form.component.scss']
})
export class CreatePackageFormComponent implements OnInit {


  public ui: Observable<UiState>
  public ActionTitle: string = "Agregar"
  formGroup: FormGroup;
  public packageData

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
    })
    this.ui = this.store.select('ui')
    this.ui.subscribe((state:UiState)=>{
      this.packageData = state.onePackage.data
    })

    if (this.packageData != null) {
      this.ActionTitle = "Editar"
      this.formGroup.setValue({
        name: this.packageData.name,
        destination: this.packageData.destination,
        details: this.packageData.details,
        transport: this.packageData.transport,
        hotel: this.packageData.hotel,
        arrivalDate: this.packageData.arrivalDate,
        departureDate: this.packageData.departureDate,
        departurePoint: this.packageData.departurePoint,
        totalQuotas: this.packageData.totalQuotas,
        availableQuotas: this.packageData.availableQuotas,
        price: this.packageData.price,
        image: this.packageData.image,
        status: this.packageData.status,
      })
    }
  }


  savePackage() {
    if (this.packageData == null) {
      const model: Package = {
        name: this.formGroup.value.name,
        destination: this.formGroup.value.destination,
        details: this.formGroup.value.details,
        transport: this.formGroup.value.transport,
        hotel: this.formGroup.value.hotel,
        arrivalDate: this.formGroup.value.arrivalDate,
        departureDate: this.formGroup.value.departureDate,
        departurePoint: this.formGroup.value.departurePoint,
        totalQuotas: this.formGroup.value.totalQuotas,
        availableQuotas: this.formGroup.value.totalQuotas,
        price: this.formGroup.value.price,
        image: this.formGroup.value.image,
        status: this.formGroup.value.status,
      }
      this.store.dispatch(new CreatePackageRequest({...model}));
      console.log(model)
    } else {
      const model: Package = {
        packageId: this.packageData.packageId,
        name: this.formGroup.value.name,
        destination: this.formGroup.value.destination,
        details: this.formGroup.value.details,
        transport: this.formGroup.value.transport,
        hotel: this.formGroup.value.hotel,
        arrivalDate: this.formGroup.value.arrivalDate,
        departureDate: this.formGroup.value.departureDate,
        departurePoint: this.formGroup.value.departurePoint,
        totalQuotas: this.formGroup.value.totalQuotas,
        availableQuotas: this.formGroup.value.availableQuotas,
        price: this.formGroup.value.price,
        image: this.formGroup.value.image,
        status: this.formGroup.value.status,
      }
      this.store.dispatch(new EditPackageRequest({
        ...model
      }));
    }

  }

  validForm(): boolean {
    return this.formGroup.valid && this.formGroup.value.status != 0 && this.formGroup.value.transport != 0
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
