import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GetAllCustomerRequest, OpenModalCreateFrequentTraveler } from '@/store/ui/actions';
import { Customer } from '@/models/customer';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';

interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-list-frequent-traveler',
  templateUrl: './list-frequent-traveler.component.html',
  styleUrls: ['./list-frequent-traveler.component.scss']
})
export class ListFrequentTravelerComponent implements OnInit {
  public filteredFrequentTravelerList: Array<Customer>;
  public search: string;
  public total: number;
  public ui: Observable<UiState>;
  public loading: boolean;
  public FrequentTravelerList: Array<any>;
  public costumerData: Customer;
  public frequentTravelers: Array<FrequentTraveler>;
  public allCostumer: Array<Customer>;
  public frequentTravelerCustomers: Array<Customer> = [];

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest());
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.loading = state.allCustomers.loading;
      this.allCostumer = state.allCustomers.data;
      this.costumerData = state.oneCustomer.data;
      this.frequentTravelers = state.oneCustomer.data.frequentTraveler;
      this.compareCostumerId();
    });
  }

  compareCostumerId() {
    this.frequentTravelerCustomers = [];
    for (const element of this.frequentTravelers) {
      const costumer = this.allCostumer.find(c => c.customerId === element.travelerId);
      if (costumer != undefined) {
        this.frequentTravelerCustomers.push(costumer);
      }
    }
    
  }

  openModalCreateFrequentTraveler() {
    this.store.dispatch(new OpenModalCreateFrequentTraveler(this.costumerData));
    console.log(this.frequentTravelerCustomers);
  }

  cancel() {
    this.modalService.dismissAll();
  }

  
}
