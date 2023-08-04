import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DeleteFrequentTravelerRequest, GetAllRoleRequest, OpenModalCreateCustomer } from '@/store/ui/actions';
import { Customer } from '@/models/customer';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Role } from '@/models/role';
import { ConfirmationService } from 'primeng/api';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-list-frequent-traveler',
  templateUrl: './list-frequent-traveler.component.html',
  styleUrls: ['./list-frequent-traveler.component.scss']
})

export class ListFrequentTravelerComponent implements OnInit {
  public ui: Observable<UiState>
  public role: any
  public user: any
  public allRoles: Array<Role>
  public allCustomers: Array<Customer>
  public oneCustomer: Customer
  public frequentTravelersList: Array<Customer> = []
  public loading: boolean = true
  public visible: boolean = true
  avatars: string[] = [
    'https://i.pinimg.com/236x/45/1c/1f/451c1fd9de0d5c1ebc813444f99aa44c.jpg',
    'https://i.pinimg.com/236x/a7/ed/12/a7ed12a602d817b5c4ef8a9aa52bd703.jpg',
    'https://i.pinimg.com/236x/70/21/39/702139884f3fb43b1e4722df7ee85a30.jpg',
    'https://i.pinimg.com/236x/c6/9a/70/c69a70f740a1ea3939021fa05c1d7f17.jpg',
    'https://i.pinimg.com/236x/53/49/1c/53491c7a972e8c4df667ef2b511ba334.jpg',
    'https://i.pinimg.com/236x/88/74/c9/8874c94b8691b64c4fb19723449e5844.jpg',
  ];

  constructor(
    private store: Store<AppState>,
    private modalPrimeNg: DynamicDialogRef,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllRoleRequest())
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      this.oneCustomer = state.oneCustomer.data
      this.compareCustomerId()
    })
  }

  compareCustomerId() {
    if (this.allCustomers !== undefined) {
      if (this.user['role'] === 'Cliente') {
        const oneCustomer: Customer = this.allCustomers.find(c => c.userId === this.user['id'])
        if (oneCustomer !== undefined) {
          if (oneCustomer.frequentTraveler.length > 0) {
            let index: number = 0
            for (const element of oneCustomer.frequentTraveler) {
              const customer = this.allCustomers.find(c => c.customerId === element.travelerId)
              if (customer !== undefined) {
                const frequentTraveler: any = {
                  customerId: customer.customerId,
                  name: customer.name,
                  lastName: customer.lastName,
                  document: customer.document,
                  birthDate: customer.birthDate,
                  phoneNumber: customer.phoneNumber,
                  address: customer.address,
                  eps: customer.eps,
                  userId: customer.userId,
                  user: customer.user,
                  img: this.avatars[index]
                }
                const alreadyExists: Customer = this.frequentTravelersList.find(o => o.customerId === element.travelerId)
                if (alreadyExists === undefined) {
                  this.frequentTravelersList.push(frequentTraveler)
                  if (index === 5) {
                    index = 0
                  } else {
                    index++
                  }
                }
              }
            }
          }
        }
      } else {
        if (this.oneCustomer.frequentTraveler !== undefined) {
          for (const element of this.oneCustomer.frequentTraveler) {
            const customer = this.allCustomers.find(c => c.customerId === element.travelerId)
            if (customer !== undefined) {
              const alreadyExists: Customer = this.frequentTravelersList.find(o => o.customerId === element.travelerId)
              if (alreadyExists === undefined) {
                this.frequentTravelersList.push(customer)
              }
            }
          }
        }
      }
      this.updateVisibility()
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  getRandomAvatarUrl() {
    const randomIndex = Math.floor(Math.random() * this.avatars.length);
    return this.avatars[randomIndex];
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
      message: '¿Está seguro de eliminar a ' + customer.name + ' ' + customer.lastName + ' ?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
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