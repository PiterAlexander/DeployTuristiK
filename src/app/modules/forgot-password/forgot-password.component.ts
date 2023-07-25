import {
    Component,
    OnInit,
    Renderer2
} from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { Router } from '@angular/router';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { GetUsersRequest, RecoverPasswordRequest, SaveCurrentUserRequest, UpdateUserRequest } from '@/store/ui/actions';
import { recoverPasswordEmail } from '@/models/recoverPasswordEmail';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    public formGroup: FormGroup;
    public ui: Observable<UiState>;
    public userList: Array<User>;
    public modelEmail: recoverPasswordEmail
    public modelUser: User;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.store.dispatch(new GetUsersRequest())
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.userList = state.allUsers.data

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
        });

    }

    forgotPassword() {
        let user = this.userList.find(u => u.email == this.formGroup.value.email);
        if (user) {

            let newPassword = this.autoCreate()

            this.modelUser = {
                userId: user.userId,
                email: user.email,
                password: newPassword,
                status: user.status,
                roleId: user.roleId
            }
            this.store.dispatch(new UpdateUserRequest({
                ...this.modelUser,
            }))
            this.store.dispatch(new SaveCurrentUserRequest(this.modelUser))

            this.modelEmail = {
                To: user.email,
                Subject: "Recuperar Contraseña",
                Body: newPassword

            }

            this.store.dispatch(new RecoverPasswordRequest({
                ...this.modelEmail,
            }))

            this.router.navigate(['/recover-password'])
            this.toastr.success("Correo Enviado");

        } else {
            this.toastr.error('Intenta con otro!', 'Correo no Registrado!');
        }
    }

    validForm(): boolean {
        return this.formGroup.valid;
    }
    cancel() {
        this.router.navigate(['/login'])
    }

    autoCreate() {
        var chars = "abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return password;
    }

}
