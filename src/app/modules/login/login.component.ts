import { Token, UserLog } from '@/models/token';
import { AppState } from '@/store/state';
import { LoginRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { LayoutService } from '@services/app.layout.service';

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
    Visible: boolean = false;
    public loadingButton: boolean = false
    public show: boolean;


    get dark(): boolean {
        return this.layoutService.config.colorScheme !== 'light';
    }
    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
        private layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.token = state.token.data;
            this.userLogin = state.userLoged.data;
            this.getToken(this.show);
        });

        this.formGroup = this.fb.group({
            email: [
                null,
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                    )
                ]
            ],
            password: [null, [Validators.required, Validators.minLength(8)]]
        });
    }

    async saveChanges() {
        this.show = true;
        var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!this.validForm()) {
            this.messageService.add({ key: 'alert-message-login', severity: 'error', summary: '¡Falta algo!', detail: 'Todos los campos deben estar diligenciados correctamente' });

        } else if (regex.test(this.formGroup.value.email)) {
            this.loadingButton = true;
            const Model = {
                email: this.formGroup.value.email,
                password: this.formGroup.value.password
            };

            this.messageService.add({ key: 'alert-message-login', severity: 'warn', summary: '¡Validando información!', detail: "Espere un momento" });

            this.store.dispatch(
                new LoginRequest({ email: Model.email, password: Model.password })
            );


        }
        else {
            this.messageService.add({ key: 'alert-message-login', severity: 'error', summary: '¡Lo sentimos!', detail: 'Correo no válido' });

        }


    }

    displayPassword() {
        this.Visible = !this.Visible;
    }

    validForm(): boolean {
        return this.formGroup.valid;
    }

    async getToken(show: boolean) {
        if (show) {
            if (this.token == null) {
                //console.log("El toke aun no esta actualizado")
            } else {
                if (this.token.success == true) {
                    this.show = false;
                    window.location.reload();
                    globalThis.payload = await this.authService.getUserInfo(
                        this.token.result
                    );

                    this.authService.setToken(this.token.result);
                    this.messageService.add({ key: 'alert-message-login', severity: 'success', summary: 'Bienvenido', detail: this.token.message });

                } else {
                    this.show = false;

                    this.messageService.add({ key: 'alert-message-login', severity: 'error', summary: '¡Lo sentimos!', detail: this.token.message });
                    this.loadingButton = false;
                }

            }
        }
    }
}
