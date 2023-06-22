import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Gatekeeper} from 'gatekeeper-client-sdk';
import { GetUserInfoRequest } from '@/store/ui/actions';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(private router: Router, private toastr: ToastrService,private store: Store<AppState>) {}

    async loginByAuth({email, password}) {
        try {
            const token = await Gatekeeper.loginByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByAuth({email, password}) {
        try {
            const token = await Gatekeeper.registerByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByGoogle() {
        try {
            const token = await Gatekeeper.loginByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByGoogle() {
        try {
            const token = await Gatekeeper.registerByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByFacebook() {
        try {
            const token = await Gatekeeper.loginByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByFacebook() {
        try {
            const token = await Gatekeeper.registerByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    // async getProfile() {
    //     try {
    //         this.user = await Gatekeeper.getProfile();
    //     } catch (error) {
    //         this.logout();
    //         throw error;
    //     }
    // }

    // logout() {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('gatekeeper_token');
    //     this.user = null;
    //     this.router.navigate(['/login']);
    // }

    async getProfile() {
        try {
            this.user = await localStorage.getItem('TokenPayload')
            if (this.user) {
              await this.store.dispatch(new GetUserInfoRequest(this.user));
            }
        } catch (error) {
            this.logout();
            console.log("soy el error",error)
            throw error;
        }
    }

    async logout() {
        localStorage.removeItem('TokenPayload');
        localStorage.removeItem('token');
        localStorage.removeItem('gatekeeper_token');
        this.user = null;
        await this.store.dispatch(new GetUserInfoRequest(this.user));

        this.router.navigate(['/login']);
    }
}
