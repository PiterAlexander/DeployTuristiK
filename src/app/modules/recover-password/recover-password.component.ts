import {
    Component,
    OnInit
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@/models/user';
import { UpdateUserRequest, SaveCurrentUserRequest } from '@/store/ui/actions';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
    public formGroup: FormGroup;
    public ui: Observable<UiState>;
    public currentUser: User
    public modelUser: User;

    Visible: boolean = false;
    Visible2: boolean = false;


    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private router: Router,
        private toastr: ToastrService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.currentUser = state.currentUser.data

        });

        this.formGroup = this.fb.group({
            codePassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),

        });

    }

    recoverPassword() {

        if (this.formGroup.value.codePassword == this.currentUser!.password) {
            this.modelUser = {
                userId: this.currentUser.userId,
                email: this.currentUser.email,
                password: this.formGroup.value.password,
                status: this.currentUser.status,
                roleId: this.currentUser.roleId
            }
            this.store.dispatch(new UpdateUserRequest({
                ...this.modelUser,
            }))
            console.log(this.modelUser)


            this.toastr.success('Ya puedes acceder nuevamente al sistema', 'Contraseña Cambiada Correctamente!');
            this.router.navigate(['/login'])

        } else {
            this.messageService.add({ key: 'alert-message-recover-password', severity: 'error', summary: 'Lo sentimos!', detail: 'El código ingresado, no es válido' });

        }
    }

    displayPassword() {
        this.Visible = !this.Visible;
    }
    displayConfirmPassword() {
        this.Visible2 = !this.Visible2;
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
        return this.formGroup.valid;
    }
}
