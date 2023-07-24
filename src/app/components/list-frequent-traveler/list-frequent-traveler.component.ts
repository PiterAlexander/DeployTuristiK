import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DeleteFrequentTravelerRequest, OpenModalCreateCustomer } from '@/store/ui/actions';
import { Customer } from '@/models/customer';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Role } from '@/models/role';
import { ConfirmationService } from 'primeng/api';
import { FrequentTraveler } from '@/models/frequentTraveler';

@Component({
  selector: 'app-list-frequent-traveler',
  templateUrl: './list-frequent-traveler.component.html',
  styleUrls: ['./list-frequent-traveler.component.scss']
})

export class ListFrequentTravelerComponent implements OnInit {
  public ui: Observable<UiState>
  public allRoles: Array<Role>
  public allCustomers: Array<Customer>
  public oneCustomer: Customer
  public frequentTravelersList: Array<Customer> = []
  public loading: boolean = true
  public visible: boolean = true

  constructor(
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.oneCustomer = state.oneCustomer.data
      this.compareCustomerId()
    })
  }

  compareCustomerId() {
    if (this.oneCustomer.frequentTraveler !== undefined) {
      for (const element of this.oneCustomer.frequentTraveler) {
        const customer = this.allCustomers.find(c => c.customerId === element.travelerId)
        if (customer !== undefined) {
          this.frequentTravelersList.push(customer)
        }
      }
      this.updateVisibility()
    }
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false
    setTimeout(() => this.visible = true, 0)
  }

  createFrequentTraveler() {
    this.close()
    const oneCustomer = {
      action: 'createFrequentTraveler',
      customer: this.oneCustomer
    }
    this.store.dispatch(new OpenModalCreateCustomer({ ...oneCustomer }))
  }

  validateEditAllowing(customer: Customer): boolean {
    if (this.allRoles !== undefined) {
      const role = this.allRoles.find(r => r.roleId === customer.user.roleId)
      if (role !== undefined) {
        if (role.name !== 'Cliente') {
          return true
        }
      }
    }
    return false
  }

  editFrequentTraveler(customer: Customer) {
    const oneCustomer = {
      action: 'editCustomerFromFrequentTraveler',
      customer: customer,
      titularCustomer: this.oneCustomer
    }
    this.close()
    this.store.dispatch(new OpenModalCreateCustomer({ ...oneCustomer }))
  }

  deleteFrequentTraveler(customer: Customer) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Estás seguro de eliminar a ' + customer.name + ' ' + customer.lastName + ' de tus viajeros frecuentes?',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-primary p-button-sm',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        const frequentTraveler: FrequentTraveler = this.oneCustomer.frequentTraveler.find(ft => ft.travelerId === customer.customerId)
        if (frequentTraveler !== undefined) {
          this.store.dispatch(new DeleteFrequentTravelerRequest({ ...frequentTraveler }))
        }
      }
    })
  }

  close() {
    this.modalPrimeNg.close()
  }
}