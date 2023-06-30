import { Costumer } from '@/models/costumer';
import { Role } from '@/models/role';
import { Token } from '@/models/token';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { GetAllCostumerRequest, GetAllRoleRequest, CreateCostumerRequest, LoginRequest } from '@/store/ui/actions';
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
    public ActionTitle: string = "Agregar"
    formGroup: FormGroup;
    Visible: boolean = false;
    password: string = '';
    public CostumerList: Array<any>
    public costumerData
    Roles: Array<Role>;
    public token: Token;
    public userLogin: any;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }



    ngOnInit(): void {
        this.store.dispatch(new GetAllCostumerRequest());
        this.store.dispatch(new GetAllRoleRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.CostumerList = state.allCostumers.data
            this.costumerData = state.oneCostumer.data
            this.Roles = state.allRoles.data;
            this.token = state.token.data;
            this.userLogin = state.userLoged.data;
            this.getToken();
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
    }
    async saveCostumer() {
        var idRole: Role = this.Roles.find((r) => r.name == 'Cliente');

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

        await this.store.dispatch(new CreateCostumerRequest({
            ...costumer
        }));



        await setTimeout(() => this.login(user), 1000)

        console.log(this.CostumerList)
        this.getToken();
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
        return true
    }

    cancel() {
        this.router.navigate(['/login'])
    }


    async getToken() {
        console.log(this.token);
        if (this.token == null) {
            //console.log("El toke aun no esta actualizado")
        } else {
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
