import { Customer } from '@/models/customer';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateCustomerRequest, CreateFrequentTravelerRequest, EditCustomerRequest, FrequentTravelerActions, GetAllFrequentTravelerRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { type } from 'os';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-frequent-traveler-form',
  templateUrl: './create-frequent-traveler-form.component.html',
  // styleUrls: ['./create-frequent-traveler-form.component.scss']
})

export class CreateFrequentTravelerFormComponent {
  formGroup: FormGroup;
  public ActionTitle: string = "Agregar"
  public customerList: Array<any>
  public customerData
  Roles: Array<Role>;
  Visible: boolean = false;
  password: string = '';
  public frequentTraveler : any[] = []
  public ui: Observable<UiState>
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public otraEps: boolean = false

  constructor(private fb: FormBuilder, 
    private modalService: NgbModal, 
    private store: Store<AppState>, 
    public apiService: ApiService,
    private modalPrimeNg: DynamicDialogRef,
    ) 
    { }


  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.customerData = state.oneCustomer.data
      this.Roles = state.allRoles.data
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

    if (this.customerData != null) {
      console.log(this.customerData.birthDate)
      this.ActionTitle = "Editar"
      this.formGroup.setValue({
        name: this.customerData.name,
        lastName: this.customerData.lastName,
        document: this.customerData.document,
        birthDate: this.customerData.birthDate,
        phoneNumber: this.customerData.phoneNumber,
        address: this.customerData.address,
        eps: this.customerData.eps,
        user: this.customerData.user,
        frequentTraveler: this.customerData.frequentTravel
      }
      )
    }
  }

  async saveCustomer() {
    var idRole: Role = this.Roles.find((r) => r.name == 'Beneficiario');
    const user: User = {
      email: 'm@gmail.com',
      password: '123',
      status: 0,
      roleId: idRole.roleId,
    }

    const customer: Customer = {
      name: this.formGroup.value.name,
      lastName: this.formGroup.value.lastName,
      document: this.formGroup.value.document,
      birthDate: this.formGroup.value.birthDate,
      phoneNumber: this.formGroup.value.phoneNumber,
      address: this.formGroup.value.address,
      eps: this.formGroup.value.eps,
      user: user,
    }
    console.log(customer)
    let customerId
    await this.apiService.addCustomer(customer).subscribe({
      next: (data) => {
        customerId = data.customerId
        console.log(customerId)
        this.saveTraveler(customerId)
      },
      error: (err) => {
        console.log(err)
      }
    })
    
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

    //   const customer: customer = {
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
    //   this.store.dispatch(new EditcustomerRequest({
    //     ...customer
    //   }));

  }


  saveTraveler(idv){
    const frequentTraveler: FrequentTraveler = {
      customerId: this.customerData.customerId,
      travelerId: idv
    }

    this.store.dispatch(new CreateFrequentTravelerRequest(frequentTraveler))
    this.store.dispatch(new GetAllFrequentTravelerRequest())
  }
  displayPassword() {
    this.Visible = !this.Visible;
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
  

  validForm(): boolean {
    return true
  }

  cancel() {
    this.modalPrimeNg.close();
  }
}
