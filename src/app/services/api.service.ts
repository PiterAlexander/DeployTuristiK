import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, } from 'rxjs';
import { Package } from '@/models/package';
import { Order } from '@/models/order';
import { Customer } from '@/models/customer';
import { Employee } from '@/models/employee';
import { OrderDetail } from '@/models/orderDetail';
import { User } from '@/models/user';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { Payment } from '@/models/payment';
import { Token } from '@/models/token';
import { Role } from '@/models/role';
import { Permission } from '@/models/permission';
import { AssociatedPermission } from '@/models/associated-permission';
import { recoverPasswordEmail, sendPQRS } from '@/models/recoverPasswordEmail';
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private endpoint: string = environment.endPoint

    constructor(private http: HttpClient) { }

    //<--- PACAKGE --->
    getPackages(): Observable<Package[]> {
        return this.http.get<Package[]>(`${this.endpoint}api/package/`)
    }

    addPackage(modelo: Package): Observable<Package> {
        return this.http.post<Package>(`${this.endpoint}api/package/`, modelo)
    }

    updatePackage(idPackage: string, modelo: Package): Observable<Package> {
        return this.http.put<Package>(`${this.endpoint}api/package/${idPackage}`, modelo)
    }

    disablePackage(pack: Package): Observable<Package> {
        return this.http.post<Package>(`${this.endpoint}api/package/${pack.packageId}/changeStatus`, null)
    }

    getTopPackage(startDate?: Date, endDate?: Date): Observable<Package[]> {
        if (startDate && endDate) {
            return this.http.get<Package[]>(`${this.endpoint}api/package/Top/${startDate}/${endDate}`)
        }
        return this.http.get<Package[]>(`${this.endpoint}api/package/Top`)
    }

    //<-------------->

    //<--- ORDERS --->
    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.endpoint}api/Order`)
    }

    getOrderById(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.endpoint}api/Order/${orderId}`);
    }

    addOrder(modelo: Order): Observable<Order> {
        return this.http.post<Order>(`${this.endpoint}api/Order`, modelo)
    }

    updateOrder(orderId: string, modelo: Order): Observable<Order> {
        return this.http.put<Order>(`${this.endpoint}api/Order/${orderId}`, modelo)
    }

    addPayment(modelo: any): Observable<Payment> {
        return this.http.post<Payment>(`${this.endpoint}api/Payment`, modelo)
    }

    getPayments(): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${this.endpoint}api/Payment`)
    }

    addOrderDetail(modelo: OrderDetail): Observable<OrderDetail> {
        return this.http.post<OrderDetail>(`${this.endpoint}api/OrderDetail`, modelo)
    }

    updateOrderDetail(orderDetailId: string, modelo: OrderDetail): Observable<OrderDetail> {
        return this.http.put<OrderDetail>(`${this.endpoint}api/OrderDetail/${orderDetailId}`, modelo)
    }

    updatePayment(paymentId: any, modelo: any): Observable<Payment> {
        return this.http.put<Payment>(`${this.endpoint}api/Payment/${paymentId}`, modelo)
    }

    deleteOrderDetail(orderDetailId: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/OrderDetail/${orderDetailId}`)
    }
    //<----------------->

    //<--- CUSTOMERS --->
    getCustomers(): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.endpoint}api/Customer`)
    }

    addCustomer(modelo: Customer): Observable<Customer> {
        return this.http.post<Customer>(`${this.endpoint}api/Customer`, modelo)
    }

    updateCustomer(idCustomer: string, modelo: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${this.endpoint}api/Customer/${idCustomer}`, modelo)
    }

    deleteCustomer(idCustomer: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/Customer/${idCustomer}`)
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
    //<--- LOGIN --->
    signIn(email: string, password: string) {
        return this.http.post<Token>(`${this.endpoint}api/Login`, { email, password })
    }

    recoverPassword(model: recoverPasswordEmail) {
        return this.http.post<any>(`${this.endpoint}api/Email/ResetPassword`, model)
    }

    changePassword(model: any) {
        return this.http.post<Token>(`${this.endpoint}api/ChangePassword`, model)
    }


    //<------ROLES-------->
    getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.endpoint}api/Role`);
    }

    getRoleById(RoleId: string): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.endpoint}api/Role/${RoleId}`);
    }

    addRole(modelo: Role): Observable<Role> {
        return this.http.post<Role>(`${this.endpoint}api/Role`, modelo);
    }

    updateRole(RoleId: string, modelo: Role): Observable<Role> {
        return this.http.put<Role>(`${this.endpoint}api/Role/${RoleId}`, modelo);
    }

    deleteRole(RoleId: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/Role/${RoleId}`);
    }


    //<------PERMISSIONS-------->
    getPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(`${this.endpoint}api/Permission/`);
    }

    //<------ ASSOCIATED PERMISSIONS-------->
    addAssociatedPermission(modelo: AssociatedPermission): Observable<AssociatedPermission> {
        return this.http.post<AssociatedPermission>(`${this.endpoint}api/AssociatedPermission/`, modelo);
    }

    deleteAssociatedPermission(associatedPermissionId: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}api/AssociatedPermission/${associatedPermissionId}`);
    }

    getIngresosMensuales(): Observable<number[]> {
        return this.http.get<number[]>(`${this.endpoint}api/Ingresos/Mensuales`);
    }

    //<------ CONTACT US-------->
    sendPQRS(model: sendPQRS) {
        return this.http.post<any>(`${this.endpoint}api/Email/SendPQRS`, model)
    }
}
