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
import { Role } from '@/models/role';

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
  public allRoles: Array<Role>
  public loading: boolean = true
  public visible: boolean = true
  public FrequentTravelerList: Array<any> = []
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
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCustomerRequest());
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.loading = state.allCustomers.loading;
      this.allcustomer = state.allCustomers.data;
      this.customerData = state.oneCustomer.data;
      this.allRoles = state.allRoles.data
      this.frequentTravelers = state.allFrequentTraveler.data;
      this.comparecustomerId();
    });
  }

  comparecustomerId() {
    for (const element of this.frequentTravelers) {
      const customer = this.allcustomer.find(c => c.customerId === element.travelerId);
      if (customer != undefined) {
        this.frequentTravelerCustomers.push(customer);
      }
    }
    this.updateVisibility()
  }


  validateEditAllowing(beneficiarie: any): boolean {
    if (this.allRoles !== undefined) {
      const role = this.allRoles.find(r => r.roleId === beneficiarie.user.roleId)
      if (role !== undefined) {
        if (role.name !== 'Cliente') {
          return true
        }
      }
    }
    return false
  }

  openModalCreateFrequentTraveler() {
    this.cancel()
    this.store.dispatch(new OpenModalCreateFrequentTraveler(this.customerData));
  }

  openModalEditCustomer(customer: Customer) {
    this.cancel()
    this.store.dispatch(new OpenModalCreateCustomer(customer));
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  delete(traveler: Customer) {
    // const FrequentTraveler: FrequentTraveler = this.FrequentTravelerList.find(ft => ft.travelerId == idt && ft.customerId == this.customerData.customerId)
    for (const element of this.customerData.frequentTraveler) {
      if (element !== undefined) {
        if (element.travelerId === traveler.customerId) {
          // const frequentTravelerId = element.frequentTravelerId
          this.store.dispatch(new DeleteFrequentTravelerRequest(element))
        }
        // const frequentTraveler: FrequentTraveler =
      }
    }
    // const FrequentTraveler: FrequentTraveler = {
    //   customerId: this.customerData.customerId,
    //   travelerId: traveler.customerId
    // }
    // this.store.dispatch( new DeleteFrequentTravelerRequest())
  }

  cancel() {
    this.modalPrimeNg.close();
  }


}