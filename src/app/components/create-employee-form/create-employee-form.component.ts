import { CreateEmployeeRequest, GetAllCostumerRequest, GetAllEmployeeRequest } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@/models/user';
import { Employee } from '@/models/employee';
import { Store } from '@ngrx/store';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-employee-form',
  templateUrl: './create-employee-form.component.html',
  styleUrls: ['./create-employee-form.component.scss']
})
export class CreateEmployeeFormComponent implements OnInit {

  formGroup: FormGroup;
  public ui: Observable<UiState>
  public ActionTitle: string = "Agregar"
  Visible: boolean = false;
  password: String = '';
  EmployeeList: Array <any>;
  User : Array <any>;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllEmployeeRequest);
    this.ui = this.store.select('ui');
    this.ui.subscribe((state:UiState)=>{this.EmployeeList = state.allEmployees.data,this.User = state.allUsers.data})
    this.formGroup = this.fb.group({
      email: new FormControl('',[Validators.required, Validators.email, Validators.pattern('^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      userName:new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      document: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
    });
  }


  saveEmployee() {
    const user: User = {
      userName: this.formGroup.value.userName,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password,
      status: 1,
      roleId: "0859fc2c-751e-4a28-c01f-08db66e30e8e",
    }
    
    const employee: Employee = {
      name: this.formGroup.value.name,
      lastName: this.formGroup.value.lastName,
      document: this.formGroup.value.document,
      phoneNumber: this.formGroup.value.phoneNumber,
      user: user,
    }
    console.log(employee)
    this.store.dispatch(new CreateEmployeeRequest({
      ...employee
    }));
  }

  displayPassword() {
    this.Visible = !this.Visible;
  }

  validateExistingDocument(): boolean{
    return this.EmployeeList.find((item => item.document == this.formGroup.value.document))
  }
  validateExistingEmail(): boolean{
    return this.User.find((item => item.email == this.formGroup.value.email))
  }

  validForm(): boolean {
    return true
  }

  cancel() {
    this.modalService.dismissAll();
  }
}

