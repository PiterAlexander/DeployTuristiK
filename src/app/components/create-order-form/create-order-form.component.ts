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
import { OpenModalCreateOrderDetail } from '@/store/ui/actions';

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
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.allUsers = state.allUsers.data
      this.allCustomers = state.allCustomers.data
      this.allPackages = state.allPackages.data
      this.orderProcess = state.orderProcess.data
    })

    this.formGroup = this.fb.group({
      document: ['',
        [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15)]],
      packageId: [null, [Validators.required]],
      beneficiariesAmount: [null,
        [Validators.required,
        Validators.min(1)]],
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
    const ejemploDeNodo: string = 'primer nodo' // NODO 1 DESPLIEGA NODO 2Q
    if (this.orderProcess !== undefined) { // NODO 2 (SI SE CUMPLE LA CONDICIÓN DESPLIEGA NODO 3, SINO DESPLIEGA NODO 7)
      if (this.orderProcess[0].beneficiaries.length > 0) { // NODO 3 (SI SE CUMPLE LA CONDICIÓN DESPLIEGA NODO 4, SINO DESPLIEGA NODO 5)
        this.confirmationService.confirm({ // NODO 4 DESPLIEGA NODO 9
          target: event.target,
          header: '¿Está seguro de regresar?',
          message: 'Perderá toda la información previamente ingresada.',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Sí, regresar',
          rejectButtonStyleClass: 'p-button-outlined',
          rejectIcon: 'pi pi-times',
          acceptLabel: 'Permanecer',
          acceptIcon: 'pi pi-check',
          reject: () => {
            this.modalPrimeNg.close()
          }
        })
      } else { // NODO 5, DESPLIEGA NODO 6
        this.modalPrimeNg.close() // NODO 6, DESPLIEGA NODO 9
      }
    } else { // NODO 7, DESPLIEGA NODO 8
      this.modalPrimeNg.close() // NODO 8, DESPLIEGA NODO 9
    }

    // NODO 9 (SERÍA EL FINAL DEL MÉTODO)
  }

  //<--- VALIDATIONS --->

  validForm(): boolean {
    return this.formGroup.valid &&
      this.formGroup.value.document !== '' && this.formGroup.value.PackageId !== 0 &&
      this.formGroup.value.beneficiariesAmount > 0 && !this.validateCustomerId() && !this.validateRole() &&
      this.validateBeneficiaries() && this.validateExistingBeneficiariesAmount() && !this.validateStatus() && this.validateOnlyNumbersForBeneficiaries()
  }

  validateOnlyNumbers(): boolean {
    const regularExpresion = /^[0-9]+$/;
    if (this.formGroup.value.document.length >= 8 && !this.validateRole() && !this.validateStatus() && !this.validateCustomerId()) {
      return regularExpresion.test(this.formGroup.value.document)
    }
    return true
  }

  validateOnlyNumbersForBeneficiaries(): boolean {
    const regularExpresion = /^[0-9]+$/;
    if (this.formGroup.value.beneficiariesAmount !== null && this.validateBeneficiaries() && this.validateExistingBeneficiariesAmount()) {
      return regularExpresion.test(this.formGroup.value.beneficiariesAmount)
    }
    return true
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
    if (this.formGroup.value.document.length >= 8) {
      if (!this.validateRole() && !this.validateCustomerId()) {
        if (this.oneUser !== undefined) {
          if (this.oneUser.status === 2) {
            return true
          }
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

  adjustPriceAccordingToAge(date: Date): number {
    const currenDate = new Date();
    const birthdate = new Date(date);
    const milisecondsAge = currenDate.getTime() - birthdate.getTime();
    const yearAge = milisecondsAge / (1000 * 60 * 60 * 24 * 365.25);

    if (yearAge < 5) {
      return this.onePackage.aditionalPrice
    } else if (yearAge >= 5 && yearAge < 10) {
      return this.onePackage.price * 0.70
    } else {
      return this.onePackage.price
    }
  }

  //<------------------->

  next() {
    if (!this.formGroup.invalid) {
      if (this.orderProcess !== undefined) {
        let wasChanged: boolean = false
        if (this.formGroup.value.packageId !== this.orderProcess[0].order.package.packageId) {
          wasChanged = true
        }
        const oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
        const beneficiariesPriceConverted: Array<any> = []
        let beneficiaries: Array<any> = []
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
              const currenTitular = beneficiaries.find(b => b.customerId === this.orderProcess[0].order.customer.customerId)
              const index = beneficiaries.indexOf(currenTitular)
              beneficiaries.splice(index, 1)
              if (index !== undefined) {
                const titular: any = {
                  customerId: oneCustomer.customerId,
                  name: oneCustomer.name,
                  lastName: oneCustomer.lastName,
                  document: oneCustomer.document,
                  birthDate: oneCustomer.birthDate,
                  phoneNumber: oneCustomer.phoneNumber,
                  address: oneCustomer.address,
                  eps: oneCustomer.eps,
                  user: oneCustomer.user,
                  price: this.adjustPriceAccordingToAge(oneCustomer.birthDate),
                  addToFt: false
                }
                if (wasChanged) {
                  beneficiariesPriceConverted.push(titular)
                } else {
                  beneficiaries.push(titular)
                }
              }
            }
          }
          if (wasChanged) {
            for (const element of beneficiaries) {
              if (element.customerId !== undefined) {
                const oneBeneficiarie: any = {
                  customerId: element.customerId,
                  name: element.name,
                  lastName: element.lastName,
                  document: element.document,
                  birthDate: element.birthDate,
                  phoneNumber: element.phoneNumber,
                  address: element.address,
                  eps: element.eps,
                  user: element.user,
                  price: this.adjustPriceAccordingToAge(element.birthDate),
                  addToFt: element.addToFt
                }
                beneficiariesPriceConverted.push(oneBeneficiarie)
              } else {
                const oneBeneficiarie: any = {
                  name: element.name,
                  lastName: element.lastName,
                  document: element.document,
                  birthDate: element.birthDate,
                  phoneNumber: element.phoneNumber,
                  address: element.address,
                  eps: element.eps,
                  user: element.user,
                  price: this.adjustPriceAccordingToAge(element.birthDate),
                  addToFt: element.addToFt
                }
                beneficiariesPriceConverted.push(oneBeneficiarie)
              }
            }
            beneficiaries = beneficiariesPriceConverted
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
          const beneficiaries: Array<any> = [{
            customerId: oneCustomer.customerId,
            name: oneCustomer.name,
            lastName: oneCustomer.lastName,
            document: oneCustomer.document,
            birthDate: oneCustomer.birthDate,
            phoneNumber: oneCustomer.phoneNumber,
            address: oneCustomer.address,
            eps: oneCustomer.eps,
            user: oneCustomer.user,
            price: this.onePackage.price,
            addToFt: false
          }]
          const orderProcess = [{
            action: 'CreateOrder',
            order: {
              customer: oneCustomer,
              package: this.onePackage,
              beneficiaries: parseInt(this.formGroup.value.beneficiariesAmount)
            },
            beneficiaries: beneficiaries,
          }]
          this.modalPrimeNg.close()
          this.store.dispatch(new OpenModalCreateOrderDetail({ ...orderProcess }))
        } else {
          const orderProcess = [{
            action: 'CreateOrder',
            order: {
              customer: oneCustomer,
              package: this.onePackage,
              beneficiaries: parseInt(this.formGroup.value.beneficiariesAmount)
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
