import { Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth/auth.service';
import { UiState } from '@/store/ui/state';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';
import { User } from '@/models/user';
import { Role } from '@/models/role';
import { UserLog } from '@/models/token';
import { GetUserInfoRequest } from '@/store/ui/actions';
import { LoginComponent } from '@modules/login/login.component';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    public ui: Observable<UiState>
    userLogin: UserLog;
    rolesList: Array<Role>;
    allUsers: Array<User>;

    constructor(
        private router: Router,
        private appService: AppService,
        private authService: AuthService,
        private store: Store<AppState>
    ) { }

    // ngOnInit(): void {
    //     this.ui = this.store.select('ui')
    //     this.ui.subscribe((state: UiState) => {
    //         this.userLogin = state.userLoged.data
    //         this.allUsers = state.allUsers.data
    //         this.rolesList = state.allRoles.data
    //     })
    // }


    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.getProfile();
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }

    async getProfile() {

        //OLD CODE ---------------------------------------------------------

        if (this.userLogin) {
            return true
            // console.log("Sirvo",this.userLogin)
            // return true
        }

        // if (this.appService.user) {
        //   return true;
        // }

        try {
            await this.appService.getProfile();
            this.ui = this.store.select('ui')
            this.ui.subscribe((state: UiState) => {
                this.userLogin = state.userLoged.data
                console.log("subs: ", this.userLogin)
            })
            return true;
        } catch (error) {
            return false;
        }

        //END OLD CODE---------------------------------------------------------
        //NEW CODE-------------------------------------------------------------

        // if (this.appService.user) {
        //   return true;
        // }

        // try {
        //     await this.appService.getProfile();
        //     return true;
        // } catch (error) {
        //     return false;
        // }
    }
}
