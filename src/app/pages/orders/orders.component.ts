import { Order } from '@/models/order';
import { GetAllOrdersRequest, OpenModalCreateOrder } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';

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
  public ordersList: Array<Order>;
  public filteredOrdersList: Array<Order>;
  public loading: boolean;
  public search: string
  public total: number

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new GetAllOrdersRequest());

    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.ordersList = state.allOrders.data,
      console.log(this.ordersList)
      this.loading = state.allOrders.loading
      this.searchByName();
    });
  }

  matches(orderResolved: Order, term: string, pipe: PipeTransform) {
    return (
      orderResolved.costumerId.toLowerCase().includes(term.toLowerCase())
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
      this.filteredOrdersList = this.ordersList.filter(orderModel => orderModel.costumerId.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredOrdersList.length;
      this.filteredOrdersList = this.filteredOrdersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
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
