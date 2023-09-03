// auth.service.ts

import { UserLog } from '@/models/token';
import { AppState } from '@/store/state';
import { GetUserInfoRequest } from '@/store/ui/actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { UiState } from '@/store/ui/state';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper: JwtHelperService;
  public ui: Observable<UiState>
  public userLogin



  constructor(private store: Store<AppState>, private router: Router, private location: Location) {
    this.jwtHelper = new JwtHelperService();
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }


  public getUserInfo(token: string) {
    const decodedToken = jwt_decode(token);
    return this.procesarObjeto(decodedToken);
  }

  public procesarObjeto(obj: unknown) {
    if (typeof obj === 'object' && obj !== null) {

      //console.log(typeof (obj), obj)
      // Utiliza el operador de aserción de tipo "as" para especificar el tipo de objeto que esperas
      const objetoProcesado = obj as Observable<UserLog>;
      const userConvert = obj as UserLog;

      localStorage.setItem('TokenPayload', JSON.stringify(userConvert));

      // Ahora puedes utilizar el objeto con seguridad
      //console.log("Mi objeto", objetoProcesado)
      return objetoProcesado;
    } else {
      //console.log('El valor no es un objeto válido');
    }
  }


  async logout() {
    localStorage.removeItem('TokenPayload');
    localStorage.removeItem('token');
    localStorage.removeItem('gatekeeper_token');

    await this.store.dispatch(new GetUserInfoRequest(null));

    this.router.navigate(['/login']);
  }

  async logout2() {
    await localStorage.removeItem('TokenPayload');
    await localStorage.removeItem('token');

    await this.store.dispatch(new GetUserInfoRequest(undefined));
    this.ui = this.store.select('ui')
    await this.ui.subscribe((state: UiState) => {
      this.userLogin = state.userLoged.data
      console.log("deslogueado: ", this.userLogin)


    })
    this.router.navigate(['/login']);
    // window.location.href = '/login';
    //

  }
}
