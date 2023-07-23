import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { Customer } from '@/models/customer';
import { Package } from '@/models/package';
import { GetAllCustomerRequest, GetAllPackagesRequest, GetAllRoleRequest, GetUsersRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.scss']
})

export class CreateOrderFormComponent implements OnInit {
  private ui: Observable<UiState>
  public formGroup: FormGroup
  public allRoles: Array<Role>
  public allUsers: Array<User>
  public oneUser: User | undefined
  public allCustomers: Array<Customer>
  public allPackages: Array<Package>
  public onePackage: Package | undefined
  public orderProcess: Array<any>
  public beneficiariesAmount: number

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private modalPrimeNg: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    if (this.orderProcess === undefined) {
      this.store.dispatch(new GetAllPackagesRequest)
      this.store.dispatch(new GetAllCustomerRequest)
      this.store.dispatch(new GetAllRoleRequest)
      this.store.dispatch(new GetUsersRequest)
    }

    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.allUsers = state.allUsers.data
      this.allCustomers = state.allCustomers.data
      this.allPackages = state.allPackages.data
      this.orderProcess = state.orderProcess.data
    })

    this.formGroup = this.fb.group({
      document: ['', Validators.required],
      packageId: [null, Validators.required],
      beneficiariesAmount: [null, Validators.required],
      titularAsBeneficiarie: [false]
    })

    if (this.orderProcess !== undefined) {
      if (this.orderProcess[0].beneficiaries.length > 0) {
        this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
      } else {
        if (this.orderProcess[0].order.beneficiaries !== undefined) {
          this.beneficiariesAmount = this.orderProcess[0].order.beneficiaries
        }
      }
      this.formGroup.setValue({
        document: this.orderProcess[0].order.customer.document,
        packageId: this.orderProcess[0].order.package.packageId,
        beneficiariesAmount: this.beneficiariesAmount,
        titularAsBeneficiarie: false
      })
    }
  }

  cancel(event: Event) {
    if (this.orderProcess !== undefined) {
      if (this.orderProcess[0].beneficiaries.length > 0) {
        this.confirmationService.confirm({
          target: event.target,
          message: '¿Estás seguro? Perderás toda la información previamente ingresada.',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Sí, salir',
          rejectButtonStyleClass: 'p-button-outlined',
          rejectIcon: 'pi pi-times',
          acceptLabel: 'Permanecer',
          acceptIcon: 'pi pi-check',
          reject: () => {
            this.modalPrimeNg.close()
          }
        })
      } else {
        this.modalPrimeNg.close()
      }
    } else {
      this.modalPrimeNg.close()
    }
  }

  //<--- VALIDATIONS --->

  validForm(): boolean {
    return this.formGroup.valid &&
      this.formGroup.value.document !== '' && this.formGroup.value.PackageId !== 0 &&
      this.formGroup.value.beneficiariesAmount > 0 && !this.validateCustomerId() && !this.validateRole() &&
      this.validateBeneficiaries() && this.validateBeneficiariesAmount() && this.validateExistingBeneficiariesAmount() && !this.validateStatus()
  }

  validateCustomerId(): boolean {
    if (this.formGroup.value.document.length >= 8) {
      if (this.allCustomers.find(c => c.document === this.formGroup.value.document) === undefined) {
        return true
      }
    }
    return false
  }

  validateRole(): boolean {
    if (this.formGroup.value.document.length >= 8) {
      const oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
      if (oneCustomer !== undefined) {
        this.oneUser = this.allUsers.find(u => u.userId === oneCustomer.userId)
        if (this.oneUser !== undefined) {
          const oneRole = this.allRoles.find(r => r.roleId === this.oneUser.roleId)
          if (oneRole !== undefined) {
            if (oneRole.name !== 'Cliente') {
              return true
            }
          }
        }
      }
    }
    return false
  }

  validateStatus(): boolean {
    if (!this.validateRole()) {
      if (this.oneUser !== undefined) {
        if (this.oneUser.status === 0) {
          return true
        }
      }
    }
    return false
  }

  validateBeneficiaries(): boolean {
    if (this.formGroup.value.packageId !== 0) {
      this.onePackage = this.allPackages.find(p => p.packageId === this.formGroup.value.packageId)
      if (this.onePackage !== undefined) {
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
    if (this.orderProcess !== undefined) {
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
      if (this.orderProcess !== undefined) {
        const oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
        const beneficiaries: Array<Customer> = []
        for (const element of this.orderProcess[0].beneficiaries) {
          if (element !== undefined) {
            const exists = beneficiaries.find(b => b.document === element.document)
            if (exists === undefined) {
              beneficiaries.push(element)
            }
          }
        }
        if (beneficiaries.length > 0) {
          if (this.formGroup.value.document !== this.orderProcess[0].order.customer.document) {
            const exists = beneficiaries.find(b => b.document === this.formGroup.value.document)
            if (exists === undefined) {
              const index = beneficiaries.indexOf(this.orderProcess[0].order.customer)
              if (index !== undefined) {
                beneficiaries.splice(index, 1)
                beneficiaries.push(oneCustomer)
              }
            }
          }
        }
        const orderProcess = ([{
          action: 'CreateOrder',
          order: {
            customer: oneCustomer,
            package: this.onePackage,
            beneficiaries: this.formGroup.value.beneficiariesAmount
          },
          beneficiaries: beneficiaries
        }])
        this.modalPrimeNg.close()
        this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
      } else {
        const oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
        if (this.formGroup.value.titularAsBeneficiarie) {
          console.log('true');
          const beneficiaries: Array<any> = [oneCustomer]
          const orderProcess = [{
            action: 'CreateOrder',
            order: {
              customer: oneCustomer,
              package: this.onePackage,
              beneficiaries: this.formGroup.value.beneficiariesAmount
            },
            beneficiaries: beneficiaries,
          }]
          this.modalPrimeNg.close()
          this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
        } else {
          console.log('false');
          const orderProcess = [{
            action: 'CreateOrder',
            order: {
              customer: oneCustomer,
              package: this.onePackage,
              beneficiaries: this.formGroup.value.beneficiariesAmount
            },
            beneficiaries: {},
          }]
          this.modalPrimeNg.close()
          this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
        }
      }
    }
  }
}
