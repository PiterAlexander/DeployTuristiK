import { Order } from '@/models/order';
import { GetAllCustomerRequest, GetAllOrdersRequest, OpenModalCreateOrder, OpenModalOrderDetails, OpenModalPayments } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';
import { SelectItem } from 'primeng/api';

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
  public statuses: any[] = [];
  public loading: boolean = true

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new GetAllOrdersRequest)
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
      { 'label': 'Pendiente', 'code': 0 },
      { 'label': 'En curso', 'code': 1 },
      { 'label': 'Pagado', 'code': 2 },
      { 'label': 'Cancelado', 'code': 3 }
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
        this.ordersList = this.allOrders
        this.loading = false
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

  create() {
    this.store.dispatch(new OpenModalCreateOrder());
  }

  sendToOrderDetails(order: Order) {
    this.store.dispatch(new OpenModalOrderDetails({ ...order }))
  }

  sendToPayments(order: Order) {
    this.store.dispatch(new OpenModalPayments({ ...order }))
  }

  //CUSTOMER


  onFilter(event: Event) {
    // dv.filter((event.target as HTMLInputElement).value);
  }
}
