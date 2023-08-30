import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    UntypedFormControl,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@/models/user';
import { UpdateUserRequest, SaveCurrentUserRequest, ChangePasswordRequest } from '@/store/ui/actions';
import { MessageService } from 'primeng/api';
import { compare, hash } from 'bcryptjs';
import { Token } from '@/models/token';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
    public formGroup: FormGroup;
    public ui: Observable<UiState>;
    public currentUser: User;
    public menssage: Token;
    public show: boolean;

    Visible: boolean = false;
    Visible2: boolean = false;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.currentUser = state.currentUser.data;
        });

        this.formGroup = this.fb.group({
            codePassword: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(10)
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(30)
            ]),
            confirmPassword: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(30)
            ])
        });
    }

    async recoverPassword() {

        let model = {
            "Id": this.currentUser.userId,
            "currentPassword": this.formGroup.value.codePassword,
            "newPassword": this.formGroup.value.password,
            "type": "Recovered"
        }
        this.store.dispatch(
            new ChangePasswordRequest({
                ...model
            })
        );
        this.show = true;
        this.ui.subscribe((state: UiState) => {
            this.menssage = state.passwordChanged.data;
            this.mensajeApi(this.show)
        });

    }

    displayPassword() {
        this.Visible = !this.Visible;
    }
    displayConfirmPassword() {
        this.Visible2 = !this.Visible2;
    }

    validatePassword(): boolean {
        const password1 = this.formGroup.value.password;
        const password2 = this.formGroup.value.confirmPassword;

        if (password1 === password2) {
            return true;
        } else {
            return false;
        }
    }

    validForm(): boolean {
        return this.formGroup.valid && this.validatePassword();
    }

    mensajeApi(show: boolean) {
        if (show) {
            if (this.menssage.success) {
                this.show = false;
                this.messageService.add({ key: 'alert-message-recover-password', severity: 'success', summary: '¡Proceso completado!', detail: 'Ya puedes acceder nuevamente al sistema.' });
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            } else {
                this.show = false;
                this.messageService.add({
                    key: 'alert-message-recover-password',
                    severity: 'error',
                    summary: '¡Lo sentimos!',
                    detail: this.menssage.message
                });

            }
        }
    }
}
