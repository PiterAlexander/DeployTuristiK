import { Permission } from '@/models/permission';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'environments/environment';
import{Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private endpoint = environment.endPoint;

  private apiUrl:string= this.endpoint +"api/Permission/";
  constructor(private http:HttpClient) { }

  ReadPermissions():Observable<Permission[]>{
    return this.http.get<Permission[]>(this.apiUrl);
  }
}
