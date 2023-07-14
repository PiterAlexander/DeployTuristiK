import { CreatePackageRequest, EditPackageRequest, OpenModalDetailsPackage } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Package } from '@/models/package';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { ApiService } from '@services/api.service';

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
  public allPackages: Array<any>
  selectedDestiny: any;

  //From Calendar
  public departureCalendardate: string
  public ArrivalCalendardate: string


  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>, private service: ApiService) { }
  public handleDestinationChange(destination: any) {
    this.selectedDestiny = destination.formatted_address;
  }

  ngOnInit(): void {

    this.formGroup = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(8)]],//
      destination: [null, [Validators.required, Validators.minLength(8)]],//
      details: [null, [Validators.required, Validators.minLength(25)]],//
      transport: [0, [Validators.required]],//
      hotel: [null, Validators.required],//
      departureDate: new FormControl('', [Validators.required, this.fechaValida.bind(this)]),//
      arrivalDate: new FormControl('', [Validators.required, this.fechaValida.bind(this), this.validarFechaRegreso.bind(this)]),//
      departurePoint: [null, Validators.required],//
      totalQuotas: [null, [Validators.required, Validators.min(15)]],
      availableQuotas: [0],
      price: [null, [Validators.required, Validators.min(100000)]],
      type: [0, Validators.required],
      status: [1, Validators.required]
    })
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allPackages = state.allPackages.data
      this.packageData = state.onePackage.data
      var date = state.dateCalendarSelected.data
      console.log(date)

      if(date){
        const fechaFormateada = date.toISOString().slice(0, 16);
        this.departureCalendardate = fechaFormateada;

        const fechaFormateada_2 = new Date(fechaFormateada);
        fechaFormateada_2.setDate(fechaFormateada_2.getDate() + 1);
        const nuevaFechaFormateada = fechaFormateada_2.toISOString().slice(0, 16);
        this.ArrivalCalendardate = nuevaFechaFormateada
      }
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
        availableQuotas: this.packageData.totalQuotas,
        price: this.packageData.price,
        type: this.packageData.type,
        status: this.packageData.status,
      })
    }

    if (this.departureCalendardate) {
      this.formGroup = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(8)]],//
        destination: [null, [Validators.required, Validators.minLength(8)]],//
        details: [null, [Validators.required, Validators.minLength(25)]],//
        transport: [0, [Validators.required]],//
        hotel: [null, Validators.required],//
        departureDate: new FormControl(this.departureCalendardate, [Validators.required, this.fechaValida.bind(this)]),//
        arrivalDate: new FormControl(this.ArrivalCalendardate, [Validators.required, this.fechaValida.bind(this), this.validarFechaRegreso.bind(this)]),//
        departurePoint: [null, Validators.required],//
        totalQuotas: [null, [Validators.required, Validators.min(15)]],
        availableQuotas: [0],
        price: [null, [Validators.required, Validators.min(100000)]],
        type: [0, Validators.required],
        status: [1, Validators.required]
      })
    }
    
  }


  savePackage() {
    if (this.formGroup.invalid) {
      return;
    } else {
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
          type: this.formGroup.value.type,
          status: this.formGroup.value.status,
        }
        this.store.dispatch(new CreatePackageRequest({ ...model }));
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
          availableQuotas: this.formGroup.value.totalQuotas,
          price: this.formGroup.value.price,
          type: this.formGroup.value.type,
          status: this.formGroup.value.status,
        }
        this.store.dispatch(new EditPackageRequest({
          ...model
        }));
      }
    }
  }
  validForm(): boolean {
    if (this.packageData == null) {
      return this.formGroup.valid
        && this.formGroup.value.status != 0
        && !this.allPackages.find(item => item.name === this.formGroup.value.name)
    } else {
      return this.formGroup.valid
        && this.formGroup.value.status != 0
        && !this.allPackages.find(
          item => item.name === this.formGroup.value.name
            && item.roleId !== this.packageData.roleId)
    }
  }


  validateExistingPackageName(): boolean {
    if (this.packageData == null) {
      return this.allPackages.find(item => item.name === this.formGroup.value.name)
    } else {
      return this.allPackages.find(
        item => item.name === this.formGroup.value.name
          && item.packageId !== this.packageData.packageId)
    }
  }

  validarFechaRegreso(control: FormControl): { [s: string]: boolean } {
    let fechaSalida = null;
    let fechaRegreso = null;

    fechaRegreso = control.value;
    if (this.formGroup) {
      fechaSalida = this.departureDate;
      fechaRegreso = control.value
    }

    if (fechaRegreso && fechaSalida && fechaRegreso <= fechaSalida) {
      return { 'fechaInvalida': true };
    }
    return null;
  }

  fechaValida(control: FormControl): { [s: string]: boolean } {
    const fechaIngresada = new Date(control.value);
    const fechaHoy = new Date();

    if (fechaIngresada <= fechaHoy) {
      return { 'fechaInvalida': true };
    }

    return null;
  }


  cancel() {
    this.modalService.dismissAll();
  }

  get departureDate() {
    return this.formGroup.value.departureDate;
  }

}
