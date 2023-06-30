import {Token, UserLog} from '@/models/token';
import {AppState} from '@/store/state';
import {GetUserInfoRequest, LoginRequest} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
// import * as jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode';
import {AuthService} from '@services/auth/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {User} from '@/models/user';
import { ofType } from '@ngrx/effects';

@Component({
    selector: 'app-login2',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public formGroup: FormGroup;
    public ui: Observable<UiState>;
    public token: Token;
    public isAuthLoading = false;
    static payload: Observable<UserLog>;
    public userLogin: any;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.token = state.token.data;
            this.userLogin = state.userLoged.data;
            this.getToken();
        });

        this.formGroup = this.fb.group({
            email: [
                null,
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                    )
                ]
            ],
            password: [null, [Validators.required, Validators.minLength(8)]]
        });
    }

    async saveChanges() {
        this.isAuthLoading = true;
        const Model = {
            email: this.formGroup.value.email,
            password: this.formGroup.value.password
        };

        await this.store.dispatch(
            new LoginRequest({email: Model.email, password: Model.password})
        );

        this.isAuthLoading = false;
    }

    validForm(): boolean {
        return this.formGroup.valid;
    }

    // ShowPasswordLogin() {
    //     var cambio = document.getElementById('passwordLogin');
    //     if (cambio. == 'password') {
    //         cambio.type = 'text';
    //         $('.icon3').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    //     } else {
    //         cambio.type = 'password';
    //         $('.icon3').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    //     }
    // }

    async getToken() {
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
                if (log) {
                  if (log['role'] == 'Administrador') {
                    this.router.navigate(['/Dashboard']);
                  }
                  if (log['role'] == 'Cliente') {
                      this.router.navigate(['/Paquetes']);
                  }
                }


                this.toastr.success(this.token.message);
            } else {
                this.toastr.error(this.token.message);
            }

        }
    }
}
