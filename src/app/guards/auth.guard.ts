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
import { GetAllRoleRequest, GetUserInfoRequest } from '@/store/ui/actions';
import { LoginComponent } from '@modules/login/login.component';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    public ui: Observable<UiState>
    userLogin: UserLog;
    rolesList: Array<Role>;
    current_role : Role;
    allUsers: Array<User>;

    constructor(
        private router: Router,
        private appService: AppService,
        private authService: AuthService,
        private store: Store<AppState>
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.getProfile(next);
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

    async getProfile(route?: ActivatedRouteSnapshot) {
      // console.log(route.routeConfig.path)


      // if (route.routeConfig.path!="") {
      //   const allowedModules = role.associatedPermission.map(ap => ap.permission.module);
      //   const currentModule = route.routeConfig.path
      //   if (allowedModules.includes(currentModule) || currentModule=="Login") {
      //     // console.log(currentModule,"---",allowedModules)
      //     // console.log("Tiene acceso")
      //     return true
      //   }else{
      //     // console.log(currentModule,"---",allowedModules)
      //     // console.log("No Tiene acceso")
      //     return false
      //   }
      // }else{
      //   return true
      // }
        if (this.userLogin) {
          var user = JSON.parse(localStorage.getItem('TokenPayload'))
          var role = this.rolesList.find(r => r.roleId === user["roleId"])

          if (role && route.routeConfig.path!="") {
            const allowedModules = role.associatedPermission.map(ap => ap.permission.module);
            const currentModule = route.routeConfig.path
            if (allowedModules.includes(currentModule) || currentModule=="Login") {
              return true
            }else{
              return false
            }
          }else{
            return true
          }

          //const allowedModules = role.associatedPermission.map(ap => ap.permission.module);
          console.log(role);
          return true
        }


        try {

            await this.appService.getProfile();
            this.store.dispatch(new GetAllRoleRequest())
            this.ui = this.store.select('ui')
            this.ui.subscribe((state: UiState) => {
                this.userLogin = state.userLoged.data
                this.rolesList = state.allRoles.data
            })
            return true;

        } catch (error) {
            return false;
        }
    }

    getRole(){
      var user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.current_role = this.rolesList.find(r => r.roleId === user["roleId"])

    }
}
