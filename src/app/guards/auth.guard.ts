import { Injectable, OnInit } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth/auth.service';
import { UiState } from '@/store/ui/state';
import { Store } from '@ngrx/store';
import { AppState } from '@/store/state';
import { User } from '@/models/user';
import { Role } from '@/models/role';
import { UserLog } from '@/models/token';
import { GetAllRoleRequest} from '@/store/ui/actions';
import { RoleService } from '@services/configuration/role.service';

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
        private roleService: RoleService,
        private appService: AppService,
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

        const vardas = this.roleService.ReadRoles().pipe(
          map((data) => {
            return data;
          })
        );

        vardas.subscribe((data) => {

          const role = data.find(r => r.name === user["role"]) || undefined;

            if (role && route.routeConfig.path !== "") {
              const allowedModules = role.associatedPermission.map(ap => ap.permission.module);
              const currentModule = route.routeConfig.path;
              if (allowedModules.includes(currentModule) || currentModule == "Login") {
                return true;
              }else{
                if (user['role'] == "Administrador") {
                  this.router.navigate(['/Dashboard']);
                  return false
                }else{
                  this.router.navigate(['/Paquetes']);
                 return false
                }
              }
            }
        }, (error) => {
          // Maneja el error aquí
          console.error(error);
        });
        return true
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
