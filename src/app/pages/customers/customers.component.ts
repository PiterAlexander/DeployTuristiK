import { Customer } from '@/models/customer';
import { GetAllCustomerRequest, OpenModalCreateCustomer, OpenModalListFrequentTraveler} from '@/store/ui/actions';
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
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public ui: Observable<UiState>;
  public customersList: Array<Customer>;
  public filteredCustomersList: Array<Customer>;
  public loading: boolean;
  public search: string
  public total: number

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new GetAllCustomerRequest());

    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.customersList = state.allCustomers.data,
      this.loading = state.allCustomers.loading
      this.searchByName();
    });
  }

  matches(customerResolved: Customer, term: string, pipe: PipeTransform) {
    return (
      customerResolved.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  openModalCreateCustomer(customer?:Customer) {
    this.store.dispatch(new OpenModalCreateCustomer());
  }

  openModalEditCustomer(customer:Customer){
    this.store.dispatch(new OpenModalCreateCustomer(customer));
  }
  
  openModalListTraveler(customer:Customer){
    this.store.dispatch(new OpenModalListFrequentTraveler(customer));
  }

  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredCustomersList = this.customersList;
      this.total = this.filteredCustomersList.length;
      this.filteredCustomersList = this.filteredCustomersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredCustomersList = this.customersList.filter(customerModel => customerModel.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredCustomersList.length;
      this.filteredCustomersList = this.filteredCustomersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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