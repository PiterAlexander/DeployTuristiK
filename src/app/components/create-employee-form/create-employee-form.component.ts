import { AppState } from '@/store/state'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { User } from '@/models/user'
import { Employee } from '@/models/employee'
import { Store } from '@ngrx/store'
import { UiState } from '@/store/ui/state'
import { Observable } from 'rxjs'
import { Role } from '../../models/role'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { CreateEmployeeRequest, EditEmployeeRequest } from '@/store/ui/actions'
import { AppService } from '@services/app.service'

@Component({
    selector: 'app-create-employee-form',
    templateUrl: './create-employee-form.component.html',
    styleUrls: ['./create-employee-form.component.scss']
})

export class CreateEmployeeFormComponent implements OnInit {
    public ui: Observable<UiState>
    public formGroup: FormGroup
    public allRoles: Array<Role>
    public allEmployees: Array<Employee>
    public oneEmployee: Employee
    public ActionTitle: string = 'Registrar empleado'
    public Visible: boolean = false
    public password: String = ''
    public allUsers: Array<User>

    constructor(
        private appService: AppService,
        private fb: FormBuilder,
        private store: Store<AppState>,
        private modalPrimeNg: DynamicDialogRef,
    ) { }

    ngOnInit(): void {
        this.ui = this.store.select('ui')
        this.ui.subscribe((state: UiState) => {
            this.allRoles = state.allRoles.data
            this.allEmployees = state.allEmployees.data
            this.oneEmployee = state.oneEmployee.data
            this.allUsers = state.allUsers.data
        })

        this.formGroup = this.fb.group({
            email: new FormControl('', [Validators.pattern('^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$')
            ]),
            password: new FormControl(null),
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


        })

        if (this.oneEmployee !== undefined) {
            if (this.oneEmployee.user.userId == this.appService.user.id) {
                this.ActionTitle = 'Editar información';
            } else {
                this.ActionTitle = 'Editar empleado'
            }

            this.formGroup.setValue({
                email: '',
                password: '',
                name: this.oneEmployee.name,
                lastName: this.oneEmployee.lastName,
                document: this.oneEmployee.document,
                phoneNumber: this.oneEmployee.phoneNumber,
            })
            console.log(this.formGroup.value)
            console.log(this.formGroup.valid)
        }
    }

    displayPassword() {
        this.Visible = !this.Visible
    }

    //<--- VALIDATIONS --->

    validForm(): boolean {
        return !this.formGroup.invalid && !this.validateExistingDocument() && !this.validateExistingEmail() &&
            this.validateOnlyNumbersForPhoneNumber() && this.validateOnlyNumbers()
    }

    validateExistingDocument(): boolean {
        if (this.oneEmployee !== undefined) {
            const employee: Employee = this.allEmployees.find(e => e.document === this.formGroup.value.document)
            if (employee !== undefined && employee.document !== this.oneEmployee.document) {
                return true
            }
        } else {
            const employee: Employee = this.allEmployees.find(e => e.document === this.formGroup.value.document)
            if (employee !== undefined) {
                return true
            }
        }

        return false
    }

    validateExistingEmail(): boolean {
        if (this.oneEmployee !== undefined) {
            const user: User = this.allUsers.find(u => u.email === this.formGroup.value.email)
            if (user !== undefined && user.email !== this.oneEmployee.user.email) {
                return true
            }
        } else {
            const user: User = this.allUsers.find(u => u.email === this.formGroup.value.email)
            if (user !== undefined) {
                return true
            }
        }
        return false
    }

    validateOnlyNumbersForPhoneNumber(): boolean {
        if (this.formGroup.value.phoneNumber !== null) {
            if (this.formGroup.value.phoneNumber.length >= 10) {
                const regularExpresion = /^[0-9]+$/
                return regularExpresion.test(this.formGroup.value.phoneNumber)
            }
        }
        return true
    }

    validateOnlyNumbers(): boolean {
        if (this.formGroup.value.document !== null) {
            if (this.formGroup.value.document.length >= 8) {
                const regularExpresion = /^[0-9]+$/
                return regularExpresion.test(this.formGroup.value.document)
            }
        }
        return true
    }

    //<-------------->

    //<--- SAVE AND CANCEL ACTIONS --->


    saveEmployee() {
        const oneRole: Role = this.allRoles.find(r => r.name === 'Administrador')
        if (this.oneEmployee === undefined) {
            const user: User = {
                email: this.formGroup.value.email,
                password: this.formGroup.value.password,
                status: 1,
                roleId: oneRole.roleId
            }
            const employee: Employee = {
                name: this.formGroup.value.name,
                lastName: this.formGroup.value.lastName,
                document: this.formGroup.value.document,
                phoneNumber: this.formGroup.value.phoneNumber,
                user: user
            }

            this.store.dispatch(new CreateEmployeeRequest({ ...employee }))
        } else {
            const employee: Employee = {
                employeeId: this.oneEmployee.employeeId,
                name: this.formGroup.value.name,
                lastName: this.formGroup.value.lastName,
                document: this.formGroup.value.document,
                phoneNumber: this.formGroup.value.phoneNumber,
                userId: this.oneEmployee.userId
            }
            this.store.dispatch(new EditEmployeeRequest({ ...employee }))
        }
    }

    cancel() {
        this.modalPrimeNg.close()
    }
}
