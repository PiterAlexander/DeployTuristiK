import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Package } from '@/models/package';
import { Order } from '@/models/order';
import { Costumer } from '@/models/costumer';
import { Employee } from '@/models/employee';
import { OrderDetail } from '@/models/orderDetail';
import { User } from '@/models/user';
import { FrequentTraveler } from '@/models/frequentTraveler';
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private endpoint: string = environment.endPoint

    constructor(private http: HttpClient) { }

    //<--- PACAKGE --->
    getPackages(): Observable<Package[]> {
        return this.http.get<Package[]>(`${this.endpoint}api/package/list/`)
    }

    addPackage(modelo: Package): Observable<Package> {
        return this.http.post<Package>(`${this.endpoint}api/package/addPackage/`, modelo)
    }

    updatePackage(idPackage: string, modelo: Package): Observable<Package> {
        console.log(`${this.endpoint}${idPackage}`);
        return this.http.put<Package>(`${this.endpoint}api/package/edit/${idPackage}`, modelo)
    }

    deletePackage(idPackage: number): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/package/delete/${idPackage}`)
    }
    //<-------------->

    //<--- ORDERS --->
    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.endpoint}api/Order`)
    }

    addOrder(modelo: Order): Observable<Order> {
        return this.http.post<Order>(`${this.endpoint}api/Order`, modelo)
    }

    updateOrder(idOrder: number, modelo: Order): Observable<Order> {
        return this.http.put<Order>(`${this.endpoint}api/Order/${idOrder}`, modelo)
    }

    deleteOrder(idOrder: number): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/Order/${idOrder}`)
    }
    //<----------------->

    //<--- COSTUMERS --->
    getCostumers(): Observable<Costumer[]> {
        return this.http.get<Costumer[]>(`${this.endpoint}api/Costumer`)
    }

    addCostumer(modelo: Costumer): Observable<Costumer> {
        return this.http.post<Costumer>(`${this.endpoint}api/Costumer`, modelo)
    }

    updateCostumer(idCostumer: string, modelo: Costumer): Observable<Costumer> {
        return this.http.put<Costumer>(`${this.endpoint}api/Costumer/${idCostumer}`, modelo)
    }

    deleteCostumer(idCostumer: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/Costumer/${idCostumer}`)
    }
    //<----------------->

    //<--- EMPLOYEES --->
    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.endpoint}api/Employee`)
    }

    addEmployee(modelo: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.endpoint}api/Employee`, modelo)
    }

    updateEmployee(idEmployee: string, modelo: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.endpoint}api/Employee/${idEmployee}`, modelo)
    }

    deleteEmployee(idEmployee: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/Employee/${idEmployee}`)
    }
    //<------------->

    //<--- USERS --->
    getUsers() {
        return this.http.get<User[]>(`${this.endpoint}api/User`);
    }

    getCurrentUser(userId: string) {
        return this.http.get<User>(`${this.endpoint}api/User/${userId}`)
    }

    createUser(model: User) {
        return this.http.post<User>(`${this.endpoint}api/User`, model)
    }

    updateUser(userId: string, model: User) {
        return this.http.put<User>(`${this.endpoint}api/User/${userId}`, model)
    }
    //<-------------->
    //<--- FREQUENT TRAVELER --->
    getFrequentTravelers(): Observable<FrequentTraveler[]> {
        return this.http.get<FrequentTraveler[]>(`${this.endpoint}api/FrequentTraveler`)
    }

    addFrequentTraveler(modelo: FrequentTraveler): Observable<FrequentTraveler> {
        return this.http.post<FrequentTraveler>(`${this.endpoint}api/FrequentTraveler`, modelo)
    }

    updateFrequentTraveler(idFrequentTraveler: string, modelo: FrequentTraveler): Observable<FrequentTraveler> {
        return this.http.put<FrequentTraveler>(`${this.endpoint}api/FrequentTraveler/${idFrequentTraveler}`, modelo)
    }

    deleteFrequentTraveler(idFrequentTraveler: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/FrequentTraveler/${idFrequentTraveler}`)
    }
    //<------------->
}
