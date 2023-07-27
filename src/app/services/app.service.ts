import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Gatekeeper } from 'gatekeeper-client-sdk';
import { GetUserInfoRequest } from '@/store/ui/actions';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';
import { MessageService } from 'primeng/api';

interface LayoutState {
    profileSidebarVisible: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class AppService {

    state: LayoutState = {
        profileSidebarVisible: false
    }
    public user: any = null;

    constructor(private router: Router, private toastr: ToastrService, private store: Store<AppState>, private messageService: MessageService) { }

    showProfileSidebar() {
        this.state.profileSidebarVisible = true;
    }

    getProfile() {
        try {
            this.user = JSON.parse(localStorage.getItem('TokenPayload'))
            if (this.user) {
                this.store.dispatch(new GetUserInfoRequest(this.user));
            }
        } catch (error) {
            this.logout();
            console.log("soy el error", error)
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('TokenPayload');
        localStorage.removeItem('token');
        localStorage.removeItem('gatekeeper_token');
        this.user = null;
        this.store.dispatch(new GetUserInfoRequest(this.user));

        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Sesión cerrada' });

    }
}
