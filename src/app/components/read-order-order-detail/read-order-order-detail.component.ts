import { Costumer } from '@/models/costumer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { AppState } from '@/store/state';
import { GetAllCostumerRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-read-order-order-detail',
  templateUrl: './read-order-order-detail.component.html',
  styleUrls: ['./read-order-order-detail.component.scss']
})
export class ReadOrderOrderDetailComponent implements OnInit {

  public ui: Observable<UiState>
  public orderDetails: Array<OrderDetail>
  public allCostumers: Array<Costumer>
  public order: Order
  public orderDetailCostumers: Array<Costumer> = []

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCostumerRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.order = state.oneOrder.data
      this.orderDetails = state.oneOrder.data.orderDetail
      this.allCostumers = state.allCostumers.data
      this.compareCostumerId()
    })
  }

  compareCostumerId() {
    for (const element of this.orderDetails) {
      const costumer = this.allCostumers.find(c => c.costumerId === element.beneficiaryId)
      if (costumer != undefined) {
        this.orderDetailCostumers.push(costumer)
      }
    }
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  addOrderDetail() {
    if (this.order.package.availableQuotas >= 1) {
      this.closeModal()
      const orderProcess = [{
        action: 'CreateOrderDetail',
        order: this.order
      }]
      this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess))
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Lo sentimos no quedan cupos disponibles.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }

  editOrdelDetail(costumer: Costumer) {
    const orderDetail = this.orderDetails.find(od => od.beneficiaryId === costumer.costumerId)
    const orderProcess = [{
      action: 'EditOrderDetail',
      costumer: costumer,
      orderDetail: orderDetail,
      order: this.order
    }]
    this.modalService.dismissAll();
    this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess))
  }
}
