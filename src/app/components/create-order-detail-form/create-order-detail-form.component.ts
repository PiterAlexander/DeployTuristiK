import { Costumer } from '@/models/costumer';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateCostumerRequest, CreateOrderData, OpenModalCreateOrder, OpenModalCreatePayment } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-order-detail-form',
  templateUrl: './create-order-detail-form.component.html',
  styleUrls: ['./create-order-detail-form.component.scss']
})
export class CreateOrderDetailFormComponent implements OnInit {

  formGroup: FormGroup;
  private ui: Observable<UiState>
  public orderProcess: Array<any>
  public beneficiaries: Array<Costumer> = []
  public user: User = {
    userName: 'pakitours',
    email: 'pakitours@pakitours.com',
    password: 'pakitours',
    status: 2,
    roleId: "2d176444-1e21-42d8-155f-08db67be323f",
  }

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.orderProcess = state.orderProcess.data
    })
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      birthdate: ['', Validators.required],
      eps: ['', Validators.required],
    });
  }

  validForm(): boolean {
    return this.formGroup.value.name != '' &&
      this.formGroup.value.lastName != '' &&
      this.formGroup.value.document != '' &&
      this.formGroup.value.address != '' &&
      this.formGroup.value.phoneNumber != '' &&
      this.formGroup.value.birthdate != '' &&
      this.formGroup.value.eps != ''
  }

  back() {
    this.modalService.dismissAll();
    this.store.dispatch(new OpenModalCreateOrder)
  }

  save() {

    if (this.beneficiaries.length < this.orderProcess[0].order.beneficiaries) {
      this.beneficiaries.push({
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        address: this.formGroup.value.address,
        phoneNumber: this.formGroup.value.phoneNumber,
        birthDate: this.formGroup.value.birthdate,
        EPS: this.formGroup.value.eps,
        User: this.user,
      })
      this.formGroup.reset()
    } else {
      this.orderProcess = [{
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
        payment: {}
      }]
      // this.store.dispatch(new CreateOrderData(this.orderProcess))
      // this.modalService.dismissAll();
      // this.store.dispatch(new OpenModalCreatePayment)
    }
  }
}
