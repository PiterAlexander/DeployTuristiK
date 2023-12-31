import { Customer } from '@/models/customer';
import { Role } from '@/models/role';
import { Token } from '@/models/token';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { GetAllCustomerRequest, GetAllRoleRequest, CreateCustomerRequest, LoginRequest, GetUsersRequest, EditCustomerRequest, UpdateUserRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import {
    Component,
    OnInit,
    Renderer2,
    OnDestroy,
    HostBinding
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from '@modules/login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { hashSync } from 'bcryptjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    // @HostBinding('class') class = 'register-box';

    public ui: Observable<UiState>
    public formGroup: FormGroup;
    public Visible: boolean = false;
    public Visible2: boolean = false;


    public allEps: Array<string>

    public CustomerList: Array<any>
    public UserList: Array<any>
    public Roles: Array<Role>;
    public token: Token;
    public userMaxDate: Date
    public loadingButton: boolean = false
    public results: string[];
    public isBeneficiary: Customer


    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private messageService: MessageService

    ) {
        this.allEps = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS']
    }



    ngOnInit(): void {
        this.store.dispatch(new GetAllCustomerRequest());
        this.store.dispatch(new GetAllRoleRequest());
        this.store.dispatch(new GetUsersRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.CustomerList = state.allCustomers.data
            this.UserList = state.allUsers.data
            this.Roles = state.allRoles.data;
            this.token = state.token.data;
            this.getToken();
        })


        this.birthDateValidator()


        this.formGroup = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]),
            password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
            name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
            lastName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
            document: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
            birthDate: [null, [Validators.required, this.birthDateValidator.bind(this)]],
            phoneNumber: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
            address: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
            eps: new FormControl(null, [Validators.required]),
            confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
            termsAndConditions: new FormControl(null, [Validators.required]),
        });

    }


    searchEps(event: any) {
        const filtered: any[] = [];
        const query = event.query.toLowerCase();
        for (let i = 0; i < this.allEps.length; i++) {
            const Eps = this.allEps[i].toLowerCase();
            if (Eps.includes(query)) {
                filtered.push(this.allEps[i]);
            }
        }

        this.results = filtered;

    }

    saveCustomer() {

        var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!this.validForm()) {
            this.messageService.add({ key: 'alert-message-register', severity: 'error', summary: '¡Espera!', detail: 'Todos los campos deben estar diligenciados correctamente' });

        } else if (regex.test(this.formGroup.value.email)) {

            this.loadingButton = true;
            var idRole: Role = this.Roles.find((r) => r.name == 'Cliente');

            const user: User = {
                email: this.formGroup.value.email,
                password: this.formGroup.value.password,
                status: 1,
                roleId: idRole.roleId,
            }
            if (!this.isBeneficiary) {
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
                const customer: Customer = {
                    customerId: this.isBeneficiary.customerId,
                    name: this.formGroup.value.name,
                    lastName: this.formGroup.value.lastName,
                    document: this.formGroup.value.document,
                    birthDate: this.formGroup.value.birthDate,
                    phoneNumber: this.formGroup.value.phoneNumber,
                    address: this.formGroup.value.address,
                    eps: this.formGroup.value.eps,
                    userId: this.isBeneficiary.userId
                }
                const updateUser: User = {
                    userId: this.isBeneficiary.userId,
                    email: this.formGroup.value.email,
                    password: hashSync(this.formGroup.value.password, 10),
                    status: 1,
                    roleId: idRole.roleId,
                }

                this.store.dispatch(new EditCustomerRequest({ ...customer }))
                this.store.dispatch(new UpdateUserRequest({ ...updateUser }))
            }

            this.messageService.add({ key: 'alert-message-register', severity: 'success', summary: '¡Usuario registrado éxitosamente!', detail: "En un momento ingresará al sistema" });


            setTimeout(() => this.login(user), 2000)
            this.getToken();


        } else {
            this.messageService.add({ key: 'alert-message-register', severity: 'error', summary: '¡Lo sentimos!', detail: 'Correo no válido' });

        }

    }

    displayPassword() {
        this.Visible = !this.Visible;
    }
    displayConfirmPassword() {
        this.Visible2 = !this.Visible2;
    }

    validateExistingDocument(): boolean {
        var idRole: Role = this.Roles.find((r) => r.name == 'Beneficiario');
        var document: Customer = this.CustomerList.find(item => item.document == this.formGroup.value.document)
        if (document) {

            if (document.user.roleId == idRole.roleId) {
                this.isBeneficiary = document
                return false
            } else {
                this.isBeneficiary = undefined
                return true
            }
        }
        return false

    }

    validateExistingEmail(): boolean {
        return this.UserList.find(item => item.email == this.formGroup.value.email)
    }

    validateOnlyNumbers(): boolean {
        if (this.formGroup.value.document !== null) {
            if (this.formGroup.value.document.length >= 6) {
                const regularExpresion = /^[0-9]+$/
                return regularExpresion.test(this.formGroup.value.document)
            }
        }
        return true
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

    onAddressChange(address: any) {
        if (this.formGroup) {
            const addressHtml = address.adr_address;
            const hiddenDiv = document.createElement('div');
            hiddenDiv.style.display = 'none';
            hiddenDiv.innerHTML = addressHtml;
            const locality = hiddenDiv.querySelector('.locality')?.textContent || '';
            const country = hiddenDiv.querySelector('.country-name')?.textContent || '';
            const regionElements = hiddenDiv.querySelectorAll('.region');
            if (regionElements.length >= 2) {
                const region = regionElements[0].textContent || '';
                const extractedText = `${address.name}, ${locality}, ${region}, ${country}`;
                console.log(extractedText);
                this.formGroup.get('address').setValue(extractedText);
            }
        }
    }

    birthDateValidator() {
        const currentDate = new Date();

        this.userMaxDate = new Date(currentDate);
        this.userMaxDate.setFullYear(currentDate.getFullYear() - 18);
    }

    validatePassword(): boolean {
        const password1 = this.formGroup.value.password
        const password2 = this.formGroup.value.confirmPassword

        if (password1 === password2) {
            return true;
        } else {
            return false;
        }
    }

    validForm(): boolean {
        return this.formGroup.valid &&
            !this.validateExistingDocument() &&
            !this.validateExistingEmail() &&
            this.validatePassword() &&
            this.validateOnlyNumbersForPhoneNumber()
    }

    cancel() {
        this.router.navigate(['/login'])
    }


    getToken() {
        if (this.token != null) {
            if (this.token.success == true) {

                this.loadingButton = false;
                window.location.reload();
                globalThis.payload = this.authService.getUserInfo(
                    this.token.result
                );
                this.authService.setToken(this.token.result);

                var log = JSON.parse(localStorage.getItem('TokenPayload'));
                if (log) {
                    if (log['role'] == 'Administrador' || log['role'] != 'Cliente') {
                        this.router.navigate(['/Home/Dashboard']);
                    }
                    if (log['role'] == 'Cliente') {
                        this.router.navigate(['/Home/Paquetes']);
                    }
                }


            }
        }
    }


    login(user: User) {
        this.store.dispatch(
            new LoginRequest({ email: user.email, password: user.password })
        );
    }
}
