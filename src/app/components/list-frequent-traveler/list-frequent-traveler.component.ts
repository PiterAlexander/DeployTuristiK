import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DeleteFrequentTravelerRequest, GetAllCustomerRequest, OpenModalCreateCustomer, OpenModalCreateFrequentTraveler } from '@/store/ui/actions';
import { Customer } from '@/models/customer';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

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
  public customerData: Customer;
  public frequentTravelers: Array<FrequentTraveler>;
  public allcustomer: Array<Customer>;
  public frequentTravelerCustomers: Array<Customer> = [];

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest());
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.loading = state.allCustomers.loading;
      this.allcustomer = state.allCustomers.data;
      this.customerData = state.oneCustomer.data;

      this.frequentTravelers = state.allFrequentTraveler.data;
      this.comparecustomerId();
    });
  }

  comparecustomerId() {
    
    this.frequentTravelerCustomers = [];
    for (const element of this.frequentTravelers) {
      const customer = this.allcustomer.find(c => c.customerId === element.travelerId);
      if (customer != undefined) {
        this.frequentTravelerCustomers.push(customer);
      }
    }
    
  }

  openModalCreateFrequentTraveler() {
    this.cancel
    this.store.dispatch(new OpenModalCreateFrequentTraveler(this.customerData));
  } 

  openModalEditCustomer(customer:Customer){
    this.store.dispatch(new OpenModalCreateCustomer(customer));
  }

  // delete(ft:FrequentTraveler){
  //   this.store.dispatch(new DeleteFrequentTravelerRequest(ft));
  // }

  cancel() {
    this.modalPrimeNg.close();
  }

  
}