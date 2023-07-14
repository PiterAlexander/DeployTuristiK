import { Order } from '@/models/order';
import { GetAllCustomerRequest, GetAllOrdersRequest, OpenModalCreateOrder, OpenModalCreatePayment, OpenModalOrderDetails, OpenModalPayments } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit, PipeTransform } from '@angular/core';
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
  public loading: boolean;
  public search: string
  public total: number
  public user: any
  public role: any
  public allCustomers: Array<Customer>
  public oneCustomer: Customer

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new GetAllOrdersRequest())
    this.store.dispatch(new GetAllCustomerRequest())
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allCustomers = state.allCustomers.data
      this.allOrders = state.allOrders.data
      this.compareCustomer()
      this.searchByName()
    })
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
      }
    }
  }

  matches(orderResolved: Order, term: string, pipe: PipeTransform) {
    return (
      orderResolved.customerId.toLowerCase().includes(term.toLowerCase())
    );
  }

  openModalCreateOrder() {
    this.store.dispatch(new OpenModalCreateOrder());
  }

  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredOrdersList = this.ordersList;
      this.total = this.filteredOrdersList.length;
      this.filteredOrdersList = this.filteredOrdersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredOrdersList = this.ordersList.filter(orderModel => orderModel.customerId.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredOrdersList.length;
      this.filteredOrdersList = this.filteredOrdersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  sendToOrderDetails(order: Order) {
    this.store.dispatch(new OpenModalOrderDetails(order))
  }

  sendToPayments(order: Order) {
    this.store.dispatch(new OpenModalPayments(order))
  }

  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this.searchByName();
  }
}
