import { Order } from '@/models/order';
import { GetAllCustomerRequest, GetAllOrdersRequest, GetAllPackagesRequest, GetAllRoleRequest, GetUsersRequest, OpenModalCreateOrder, OpenModalOrderDetails, OpenModalPayments } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';
import { Package } from '@/models/package';
import { ApiService } from '@services/api.service';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
  public ui: Observable<UiState>;
  public role: any
  public user: any
  public allCustomers: Array<Customer>
  public oneCustomer: Customer
  public allOrders: Array<Order>
  public ordersList: Array<Order> = []
  public allPackages: Array<Package>
  public statuses: any[] = [];
  public loading: boolean = true
  public visible: boolean = true

  constructor(
    private store: Store<AppState>,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.store.dispatch(new GetAllRoleRequest)
    this.store.dispatch(new GetUsersRequest)
    this.store.dispatch(new GetAllCustomerRequest)
    this.store.dispatch(new GetAllPackagesRequest)
    this.store.dispatch(new GetAllOrdersRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allCustomers = state.allCustomers.data
      this.allOrders = state.allOrders.data
      this.allPackages = state.allPackages.data
      this.compareCustomer()
    })

    this.statuses = [
      { 'label': 'Pendiente', 'code': 0 },
      { 'label': 'En curso', 'code': 1 },
      { 'label': 'Pagado', 'code': 2 },
      { 'label': 'Cancelado', 'code': 3 }
    ]
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  compareCustomer() {
    if (this.user['role'] === 'Cliente') {
      if (this.allCustomers !== undefined) {
        this.oneCustomer = this.allCustomers.find(c => c.userId === this.user['id'])
        if (this.oneCustomer !== undefined) {
          this.fillOrdersListArray()
        }
      }
    } else {
      this.ordersList = this.allOrders
      this.loading = false
    }
    this.updateVisibility()
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  fillOrdersListArray() {
    for (const element of this.allOrders) {
      if (this.oneCustomer.customerId === element.customerId) {
        const exists = this.ordersList.find(o => o.orderId === element.orderId)
        if (exists === undefined) {
          const onePackage: Package = this.allPackages.find(p => p.packageId === element.packageId)
          if (onePackage !== undefined) {
            const order: Order = {
              orderId: element.orderId,
              customerId: element.customerId,
              packageId: element.packageId,
              package: onePackage,
              totalCost: element.totalCost,
              status: element.status,
              payment: element.payment,
            }
            const alreadyExists: Order = this.ordersList.find(o => o.orderId === element.orderId)
            if (alreadyExists === undefined) {
              this.ordersList.push(order)
            }
          }
        }
      }
    }
  }

  showStatus(orderStatus: any): string {
    for (let status of this.statuses) {
      if (orderStatus === status.code) {
        return status.label
      }
    }
  }

  getCustomerName(order: Order): string {
    const customer: Customer = this.allCustomers.find(c => c.customerId === order.customerId)
    if (customer !== undefined) {
      return customer.name
    }
  }

  getCustomerLastName(order: Order): string {
    const customer: Customer = this.allCustomers.find(c => c.customerId === order.customerId)
    if (customer !== undefined) {
      return customer.lastName
    }
  }

  getCustomerDocument(order: Order): string {
    const customer: Customer = this.allCustomers.find(c => c.customerId === order.customerId)
    if (customer !== undefined) {
      return customer.document
    }
  }

  getPackageName(order: Order): string {
    const onePackage: Package = this.allPackages.find(p => p.packageId === order.packageId)
    if (onePackage !== undefined) {
      return onePackage.name
    }
  }

  create() {
    this.store.dispatch(new OpenModalCreateOrder());
  }

  async sendToPayments(order: Order) {
    const orderPromise = await new Promise((resolve, reject) => {
      this.apiService.getOrderById(order.orderId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (orderPromise) {
      const oneOrder: any = {
        orderId: orderPromise['orderId'],
        customerId: orderPromise['customerId'],
        customer: orderPromise['customer'],
        packageId: orderPromise['packageId'],
        package: orderPromise['package'],
        totalCost: orderPromise['totalCost'],
        status: orderPromise['status'],
        payment: orderPromise['payment']
      }
      this.store.dispatch(new OpenModalPayments({ ...oneOrder }))
    }
  }

}
