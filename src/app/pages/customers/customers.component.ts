import { Customer } from '@/models/customer';
import { GetAllCustomerRequest, GetAllRoleRequest, OpenModalCreateCustomer, OpenModalListFrequentTraveler } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Role } from '@/models/role';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export class CustomersComponent implements OnInit {
  public ui: Observable<UiState>
  public allRoles: Array<Role>
  public allCustomers: Array<Customer>
  public total: number

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new GetAllRoleRequest)
    this.store.dispatch(new GetAllCustomerRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allCustomers = state.allCustomers.data
      this.allRoles = state.allRoles.data
    })
  }

  createCustomer() {
    this.store.dispatch(new OpenModalCreateCustomer())
  }

  editCustomer(customer: Customer) {
    const oneCustomer = {
      action: 'editCustomer',
      customer: customer
    }
    this.store.dispatch(new OpenModalCreateCustomer({ ...oneCustomer }))
  }

  validateListFrequentTravelersAllowing(customer: Customer): boolean {
    if (this.allRoles !== undefined) {
      const role: Role = this.allRoles.find(r => r.roleId === customer.user.roleId)
      if (role !== undefined) {
        if (role.name === 'Cliente') {
          return true
        }
      }
    }
    return false
  }

  listFrequentTravelers(customer: Customer) {
    this.store.dispatch(new OpenModalListFrequentTraveler({ ...customer }))
  }
}