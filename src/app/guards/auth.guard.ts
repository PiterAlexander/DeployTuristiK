import { Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';
import { User } from '@/models/user';
import { Role } from '@/models/role';
import { UserLog } from '@/models/token';
import { GetAllRoleRequest} from '@/store/ui/actions';
import { ApiService } from '../services/api.service';
import { AppService } from '../services/app.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    public ui: Observable<UiState>
    userLogin: UserLog;
    rolesList;
    current_role : Role;
    allUsers: Array<User>;

    constructor(
        private router: Router,
        private appService : AppService,
        private apiService : ApiService,
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

      if (this.userLogin) {

        const user = JSON.parse(localStorage.getItem('TokenPayload'));

        const response = await new Promise((resolve, reject) => {
          this.apiService.getRoleById(user['roleId']).subscribe({
            next: (data) => {
              resolve(data);
            },
            error: (err) => {
              reject(err);
            }
          });
        });

        if (response && route.routeConfig.path !== "") {
          const allowedModules = response['associatedPermission'].map(ap => ap.permission.module);
              const currentModule = route.routeConfig.path;
              if (allowedModules) {
                if (allowedModules.includes(currentModule) || currentModule == "Login" || currentModule == "profile") {
                  return true;
                }else{
                  if (user['role'] == "Administrador") {
                    this.router.navigate(['/Dashboard']);
                    return false;
                  }else{
                    this.router.navigate(['/Paquetes']);
                    return false;
                  }
                }
              }
        }

        return true;
      }


      try {
        await this.appService.getProfile();
        this.store.dispatch(new GetAllRoleRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
          this.userLogin = state.userLoged.data;
        });

        return true;

      } catch (error) {
        return false;
      }
    }

}
