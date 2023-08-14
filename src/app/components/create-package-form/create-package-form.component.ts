
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {PrimeNGConfig} from 'primeng/api';
import {GooglePlacesService} from '@services/google-places.service';
import {CreatePackageRequest, EditPackageRequest} from '@/store/ui/actions';
import {AppState} from '@/store/state';
import {Package} from '@/models/package';
import {UiState} from '@/store/ui/state';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-create-package-form',
    templateUrl: './create-package-form.component.html',
    styleUrls: ['./create-package-form.component.scss']
})
export class CreatePackageFormComponent implements OnInit {
    public ui: Observable<UiState>;
    public ActionTitle: string = 'Registrar';
    public formGroup: FormGroup;
    public packageData: Package;
    public allPackages: Array<any>;
    public transports: any[] = [];
    public departureCalendardate: Date;
    public ArrivalCalendardate: Date;
    public showCalendar: boolean = false;
    results: any[] = [];

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private primengConfig: PrimeNGConfig,
        private googlePlacesService: GooglePlacesService,
        private modal: DynamicDialogRef
    ) {
        this.primengConfig.ripple = true;
    }

    ngOnInit(): void {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.allPackages = state.allPackages.data;
            this.packageData = state.onePackage.data;
            var date = state.dateCalendarSelected.data;
            if (date) {
                this.departureCalendardate = date;
                const fechaAumentada = new Date(date.getTime());
                fechaAumentada.setDate(date.getDate() + 1);
                this.ArrivalCalendardate = fechaAumentada;
            }
        });

        this.transports = [
            {label: 'Aereo', value: 1},
            {label: 'Terrestre', value: 2}
        ];

        this.formGroup = this.fb.group({
            name: [null, [Validators.required, Validators.minLength(8)]],
            destination: [null, [Validators.required, Validators.minLength(8)]],
            details: [null, [Validators.required, Validators.minLength(25)]],
            transport: [0, [Validators.required]],
            hotel: [null, Validators.required],
            departureDate: new FormControl('', [
                Validators.required,
                this.fechaValida.bind(this)
            ]),
            arrivalDate: new FormControl('', [
                Validators.required,
                this.fechaValida.bind(this),
                this.validarFechaRegreso.bind(this)
            ]),
            departurePoint: [null, Validators.required],
            totalQuotas: [null, [Validators.required, Validators.min(15)]],
            availableQuotas: [0],
            price: [null, [Validators.required, Validators.min(100000)]],
            type: [0, Validators.required],
            status: [1, Validators.required],
            aditionalPrice: [null, [Validators.required]],
            photos: [null]
        });

        if (this.packageData != null) {
            this.ActionTitle = 'Editar';
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
                aditionalPrice: this.packageData.aditionalPrice,
                photos: this.packageData.photos
            });
        }

        if (this.departureCalendardate) {
            this.formGroup
                .get('departureDate')
                .setValue(this.departureCalendardate);
            this.formGroup
                .get('arrivalDate')
                .setValue(this.ArrivalCalendardate);
        }
    }

    onAddressChangeDestination(address: any) {
      if (this.formGroup) {
          const addressHtml = address.adr_address;
          console.log(address);
          const hiddenDiv = document.createElement('div');
          hiddenDiv.style.display = 'none';
          hiddenDiv.innerHTML = addressHtml;
          const locality =
              hiddenDiv.querySelector('.locality')?.textContent || '';
          const country =
              hiddenDiv.querySelector('.country-name')?.textContent || '';
          const regionElements = hiddenDiv.querySelectorAll('.region');
          if (regionElements.length >= 2) {
              const region = regionElements[1].textContent || '';
              const extractedText = `${locality}, ${region}, ${country}`;
              console.log(extractedText);
              this.formGroup.get('destination').setValue(extractedText);
          }else{
            const region = regionElements[0].textContent || '';
              const extractedText = `${locality}, ${region}, ${country}`;
              console.log(extractedText);
              this.formGroup.get('destination').setValue(extractedText);
          }
          if (address['photos']) {
              const photosToSave = address['photos'].map((photo: any) =>
                  photo.getUrl()
              );
              const photosString = photosToSave.join(', ');
              this.formGroup.get('photos').setValue(photosString);
              console.log(photosString);
          }
      }
  }

    onAddressChange(address: any) {
      if (this.formGroup) {
          const addressHtml = address.adr_address;
          console.log(address);
          const hiddenDiv = document.createElement('div');
          hiddenDiv.style.display = 'none';
          hiddenDiv.innerHTML = addressHtml;
          const locality =
              hiddenDiv.querySelector('.locality')?.textContent || '';
          const country =
              hiddenDiv.querySelector('.country-name')?.textContent || '';
          const regionElements = hiddenDiv.querySelectorAll('.region');
          if (regionElements.length >= 2) {
              const region = regionElements[1].textContent || '';
              const extractedText = `${locality}, ${region}, ${country}`;
              console.log(extractedText);
              this.formGroup.get('departurePoint').setValue(extractedText);
          }
      }
  }
    onHotelAddressChange(address: any) {
        if (this.formGroup) {
            const addressHtml = address.adr_address;
            console.log(address);
            const hiddenDiv = document.createElement('div');
            hiddenDiv.style.display = 'none';
            hiddenDiv.innerHTML = addressHtml;
            const locality =
                hiddenDiv.querySelector('.locality')?.textContent || '';
            const country =
                hiddenDiv.querySelector('.country-name')?.textContent || '';
            const regionElements = hiddenDiv.querySelectorAll('.region');
            if (regionElements.length >= 2) {
                const region = regionElements[0].textContent || '';
                const extractedText = `${address.name}, ${locality}, ${region}, ${country}`;
                console.log(extractedText);
                this.formGroup.get('hotel').setValue(extractedText);
            }
        }
        console.log(address);
    }

    openCalendar() {
        this.showCalendar = true;
    }

    onDateSelect() {
        this.showCalendar = false;
    }
    resetForm() {
        this.formGroup.reset();
    }

    cancel() {
        this.modal.close();
    }

    search(event: any) {
        const inputValue = event.query;
        if (inputValue) {
            this.googlePlacesService
                .getAutocompleteSuggestions(inputValue)
                .subscribe((data: any) => {
                    this.results = data.predictions;
                });
        }
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
                    photos: this.formGroup.value.photos
                };
                this.store.dispatch(new CreatePackageRequest({...model}));
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
                    photos: this.formGroup.value.photos
                };
                this.store.dispatch(new EditPackageRequest({...model}));
            }
        }
    }

    validForm(): boolean {
        if (this.packageData == null) {
            return (
                this.formGroup.valid &&
                this.formGroup.value.status != 0 &&
                !this.validateExistingPackageName()
            );
        } else {
            return (
                this.formGroup.valid &&
                this.formGroup.value.status != 0 &&
                !this.validateExistingPackageName()
            );
        }
    }

    validateExistingPackageName(): boolean {
        if (this.packageData == null) {
            return this.allPackages.find(
                (item) => item.name === this.formGroup.value.name
            );
        } else {
            return this.allPackages.find(
                (item) =>
                    item.name === this.formGroup.value.name &&
                    item.packageId !== this.packageData.packageId
            );
        }
    }

    validarFechaRegreso(control: FormControl): {[s: string]: boolean} {
        let fechaSalida = null;
        let fechaRegreso = null;

        fechaRegreso = control.value;
        if (this.formGroup) {
            fechaSalida = this.departureDate;
            fechaRegreso = control.value;
        }

        if (fechaRegreso && fechaSalida && fechaRegreso <= fechaSalida) {
            return {fechaInvalida: true};
        }
        return null;
    }

    fechaValida(control: FormControl): {[s: string]: boolean} {
        const fechaIngresada = new Date(control.value);
        const fechaHoy = new Date();
        if (fechaIngresada <= fechaHoy) {
            return {fechaInvalida: true};
        }

        return null;
    }

    get departureDate() {
        return this.formGroup.value.departureDate;
    }

    formatDate(date: any): Date {
        const opcionesFecha = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };

        date = new Date(date);
        let fechaConvertida = date
            .toLocaleString('en-ES', opcionesFecha)
            .replace(/,/g, '');
        fechaConvertida = new Date(
            fechaConvertida.replace(
                /PM GMT-5/g,
                'GMT-0500 (Colombia Standard Time)'
            )
        );

        return fechaConvertida;
    }
}
