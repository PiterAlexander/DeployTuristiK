import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Package } from '@/models/package';
import { Order } from '@/models/order';
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private endpoint:string = environment.endPoint

    constructor(private http: HttpClient) {}

    getPackages():Observable<Package[]>{
        return this.http.get<Package[]>(`${this.endpoint}api/package/list`)
    }

    addPackage(modelo:Package):Observable<Package>{
        return this.http.post<Package>(`${this.endpoint}api/package/addPackage`, modelo)
    }

    updatePackage(idPackage:number,modelo:Package):Observable<Package>{
        return this.http.put<Package>(`${this.endpoint}api/package/edit/${idPackage}`, modelo)
    }

    deletePackage(idPackage:number):Observable<void>{                                        
        return this.http.delete<void>(`${this.endpoint}api/package/delete/${idPackage}`)
    }

//<--- ORDER URLS --->
    getOrders():Observable<Order[]>{
        return this.http.get<Order[]>(`${this.endpoint}api/Order`)
    }

    addOrder(modelo:Order):Observable<Order>{
        return this.http.post<Order>(`${this.endpoint}api/Order`, modelo)
    }

    updateOrder(idOrder:number,modelo:Order):Observable<Order>{
        return this.http.put<Order>(`${this.endpoint}api/Order/${idOrder}`, modelo)
    }

    deleteOrder(idOrder:number):Observable<void>{                                        
        return this.http.delete<void>(`${this.endpoint}api/Order/${idOrder}`)
    }
//<------------------>
}
