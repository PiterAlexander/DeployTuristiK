import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { ChangePasswordRequest, UpdateUserRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { compare, hash } from 'bcryptjs';
import { Token } from '@/models/token';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    public formGroup: FormGroup;
    public ui: Observable<UiState>;
    public currentUser: User;
    public modelUser: User;
    public menssage: Token;
    public show: boolean;



    Visible: boolean = false;
    Visible2: boolean = false;
    Visible3: boolean = false;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private messageService: MessageService,
        private modalPrimeNg: DynamicDialogRef
    ) { }

    ngOnInit(): void {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.currentUser = state.currentUser.data;
        });

        this.formGroup = this.fb.group({
            currentPassword: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(30)
            ]),
            newPassword: new FormControl('', [
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

    async changePassword() {

        let model = {
            "Id": this.currentUser.userId,
            "currentPassword": this.formGroup.value.currentPassword,
            "newPassword": this.formGroup.value.newPassword,
            "type": "Change"
        }
        this.store.dispatch(
            new ChangePasswordRequest({
                ...model
            })
        );
        this.show = true;
        this.ui.subscribe((state: UiState) => {
            this.currentUser = state.currentUser.data
            this.menssage = state.passwordChanged.data;
            if (this.menssage) {
                this.mensajeApi(this.show)
            }

        });
    }

    displayPassword() {
        this.Visible = !this.Visible;
    }
    displayConfirmPassword() {
        this.Visible2 = !this.Visible2;
    }
    displayCurrentPassword() {
        this.Visible3 = !this.Visible3;
    }

    validatePassword(): boolean {
        const password1 = this.formGroup.value.newPassword;
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

    cancel() {
        this.modalPrimeNg.close();
    }

    mensajeApi(show: boolean) {
        if (show) {
            this.show = false
            if (this.menssage.success) {
                this.messageService.add({
                    key: 'alert-message-change-password',
                    severity: 'success',
                    summary: '¡Éxito!',
                    detail: this.menssage.message
                });
                this.modalPrimeNg.close();

            } else {
                this.messageService.add({
                    key: 'alert-message-change-password',
                    severity: 'error',
                    summary: '¡Lo sentimos!',
                    detail: this.menssage.message
                });
            }
        }
    }
}
