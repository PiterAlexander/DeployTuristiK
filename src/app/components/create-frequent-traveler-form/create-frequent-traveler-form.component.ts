import { Costumer } from '@/models/costumer';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateCostumerRequest, CreateFrequentTravelerRequest, EditCostumerRequest, FrequentTravelerActions } from '@/store/ui/actions';
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
  public CostumerList: Array<any>
  public costumerData
  Roles: Array<Role>;
  Visible: boolean = false;
  password: string = '';
  // public frequentTraveler : any[] = []
  public ui: Observable<UiState>
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public otraEps: boolean = false
  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>, public apiService: ApiService,) { }


  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.costumerData = state.oneCostumer.data
      console.log(this.costumerData)
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

    // if (this.costumerData != null) {
    //   console.log(this.costumerData.birthDate)
    //   this.ActionTitle = "Editar"
    //   this.formGroup.setValue({
    //     name: this.costumerData.name,
    //     lastName: this.costumerData.lastName,
    //     document: this.costumerData.document,
    //     birthDate: this.costumerData.birthDate,
    //     phoneNumber: this.costumerData.phoneNumber,
    //     address: this.costumerData.address,
    //     eps: this.costumerData.eps,
    //     user: this.costumerData.user,
    //     frequentTraveler: this.costumerData.frequentTravel
    //   }
    //   )
    // }
  }

  saveCostumer() {
    var idRole: Role = this.Roles.find((r) => r.name == 'Cliente');
    if (this.costumerData == null) {
      const user: User = {
        userName: 'manu',
        email: 'm@gmail.com',
        password: '123',
        status: 0,
        roleId: idRole.roleId,
      }

      const costumer: Costumer = {
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.saveEps(),
        User: user,
      }
      let costumerId
        this.apiService.addCostumer(costumer).subscribe({
          next: (data) => {
            costumerId = data.costumerId
            console.log(data.costumerId)

          },
          error: (err) => {
          }
        })

      const frequentTraveler: FrequentTraveler = {
        costumerId: this.costumerData.costumerId,
        travelerId: ''
      }
      console.log(costumerId)
      this.store.dispatch(new CreateFrequentTravelerRequest(frequentTraveler))
      // } else {
      //   const frequentTraveler: FrequentTraveler = {
      //     titularId: this.costumerData.titularId,
      //     TravelerId: this.costumerData.TravelerId,
      //   }

      //   const user: User = {
      //     userName: null,
      //     email: null,
      //     password: null,
      //     status: 1,
      //     roleId: "cdebc66c-8267-47a9-2896-08db71d23baa",
      //   }

      //   const costumer: Costumer = {
      //     costumerId: this.costumerData.costumerId,
      //     name: this.formGroup.value.name,
      //     lastName: this.formGroup.value.lastName,
      //     document: this.formGroup.value.document,
      //     birthDate: this.formGroup.value.birthDate,
      //     phoneNumber: this.formGroup.value.phoneNumber,
      //     address: this.formGroup.value.address,
      //     eps: this.formGroup.value.eps,
      //     User: user,
      //     userId: this.costumerData.userId,
      //   }
      //   this.store.dispatch(new EditCostumerRequest({
      //     ...costumer
      //   }));
    }
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
  validateExistingDocument(): boolean {
    return this.CostumerList.find(item => item.document == this.formGroup.value.document)
  }

  validateExistingEmail(): boolean {
    return this.CostumerList.find(item => item.email == this.formGroup.value.email)
  }

  validForm(): boolean {
    return true
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
