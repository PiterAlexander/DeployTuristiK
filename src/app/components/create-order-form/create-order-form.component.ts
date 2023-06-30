import { AppState } from '@/store/state';
import { GetAllCostumerRequest, GetAllPackagesRequest, GetAllRoleRequest, GetUsersRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
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
import Swal from 'sweetalert2';

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
  public beneficiariesAmount: number


  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    if (this.orderProcess == null) {
      this.store.dispatch(new GetAllPackagesRequest)
      this.store.dispatch(new GetAllCostumerRequest)
      this.store.dispatch(new GetAllRoleRequest)
      this.store.dispatch(new GetUsersRequest)
    }
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.orderProcess = state.orderProcess.data
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

    if (this.orderProcess != undefined) {
      if (this.orderProcess[0].beneficiaries.length > 0) {
        this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
      } else {
        if (this.orderProcess[0].order.beneficiaries != undefined) {
          this.beneficiariesAmount = this.orderProcess[0].order.beneficiaries
        }
      }
      this.formGroup.setValue({
        document: this.orderProcess[0].order.costumer.document,
        packageId: this.orderProcess[0].order.package.packageId,
        beneficiariesAmount: this.beneficiariesAmount
      })
    }
  }

  cancel() {
    if (this.orderProcess != undefined) {
      if (this.orderProcess[0].beneficiaries.length > 0) {
        Swal.fire({
          icon: 'question',
          title: '¿Estás seguro?',
          text: 'Perderás toda la información previamente ingresada.',
          showDenyButton: true,
          denyButtonText: `Sí, salir`,
          confirmButtonText: 'Permanecer',
        }).then((result) => {
          if (result.isDenied) {
            this.modalService.dismissAll();
          }
        })
      } else {
        this.modalService.dismissAll();
      }
    } else {
      this.modalService.dismissAll();
    }
  }

  //<--- VALIDACIONES --->

  validForm(): boolean {
    return this.formGroup.valid &&
      this.formGroup.value.document != '' && this.formGroup.value.PackageId != 0 &&
      this.formGroup.value.beneficiariesAmount > 0 && !this.validateCostumerId() && !this.validateRole() &&
      this.validateBeneficiaries() && this.validateBeneficiariesAmount() && this.validateExistingBeneficiariesAmount()
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
        if (oneUser != undefined) {
          const oneRole = this.allRoles.find(r => r.roleId === oneUser.roleId)
          if (oneRole != undefined) {
            if (oneRole.name != 'Cliente') {
              return true
            }
          }
        }
      }
    }
    return false
  }

  validateBeneficiaries(): boolean {
    if (this.formGroup.value.packageId != 0) {
      this.onePackage = this.allPackages.find(p => p.packageId == this.formGroup.value.packageId)
      if (this.onePackage != undefined) {
        if (this.formGroup.value.beneficiariesAmount <= this.onePackage.availableQuotas) {
          return true
        }
      }
    }
    return false
  }

  validateBeneficiariesAmount(): boolean {
    if (this.formGroup.value.beneficiariesAmount === null) {
      return true
    } else if (this.formGroup.value.beneficiariesAmount <= 0) {
      return false
    }
    return true
  }

  validateExistingBeneficiariesAmount(): boolean {
    if (this.orderProcess != null) {
      if (this.formGroup.value.beneficiariesAmount === null) {
        return true
      } else if (this.formGroup.value.beneficiariesAmount <= 0) {
        return true
      } else if (this.formGroup.value.beneficiariesAmount < this.beneficiariesAmount) {
        return false
      }
    }
    return true
  }

  //<------------------->

  next() {
    if (!this.formGroup.invalid) {
      if (this.orderProcess != null) {
        this.modalService.dismissAll()
        const oneCostumer = this.allCostumers.find(c => c.document === this.formGroup.value.document)
        const orderProcess = ([{
          action: 'CreateOrder',
          order: {
            costumer: oneCostumer,
            package: this.onePackage,
            beneficiaries: this.formGroup.value.beneficiariesAmount
          },
          beneficiaries: this.orderProcess[0].beneficiaries,
        }])
        this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess));
      } else {
        const oneCostumer = this.allCostumers.find(c => c.document === this.formGroup.value.document)
        const orderProcess = [{
          action: 'CreateOrder',
          order: {
            costumer: oneCostumer,
            package: this.onePackage,
            beneficiaries: this.formGroup.value.beneficiariesAmount
          },
          beneficiaries: {},
        }]
        this.modalService.dismissAll()
        this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess));
      }
    }
  }
}

