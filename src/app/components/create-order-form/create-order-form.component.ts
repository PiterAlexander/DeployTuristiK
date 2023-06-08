import { AppState } from '@/store/state';
import { CreateOrderData, GetAllCostumerRequest, GetAllEmployeeRequest, GetAllPackagesRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Package } from '@/models/package';
import { Costumer } from '@/models/costumer';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.scss']
})
export class CreateOrderFormComponent implements OnInit {

  formGroup: FormGroup;
  private ui: Observable<UiState>
  public orderProcess: Array<any>
  public allPackages: Array<Package>
  public allCostumers: Array<Costumer>

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllPackagesRequest)
    this.store.dispatch(new GetAllCostumerRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allPackages = state.allPackages.data
      this.allCostumers = state.allCostumers.data
    })
    this.formGroup = this.fb.group({
      document: ['', Validators.required],
      PackageId: ['', Validators.required],
      BeneficiariesAmount: ['', Validators.required],
    });
  }

  validForm(): boolean {
    return this.formGroup.valid &&
      this.formGroup.value.document != '' && this.formGroup.value.document != null &&
      this.formGroup.value.PackageId != 0 &&
      this.formGroup.value.BeneficiariesAmount > 0
  }

  cancel() {
    this.modalService.dismissAll();
  }

  next() {
    var costumerId
    var price
    this.allCostumers.forEach(element => {
      if (this.formGroup.value.document == element.document) {
        costumerId = element.costumerId
      }
    });
    this.allPackages.forEach(element => {
      if (this.formGroup.value.PackageId == element.packageId) {
        price = element.price * this.formGroup.value.BeneficiariesAmount
      }
    });
    this.orderProcess = ([{
      order: {
        costumerId: costumerId,
        packageId: this.formGroup.value.PackageId,
        totalCost: price,
        status: 1,
        beneficiaries: this.formGroup.value.BeneficiariesAmount
      },
      beneficiaries: {},
      payment: {}
    }])
    this.store.dispatch(new CreateOrderData(this.orderProcess))
    this.cancel()
    this.store.dispatch(new OpenModalCreateOrderDetail());
  }
}
