import { Customer } from '@/models/customer';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateCustomerRequest, CreateFrequentTravelerRequest, EditCustomerRequest, FrequentTravelerActions } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-frequent-traveler-form',
  templateUrl: './create-frequent-traveler-form.component.html',
  // styleUrls: ['./create-frequent-traveler-form.component.scss']
})

export class CreateFrequentTravelerFormComponent {
  formGroup: FormGroup;
  public ActionTitle: string = "Agregar"
  public CustomerList: Array<any>
  public customerData
  // public frequentTraveler : any[] = []
  public ui: Observable<UiState>
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public otraEps: boolean = false
  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>, public apiService: ApiService,) { }


  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.customerData = state.oneCustomer.data
      console.log(this.customerData)
    })

    this.formGroup = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      document: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      birthDate: [0, Validators.required],
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      address: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      eps: [0, Validators.required],
      otherEps: [0, Validators.required],
      user: ['', Validators.required],
      frequentTraveler: ['', Validators.required],
    });

    // if (this.customerData != null) {
    //   console.log(this.customerData.birthDate)
    //   this.ActionTitle = "Editar"
    //   this.formGroup.setValue({
    //     name: this.customerData.name,
    //     lastName: this.customerData.lastName,
    //     document: this.customerData.document,
    //     birthDate: this.customerData.birthDate,
    //     phoneNumber: this.customerData.phoneNumber,
    //     address: this.customerData.address,
    //     eps: this.customerData.eps,
    //     user: this.customerData.user,
    //     frequentTraveler: this.customerData.frequentTravel
    //   }
    //   )
    // }
  }

  saveCustomer() {
    if (this.customerData != null) {

      const user: User = {
        email: 'a',
        password: 'a',
        status: 1,
        roleId: "9ee28cc1-776a-47c0-0439-08db72b3d141",
      }

      const customer: Customer = {
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.saveEps(),
        user: user,
      }
      let customerId
        this.apiService.addCustomer(customer).subscribe({
          next: (data) => {
            customerId = data.customerId
            console.log(data.customerId)

          },
          error: (err) => {
          }
        })

      const frequentTraveler: FrequentTraveler = {
        customerId: this.customerData.customerId,
        travelerId: ''
      }
      console.log(customerId)
      // this.store.dispatch(new CreateFrequentTravelerRequest(frequentTraveler))
      // } else {
      //   const frequentTraveler: FrequentTraveler = {
      //     titularId: this.customerData.titularId,
      //     TravelerId: this.customerData.TravelerId,
      //   }

      //   const user: User = {
      //     userName: null,
      //     email: null,
      //     password: null,
      //     status: 1,
      //     roleId: "cdebc66c-8267-47a9-2896-08db71d23baa",
      //   }

      //   const customer: Customer = {
      //     customerId: this.customerData.customerId,
      //     name: this.formGroup.value.name,
      //     lastName: this.formGroup.value.lastName,
      //     document: this.formGroup.value.document,
      //     birthDate: this.formGroup.value.birthDate,
      //     phoneNumber: this.formGroup.value.phoneNumber,
      //     address: this.formGroup.value.address,
      //     eps: this.formGroup.value.eps,
      //     User: user,
      //     userId: this.customerData.userId,
      //   }
      //   this.store.dispatch(new EditCustomerRequest({
      //     ...customer
      //   }));
    }
  }
  addForm() {
    if (this.formGroup.value.eps == 'OTRA') {
      this.otraEps = true
    } else {
      this.otraEps = false
    }
  }

  saveEps(): string {
    if (this.otraEps) {
      return this.formGroup.value.otherEps
    } else {
      return this.formGroup.value.eps
    }
  }
  validateExistingDocument(): boolean {
    return this.CustomerList.find(item => item.document == this.formGroup.value.document)
  }

  validateExistingEmail(): boolean {
    return this.CustomerList.find(item => item.email == this.formGroup.value.email)
  }

  validForm(): boolean {
    return true
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
