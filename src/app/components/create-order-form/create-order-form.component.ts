import { AppState } from '@/store/state';
import { CreateOrderData, GetAllCostumerRequest, GetAllPackagesRequest, GetAllRoleRequest, GetUsersRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Package } from '@/models/package';
import { Costumer } from '@/models/costumer';
import { Role } from '@/models/role';
import { User } from '@/models/user';

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
  public allRoles: Array<Role>
  public allUsers: Array<User>
  public onePackage: Package

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllPackagesRequest)
    this.store.dispatch(new GetAllCostumerRequest)
    this.store.dispatch(new GetAllRoleRequest)
    this.store.dispatch(new GetUsersRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allPackages = state.allPackages.data
      this.allCostumers = state.allCostumers.data
      this.allRoles = state.allRoles.data
      this.allUsers = state.allUsers.data
    })
    this.formGroup = this.fb.group({
      document: ['', Validators.required],
      packageId: ['', Validators.required],
      beneficiariesAmount: ['', Validators.required],
    });
  }

  cancel() {
    this.modalService.dismissAll();
  }

  //<--- VALIDACIONES --->

  validForm(): boolean {
    return this.formGroup.valid &&
      this.formGroup.value.document != '' && this.formGroup.value.PackageId != 0 &&
      this.formGroup.value.beneficiariesAmount > 0 && !this.validateCostumerId() && !this.validateRole() &&
      this.validateBeneficiaries() && this.validateBeneficiariesAmount()
  }

  validateCostumerId(): boolean {
    if (this.formGroup.value.document.length >= 8) {
      if (this.allCostumers.find(c => c.document === this.formGroup.value.document) === undefined) {
        return true
      }
    }
    return false
  }

  validateRole(): boolean {
    if (this.formGroup.value.document.length >= 8) {
      const oneCostumer = this.allCostumers.find(c => c.document === this.formGroup.value.document)
      if (oneCostumer != undefined) {
        const oneUser = this.allUsers.find(u => u.userId === oneCostumer.userId)
        const oneRole = this.allRoles.find(r => r.roleId === oneUser.roleId)
        if (oneRole.name != 'Cliente') {
          return true
        }
      }
    }
    return false
  }

  validateBeneficiaries(): boolean {
    if (this.formGroup.value.packageId != 0) {
      this.onePackage = this.allPackages.find(p => p.packageId == this.formGroup.value.packageId)
      if (this.formGroup.value.beneficiariesAmount <= this.onePackage.availableQuotas) {
        return true
      }
    }
    return false
  }

  validateBeneficiariesAmount() {
    if (this.formGroup.value.beneficiariesAmount === null) {
      return true
    } else if (this.formGroup.value.beneficiariesAmount <= 0) {
      return false
    }
    return true
  }

  //<------------------->

  next() {
    const oneCostumer = this.allCostumers.find(c => c.document === this.formGroup.value.document)
    this.orderProcess = ([{
      order: {
        costumerId: oneCostumer.costumerId,
        package: this.onePackage,
        status: 1,
        beneficiaries: this.formGroup.value.beneficiariesAmount
      },
      beneficiaries: {},
      payment: {}
    }])
    this.store.dispatch(new CreateOrderData(this.orderProcess))
    this.cancel()
    this.store.dispatch(new OpenModalCreateOrderDetail());
  }
}

