import { Role } from '@/models/role';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'environments/environment';
import{Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private endpoint = environment.endPoint;
  private apiUrl:string= this.endpoint +"api/Role/";

  constructor(private http:HttpClient) { }

  ReadRoles():Observable<Role[]>{
    return this.http.get<Role[]>(this.apiUrl);
  }

  CreateRole(modelo:Role):Observable<Role>{
    return this.http.post<Role>(this.apiUrl,modelo);
  }

  UpdateRole(RoleId:string,modelo:Role):Observable<Role>{
    console.log(`${this.apiUrl}{${RoleId}}`);
    return this.http.put<Role>(`${this.apiUrl}${RoleId}`,modelo);
  }

  DeleteRole(RoleId:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}${RoleId}`);
  }

}
