import { CreateCustomerRequest, EditCustomerRequest, GetAllCustomerRequest, GetAllRoleRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Customer } from '@/models/customer';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { User } from '@/models/user';
import { Role } from '@/models/role';

@Component({
  selector: 'app-createcustomerform',
  templateUrl: './create-customer-form.component.html',
  styleUrls: ['./create-customer-form.component.scss']
})
export class CreatecustomerformComponent implements OnInit {

  public ui: Observable<UiState>
  public ActionTitle: string = "Agregar"
  formGroup: FormGroup;
  Visible: boolean = false;
  password: string = '';
  public CustomerList: Array<any>
  public customerData
  Roles: Array<Role>;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest());
    this.store.dispatch(new GetAllRoleRequest());
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.CustomerList = state.allCustomers.data
      this.customerData = state.oneCustomer.data
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
        userName: this.customerData.user.userName,
        email: this.customerData.user.email,
        password: this.customerData.user.password,
        user: this.customerData.user
      }
      )
    }
  }
  saveCustomer() {
    var idRole: Role = this.Roles.find((r) => r.name == 'Cliente');
    if (this.customerData == null) {
      const user: User = {
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: 1,
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
        user: user
      }

      this.store.dispatch(new CreateCustomerRequest({
        ...customer
      }));
    } else {
      const user: User = {
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        status: 1,
        roleId: idRole.roleId,
      }

      const customer: Customer = {
        customerId: this.customerData.customerId,
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthDate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.formGroup.value.eps,
        user: user,
        userId: this.customerData.userId

      }
      console.log(user, customer, 'q')
      this.store.dispatch(new EditCustomerRequest({
        ...customer
      }));
    }
  }

  displayPassword() {
    this.Visible = !this.Visible;
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
