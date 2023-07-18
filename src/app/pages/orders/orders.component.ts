import { Order } from '@/models/order';
import { GetAllCustomerRequest, GetAllOrdersRequest, OpenModalCreateOrder, OpenModalOrderDetails, OpenModalPayments } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';

interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public ui: Observable<UiState>;
  public allOrders: Array<Order>
  public ordersList: Array<Order> = []
  public filteredOrdersList: Array<Order>;
  public loading: boolean = true
  public search: string
  public total: number
  public user: any
  public role: any
  public allCustomers: Array<Customer>
  public oneCustomer: Customer
  public statuses: any[] = [];

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new GetAllOrdersRequest())
    this.store.dispatch(new GetAllCustomerRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allCustomers = state.allCustomers.data
      this.allOrders = state.allOrders.data
      this.compareCustomer()
    })

    this.statuses = [
      { 'label': 'Cancelado', 'code': 0 },
      { 'label': 'En curso', 'code': 1 },
      { 'label': 'Pagado', 'code': 2 },
      { 'label': 'Pendiente', 'code': 3 }
    ]
  }

  compareCustomer() {
    if (this.allCustomers !== undefined) {
      this.oneCustomer = this.allCustomers.find(c => c.userId === this.user['id'])
      if (this.oneCustomer !== undefined && this.user['role'] === 'Cliente') {
        for (const element of this.allOrders) {
          if (this.oneCustomer.customerId === element.customerId) {
            const exists = this.ordersList.find(o => o.orderId === element.orderId)
            if (exists === undefined) {
              this.ordersList.push(element)
            }
          }
        }
      } else if (this.user['role'] !== 'Cliente') {
        if (this.allOrders.length > 0) {
          console.log(this.allOrders);
          for (const element of this.allOrders) {
            if (element !== undefined) {
              this.ordersList.push(element)
            }
          }
          if (this.ordersList !== undefined) {
            if (this.ordersList.length === this.allOrders.length) {
              this.loading = false
            }
          }
        } else {
        }
      }
    }
  }

  showStatus(OrderStatus: any): string {
    for (let status of this.statuses) {
      if (OrderStatus === status.code) {
        return status.label
      }
    }
  }

  createOrder() {
    this.store.dispatch(new OpenModalCreateOrder());
  }

  sendToOrderDetails(order: Order) {
    this.store.dispatch(new OpenModalOrderDetails(order))
  }

  sendToPayments(order: Order) {
    this.store.dispatch(new OpenModalPayments(order))
  }
}
