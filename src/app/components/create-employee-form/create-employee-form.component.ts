import {
    CreateEmployeeRequest,
    EditEmployeeRequest,
} from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@/models/user';
import { Employee } from '@/models/employee';
import { Store } from '@ngrx/store';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { Role } from '../../models/role';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-create-employee-form',
    templateUrl: './create-employee-form.component.html',
    styleUrls: ['./create-employee-form.component.scss']
})

export class CreateEmployeeFormComponent implements OnInit {
    formGroup: FormGroup;
    public ui: Observable<UiState>;
    public ActionTitle: string = 'Registrar';
    Visible: boolean = false;
    password: String = '';
    EmployeeList: Array<any>;
    public UserList: Array<any>
    User: Array<any>;
    Roles: Array<Role>;
    public employeeData;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private modalPrimeNg: DynamicDialogRef,
    ) { }

    ngOnInit(): void {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.EmployeeList = state.allEmployees.data;
            this.employeeData = state.oneEmployee.data;
            this.Roles = state.allRoles.data;
        });
        this.formGroup = this.fb.group({
            email: new FormControl('', [
                Validators.required,
                Validators.email,
                Validators.pattern('^[a-z]+[a-z0-9._-]+@[a-z]+.[a-z.]{2,5}$')
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(30)
            ]),
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(20)
            ]),
            lastName: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(20)
            ]),
            document: new FormControl('', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(20)
            ]),
            phoneNumber: new FormControl('', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(20)
            ]),
        });

        if (this.employeeData != null) {
            this.ActionTitle = 'Editar';
            this.formGroup.setValue({
                email: this.employeeData.user.email,
                password: this.employeeData.user.password,
                name: this.employeeData.name,
                lastName: this.employeeData.lastName,
                document: this.employeeData.document,
                phoneNumber: this.employeeData.phoneNumber,
            });
        }
    }

    saveEmployee() {
        var idRole: Role = this.Roles.find((r) => r.name == 'Administrador');
        if (this.employeeData == null) {
            const user: User = {
                email: this.formGroup.value.email,
                password: this.formGroup.value.password,
                status: 1,

                roleId: idRole.roleId
            };

            const employee: Employee = {
                name: this.formGroup.value.name,
                lastName: this.formGroup.value.lastName,
                document: this.formGroup.value.document,
                phoneNumber: this.formGroup.value.phoneNumber,
                user: user
            };
            console.log(employee);
            this.store.dispatch(
                new CreateEmployeeRequest({
                    ...employee
                })
            );
        } else {
            const user: User = {
                email: this.formGroup.value.email,
                password: this.formGroup.value.password,
                status: 1,
                roleId: idRole.roleId
            };

            const employee: Employee = {
                employeeId: this.employeeData.employeeId,
                name: this.formGroup.value.name,
                lastName: this.formGroup.value.lastName,
                document: this.formGroup.value.document,
                phoneNumber: this.formGroup.value.phoneNumber,
                user: user,
                userId: this.employeeData.userId
            };
            console.log(employee);
            this.store.dispatch(
                new EditEmployeeRequest({
                    ...employee
                })
            );
        }
    }

    displayPassword() {
        this.Visible = !this.Visible;
    }

    validateExistingDocument(): boolean {
        return this.EmployeeList.find(
            (item) => item.document == this.formGroup.value.document
        );
    }
    validateExistingEmail(): boolean {
        return this.EmployeeList.find((item => item.email == this.formGroup.value.email))
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
        this.modalPrimeNg.close();
    }
}
