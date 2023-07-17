import { Customer } from '@/models/customer';
import { Role } from '@/models/role';
import { Token } from '@/models/token';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { GetAllCustomerRequest, GetAllRoleRequest, CreateCustomerRequest, LoginRequest, GetUsersRequest } from '@/store/ui/actions';
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
import { Observable } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    // @HostBinding('class') class = 'register-box';

    public ui: Observable<UiState>
    formGroup: FormGroup;
    Visible: boolean = false;
    Visible2: boolean = false;

    password: string = '';
    public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS']

    public CustomerList: Array<any>
    public UserList: Array<any>
    public customerData
    Roles: Array<Role>;
    public token: Token;


    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }



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

        this.formGroup = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$')]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
            lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
            document: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
            birthDate: [0, Validators.required,],
            phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
            address: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
            eps: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
        });

    }

    async saveCustomer() {
        var idRole: Role = this.Roles.find((r) => r.name == 'Cliente');

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

        await this.store.dispatch(new CreateCustomerRequest({
            ...customer
        }));



        await setTimeout(() => this.login(user), 1000)
        this.getToken();
    }

    displayPassword() {
        this.Visible = !this.Visible;
    }
    displayConfirmPassword() {
        this.Visible2 = !this.Visible2;
    }
    validateExistingDocument(): boolean {
        return this.CustomerList.find(item => item.document == this.formGroup.value.document)
    }

    validateExistingEmail(): boolean {
        return this.UserList.find(item => item.email == this.formGroup.value.email)
    }

    validateDate() {
        const fechaIngresada = new Date(this.formGroup.value.birthDate);
        const fechaHoy = new Date();

        if (fechaIngresada < fechaHoy) {
            return true;
        } else {
            return false;
        }
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
            this.validateDate() &&
            this.validatePassword()
    }

    cancel() {
        this.router.navigate(['/login'])
    }


    async getToken() {
        if (this.token != null) {
            if (this.token.success == true) {
                window.location.reload();
                globalThis.payload = await this.authService.getUserInfo(
                    this.token.result
                );
                this.authService.setToken(this.token.result);

                var log = JSON.parse(localStorage.getItem('TokenPayload'));
                if (log['role'] == 'Administrador') {
                    this.router.navigate(['/']);
                } else if (log['role'] == 'Cliente') {
                    this.router.navigate(['/Clientes']);
                }

                this.toastr.success(this.token.message);
            } else {
                this.toastr.error(this.token.message);
            }
        }
    }

    async login(user: User) {
        this.store.dispatch(
            new LoginRequest({ email: user.email, password: user.password })
        );
    }
}
