import { Component, OnInit } from '@angular/core';
import { AppState } from '@/store/state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';
import { OpenModalCreateOrderDetail } from '@/store/ui/actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-frequent-travelers-to-orders',
  templateUrl: './list-frequent-travelers-to-orders.component.html',
  styleUrls: ['./list-frequent-travelers-to-orders.component.scss']
})
export class ListFrequentTravelersToOrdersComponent implements OnInit {

  private ui: Observable<UiState>
  public orderProcess: Array<any>
  public frequentTravelers: Array<Customer>
  public frequentTravelersToBeneficiaries: Array<Customer>

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.orderProcess = state.orderProcess.data
      this.saveFrequentTravelers()
    })
  }

  saveFrequentTravelers() {
    if (this.orderProcess != undefined) {
      if (this.orderProcess[0].action == 'CreateOrder') {
        for (const element of this.orderProcess[0].order.customer.frequentTraveler) {
          this.frequentTravelers.push(element)
        }
      }
    }
  }

  back() {
    this.modalService.dismissAll()
    this.store.dispatch(new OpenModalCreateOrderDetail(this.orderProcess))
  }

  isBeneficiarie(traveler: Customer): boolean {
    const beneficiarie = this.frequentTravelersToBeneficiaries.find(f => f.customerId === traveler.customerId)
    if (beneficiarie != undefined) {
      return true
    }
    return false
  }

  addTraveler(traveler: Customer) {
    let availableQuotas: number
    if (this.orderProcess[0].beneficiaries.length > 1) {
      availableQuotas = this.orderProcess[0].order.package.availableQuotas - this.orderProcess[0].beneficiaries.length
    } else {
      availableQuotas = this.orderProcess[0].order.package.availableQuotas
    }

    if (availableQuotas >= this.frequentTravelersToBeneficiaries.length + 1) {
      this.frequentTravelersToBeneficiaries.push(traveler)
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Lo sentimos no quedan cupos disponibles.',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      })
    }
  }

  discardTraveler(traveler: Customer) {
    const beneficiarie = this.frequentTravelersToBeneficiaries.find(f => f.customerId === traveler.customerId)
    const index = this.frequentTravelersToBeneficiaries.indexOf(beneficiarie)
    this.frequentTravelersToBeneficiaries.splice(index, 1)
  }
}
