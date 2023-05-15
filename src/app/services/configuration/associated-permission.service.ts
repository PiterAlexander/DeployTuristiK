import { AssociatedPermission } from '@/models/associated-permission';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'environments/environment';
import{Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssociatedPermissionService {

  private endpoint = environment.endPoint;
  private apiUrl:string= this.endpoint +"api/AssociatedPermission/";

  constructor(private http:HttpClient) { }

  ReadAssociatedPermission():Observable<AssociatedPermission[]>{
    return this.http.get<AssociatedPermission[]>(this.apiUrl);
  }

  CreateAssociatedPermission(modelo:AssociatedPermission):Observable<AssociatedPermission>{
    return this.http.post<AssociatedPermission>(this.apiUrl,modelo);
  }

  DeleteAssociatedPermission(associatedPermissionId:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}${associatedPermissionId}`);
  }
}
