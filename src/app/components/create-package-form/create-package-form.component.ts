import { CreatePackageRequest, EditPackageRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Package } from '@/models/package';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-package-form',
  templateUrl: './create-package-form.component.html',
  styleUrls: ['./create-package-form.component.scss']
})

export class CreatePackageFormComponent implements OnInit {
  public ui: Observable<UiState>
  public ActionTitle: string = "Registrar"
  public formGroup: FormGroup
  public packageData: Package
  public allPackages: Array<any>
  public transports: any[] = [];
  public date: Date;
  public showCalendar: boolean = false;

  openCalendar() {
    this.showCalendar = true;
  }

  onDateSelect() {
    this.showCalendar = false;
  }

  //From Calendar
  public departureCalendardate: Date
  public ArrivalCalendardate: Date

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modal: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allPackages = state.allPackages.data
      this.packageData = state.onePackage.data
      var date = state.dateCalendarSelected.data

      if (date) {
        this.departureCalendardate = date
        //Definir fecha de llegada (un dia despues de la de salida)
        const fechaAumentada = new Date(date.getTime());
        fechaAumentada.setDate(date.getDate() + 1);
        this.ArrivalCalendardate = fechaAumentada
      }
    })

    this.transports = [
      { label: 'Aereo', value: 1 },
      { label: 'Terrestre', value: 2 },
    ];

    this.formGroup = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(8)]],
      destination: [null, [Validators.required, Validators.minLength(8)]],
      details: [null, [Validators.required, Validators.minLength(25)]],
      transport: [0, [Validators.required]],
      hotel: [null, Validators.required],
      departureDate: new FormControl('', [Validators.required, this.fechaValida.bind(this)]),
      arrivalDate: new FormControl('', [Validators.required, this.fechaValida.bind(this), this.validarFechaRegreso.bind(this)]),
      departurePoint: [null, Validators.required],
      totalQuotas: [null, [Validators.required, Validators.min(15)]],
      availableQuotas: [0],
      price: [null, [Validators.required, Validators.min(100000)]],
      type: [0, Validators.required],
      status: [1, Validators.required],
      aditionalPrice: [null, [Validators.required]],
    })

    if (this.packageData != null) {
      this.ActionTitle = "Editar"

      // var newDate = this.formatDate(this.packageData.arrivalDate)
      //console.log("Aqui la fecha oficiarl de llegada",newDate)
      this.formGroup.setValue({
        name: this.packageData.name,
        destination: this.packageData.destination,
        details: this.packageData.details,
        transport: this.packageData.transport,
        hotel: this.packageData.hotel,
        arrivalDate: this.formatDate(this.packageData.arrivalDate),
        departureDate: this.formatDate(this.packageData.departureDate),
        departurePoint: this.packageData.departurePoint,
        totalQuotas: this.packageData.totalQuotas,
        availableQuotas: this.packageData.totalQuotas,
        price: this.packageData.price,
        type: this.packageData.type,
        status: this.packageData.status,
        aditionalPrice: this.packageData.aditionalPrice
      })
    }

    if (this.departureCalendardate) {
      this.formGroup = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(8)]],
        destination: [null, [Validators.required, Validators.minLength(8)]],
        details: [null, [Validators.required, Validators.minLength(25)]],
        transport: [0, [Validators.required]],
        hotel: [null, Validators.required],
        departureDate: new FormControl(this.departureCalendardate, [Validators.required, this.fechaValida.bind(this)]),
        arrivalDate: new FormControl(this.ArrivalCalendardate, [Validators.required, this.fechaValida.bind(this), this.validarFechaRegreso.bind(this)]),
        departurePoint: [null, Validators.required],
        totalQuotas: [null, [Validators.required, Validators.min(15)]],
        availableQuotas: [0],
        price: [null, [Validators.required, Validators.min(100000)]],
        type: [0, Validators.required],
        status: [1, Validators.required]
      })
    }
  };

  resetForm() {
    this.formGroup.reset();
  }

  cancel() {
    this.modal.close()
  }

  savePackage() {
    if (!this.formGroup.invalid) {
      if (this.packageData === undefined) {
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
          aditionalPrice: this.formGroup.value.aditionalPrice,
        }

        this.store.dispatch(new CreatePackageRequest({ ...model }));
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
          aditionalPrice: this.formGroup.value.aditionalPrice,
        }
        
        this.store.dispatch(new EditPackageRequest({ ...model }));
      }
    }
  }

  validForm(): boolean {
    if (this.packageData == null) {
      return this.formGroup.valid
        && this.formGroup.value.status != 0 && !this.validateExistingPackageName()
    } else {
      return this.formGroup.valid
        && this.formGroup.value.status != 0 && !this.validateExistingPackageName()
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

  get departureDate() {
    return this.formGroup.value.departureDate;
  }


  formatDate(date: any): Date {
    const opcionesFecha = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

    date = new Date(date)
    let fechaConvertida = date.toLocaleString('en-ES', opcionesFecha).replace(/,/g, '');;
    fechaConvertida = new Date(fechaConvertida.replace(/PM GMT-5/g, 'GMT-0500 (Colombia Standard Time)'))

    return fechaConvertida;
  }
}
