import { CreateCostumerRequest, EditCostumerRequest, GetAllCostumerRequest, GetAllRoleRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Costumer } from '@/models/costumer';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { User } from '@/models/user';
import { Role } from '@/models/role';

@Component({
  selector: 'app-createcostumerform',
  templateUrl: './createcostumerform.component.html',
  styleUrls: ['./createcostumerform.component.scss']
})
export class CreatecostumerformComponent implements OnInit {

  public ui: Observable<UiState>
  public ActionTitle: string = "Agregar"
  formGroup: FormGroup;
  Visible: boolean = false;
  password: string = '';
  public CostumerList: Array<any>
  public UserList: Array<any>
  public costumerData
  Roles: Array<Role>;
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public otraEps: boolean = false
  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCostumerRequest());
    this.store.dispatch(new GetAllRoleRequest());
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.CostumerList = state.allCostumers.data
      this.costumerData = state.oneCostumer.data
      this.Roles = state.allRoles.data;
    })

    this.formGroup = this.fb.group({
      userName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      document: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      birthDate: [0, Validators.required],
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      address: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      eps: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      user: ['', Validators.required],
    });

    if (this.costumerData != null) {
      this.ActionTitle = "Editar"
      this.formGroup.setValue({

        name: this.costumerData.name,
        lastName: this.costumerData.lastName,
        document: this.costumerData.document,
        birthDate: this.costumerData.birthDate,
        phoneNumber: this.costumerData.phoneNumber,
        address: this.costumerData.address,
        eps: this.costumerData.eps,
        userName: this.costumerData.user.userName,
        email: this.costumerData.user.email,
        password: this.costumerData.user.password,
        user: this.costumerData.user
      }
      )
    }
  }
  saveCostumer() {
    var idRole: Role = this.Roles.find((r) => r.name == 'Cliente');
    if (this.costumerData == null) {
      const user: User = {
        userName: this.formGroup.value.userName,
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: 1,
        roleId: idRole.roleId,
      }

      const costumer: Costumer = {
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.formGroup.value.eps,
        User: user
      }

      this.store.dispatch(new CreateCostumerRequest({
        ...costumer
      }));
    } else {
      const user: User = {
        userName: this.formGroup.value.userName,
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: 1,
        roleId: idRole.roleId,
      }

      const costumer: Costumer = {
        costumerId: this.costumerData.costumerId,
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.formGroup.value.eps,
        User: user,
        userId: this.costumerData.userId

      }
      console.log(user, costumer, 'q')
      this.store.dispatch(new EditCostumerRequest({
        ...costumer
      }));
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

  displayPassword() {
    this.Visible = !this.Visible;
  }

  validateExistingDocument(): boolean {
    return this.CostumerList.find(item => item.document == this.formGroup.value.document)
  }

  validateExistingEmail(): boolean {
    return this.CostumerList.find(item => item.email == this.formGroup.value.email)
  }

  validForm(): boolean {
     return this.formGroup.value.name != '' && this.formGroup.value.lastName != '' &&
    this.formGroup.value.document != '' && !this.validateExistingDocument() && 
    this.formGroup.value.birthDate != '' && this.formGroup.value.phoneNumber != '' &&
    this.formGroup.value.eps != '' && this.formGroup.value.address != '' &&
    this.formGroup.value.userName != '' && !this.validateExistingEmail() && 
    this.formGroup.value.email != '' && this.formGroup.value.password != '' 
  }

  cancel() {
    this.modalService.dismissAll();
  }
}

