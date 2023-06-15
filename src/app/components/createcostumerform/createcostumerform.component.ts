import { CreateCostumerRequest, GetAllCostumerRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Costumer } from '@/models/costumer';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { User } from '@/models/user';

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

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCostumerRequest());
    this.ui = this.store.select('ui');
    this.ui.subscribe((state:UiState)=>{this.CostumerList = state.allCostumers.data})
    this.formGroup = this.fb.group({
      userName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      email: new FormControl('',[Validators.required, Validators.email, Validators.pattern('^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$')]),
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
  }


  saveCostumer() {
    const user: User = {
      userName: this.formGroup.value.userName,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password,
      status: 1,
      roleId: "0111d6df-deb0-46ac-6b56-08db663708d3",
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
    console.log(this.formGroup.value)
  }

  displayPassword() {
    this.Visible = !this.Visible;
  }

  validateExistingDocument(): boolean {
    return this.CostumerList.find(item => item.document == this.formGroup.value.document )
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

