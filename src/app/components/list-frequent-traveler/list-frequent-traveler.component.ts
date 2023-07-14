import { Customer } from '@/models/customer';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { AppState } from '@/store/state';
import { GetAllCustomerRequest, OpenModalCreateFrequentTraveler } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { element } from 'protractor';
import { Observable } from 'rxjs';

interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-list-frequent-traveler',
  templateUrl: './list-frequent-traveler.component.html',
  // styleUrls: ['./list-frequent-traveler.component.scss']
})
export class ListFrequentTravelerComponent {
  public filteredFrequentTravelerList: Array<Customer>;
  public search: string
  public total: number
  public ui: Observable<UiState>
  public FrequentTravelerList: Array<any>
  public customerData : Customer
  public frequentTravelers : Array<FrequentTraveler>
  public allCustomer : Array<Customer>
  public frequentTravelerCustomers : Array<Customer> = []

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.allCustomer = state.allCustomers.data
      this.customerData = state.oneCustomer.data
      this.frequentTravelers = state.oneCustomer.data.frequentTraveler
      this.compareCustomerId()
      console.log(this.frequentTravelers)
    })
  }

  compareCustomerId(){
    for(const element of this.frequentTravelers){
    const customer = this.allCustomer.find(c => c.customerId === element.travelerId)
    if (customer != undefined) {
      this.frequentTravelerCustomers.push(customer)
    }
    };
  }

  openModalCreateFrequentTraveler() {
    this.store.dispatch(new OpenModalCreateFrequentTraveler(this.customerData));
    console.log(this.frequentTravelerCustomers)
  }

  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredFrequentTravelerList = this.FrequentTravelerList;
      this.total = this.filteredFrequentTravelerList.length;
      this.filteredFrequentTravelerList = this.filteredFrequentTravelerList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredFrequentTravelerList = this.FrequentTravelerList.filter(frequentTravelerModel => frequentTravelerModel.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredFrequentTravelerList.length;
      this.filteredFrequentTravelerList = this.filteredFrequentTravelerList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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

  cancel() {
    this.modalService.dismissAll();
  }
}
