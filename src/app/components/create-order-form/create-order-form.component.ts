import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { Customer } from '@/models/customer';
import { Package } from '@/models/package';
import { Router } from '@angular/router';
import { differenceInDays, differenceInMonths, isBefore } from 'date-fns';
import { GetAllCustomerRequest, GetAllOrdersRequest, GetAllPackagesRequest, GetAllRoleRequest, GetUsersRequest, SaveOrderProcess } from '@/store/ui/actions';
import { Order } from '@/models/order';
import { ApiService } from '@services/api.service';

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
  public allOrders: Array<Order>
  public oneUser: User | undefined
  public allCustomers: Array<Customer>
  public allPackages: Array<Package>
  public onePackage: Package | undefined
  public orderProcess: any
  public beneficiariesAmount: number
  public allDocuments: Array<string> = []
  public results: string[];
  public packagesToShow: Array<Package> = []

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllRoleRequest)
    this.store.dispatch(new GetUsersRequest)
    this.store.dispatch(new GetAllOrdersRequest)
    this.store.dispatch(new GetAllCustomerRequest)
    this.store.dispatch(new GetAllPackagesRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.allRoles = state.allRoles.data
      this.allUsers = state.allUsers.data
      this.allCustomers = state.allCustomers.data
      this.allOrders = state.allOrders.data
      this.allPackages = state.allPackages.data
      this.orderProcess = state.orderProcess.data
      if (this.allCustomers !== undefined) {
        for (const element of this.allCustomers) {
          if (this.allUsers !== undefined) {
            const oneUser = this.allUsers.find(u => u.userId === element.userId)
            if (oneUser !== undefined && oneUser.status === 1) {
              if (this.allRoles !== undefined) {
                const oneRole = this.allRoles.find(r => r.roleId === oneUser.roleId)
                if (oneRole !== undefined && oneRole.name === 'Cliente') {
                  if (this.allDocuments !== undefined) {
                    const exists = this.allDocuments.find(d => d === element.document)
                    if (exists === undefined) {
                      this.allDocuments.push(element.document)
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (this.allPackages !== undefined) {
        for (const element of this.allPackages) {
          if (element !== undefined) {
            // Obtener la fecha actual
            const currentDate = new Date();
            const departureDateConverted = new Date(element.departureDate);

            // Comprobar si la fecha actual es después de departureDate
            if (isBefore(currentDate, departureDateConverted)) {
              if (element.transport === 1) {
                // Calcular la diferencia en meses
                const monthsDifference = differenceInMonths(departureDateConverted, currentDate);

                // Si la diferencia es de un mes o más, ejecuta tu código aquí
                if (monthsDifference >= 1) {
                  // Tu código aquí
                  const alreadyExist = this.packagesToShow.find(p => p.packageId === element.packageId)
                  if (alreadyExist === undefined) {
                    this.packagesToShow.push(element)
                  }
                }
              } else {
                // Calcular la diferencia en días
                const daysDifference = differenceInDays(departureDateConverted, currentDate);

                // Si la diferencia es de dos días o más, ejecuta tu código aquí
                if (daysDifference >= 2) {
                  // Tu código aquí
                  const alreadyExist = this.packagesToShow.find(p => p.packageId === element.packageId)
                  if (alreadyExist === undefined) {
                    this.packagesToShow.push(element)
                  }
                }
              }
            }
          }
        }
      }
    })

    this.formGroup = this.fb.group({
      document: [null,
        [Validators.required,
        Validators.maxLength(15)]],
      packageId: [null, [Validators.required]],
      beneficiariesAmount: [null,
        [Validators.required,
        Validators.min(1)]],
      titularAsBeneficiarie: [false]
    })

    if (this.orderProcess !== undefined) {
      if (this.orderProcess.beneficiaries.length > this.orderProcess.order.takenQuotas) {
        this.beneficiariesAmount = this.orderProcess.beneficiaries.length
      } else {
        if (this.orderProcess.order.beneficiaries !== undefined) {
          this.beneficiariesAmount = this.orderProcess.order.takenQuotas
        }
      }
      this.formGroup.setValue({
        document: this.orderProcess.order.customer.document,
        packageId: this.orderProcess.order.package.packageId,
        beneficiariesAmount: this.beneficiariesAmount,
        titularAsBeneficiarie: false
      })
    }
  }

  alreadyHasAnOrder(): boolean {
    const oneCustomer: Customer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
    const onePackage: Package = this.allPackages.find(p => p.packageId === this.formGroup.value.packageId)
    if (oneCustomer !== undefined && onePackage !== undefined) {
      if (this.allOrders !== undefined) {
        const customerOrders: Array<Order> = []
        for (const order of this.allOrders) {
          if (order !== undefined && order.customerId === oneCustomer.customerId) {
            customerOrders.push(order)
          }
        }
        if (customerOrders.length > 0) {
          for (const order of customerOrders) {
            if (order !== undefined && order.packageId === onePackage.packageId) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  searchDocument(event: any) {
    const filtered: any[] = [];
    const query = event.query.toLowerCase();
    for (let i = 0; i < this.allDocuments.length; i++) {
      const Eps = this.allDocuments[i].toLowerCase();
      if (Eps.includes(query)) {
        filtered.push(this.allDocuments[i]);
      }
    }
    this.results = filtered
  }

  cancel() {
    if (this.orderProcess !== undefined) {
      if (this.orderProcess.beneficiaries.length > 0) {
        this.confirmationService.confirm({
          key: 'confirmation-message',
          header: '¿Está seguro de regresar?',
          message: 'Perderá toda la información previamente ingresada.',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Permanecer',
          rejectIcon: 'pi pi-check',
          acceptLabel: 'Sí, regresar',
          acceptIcon: 'pi pi-times',
          acceptButtonStyleClass: 'p-button-outlined',
          accept: () => {
            this.editPackage(0, true, this.orderProcess.order.takenQuotas)
            this.store.dispatch(new SaveOrderProcess(undefined))
            this.router.navigate(['Home/Pedidos']);
          }
        })
      } else {
        this.editPackage(0, true, this.orderProcess.order.takenQuotas)
        this.store.dispatch(new SaveOrderProcess(undefined))
        this.router.navigate(['Home/Pedidos']);
      }
    } else {
      this.store.dispatch(new SaveOrderProcess(undefined))
      this.router.navigate(['Home/Pedidos']);
    }
  }

  //<--- VALIDATIONS --->

  validForm(): boolean {
    return this.formGroup.valid &&
      this.formGroup.value.document !== null && this.formGroup.value.PackageId !== 0 &&
      this.formGroup.value.beneficiariesAmount > 0 &&
      this.validateBeneficiaries() && this.validateExistingBeneficiariesAmount() && this.validateOnlyNumbersForBeneficiaries() && !this.alreadyHasAnOrder()
  }

  validateOnlyNumbersForBeneficiaries(): boolean {

    const regularExpresion = /^[0-9]+$/;
    if (this.formGroup.value.beneficiariesAmount !== null && this.formGroup.value.beneficiariesAmount > 0 && this.validateBeneficiaries() && this.validateExistingBeneficiariesAmount()) {
      return regularExpresion.test(this.formGroup.value.beneficiariesAmount)
    }
    return true
  }

  validateBeneficiaries(): boolean {
    if (this.formGroup.value.packageId !== 0) {
      let takenQuotas: number
      if (this.orderProcess !== undefined) {
        takenQuotas = this.orderProcess.order.takenQuotas
      } else {
        takenQuotas = 0
      }
      this.onePackage = this.allPackages.find(p => p.packageId === this.formGroup.value.packageId)
      if (this.onePackage !== undefined) {
        if (this.formGroup.value.beneficiariesAmount <= this.onePackage.availableQuotas + takenQuotas) {
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
      } else if (this.orderProcess.beneficiaries.length > 0) {
        if (this.formGroup.value.beneficiariesAmount < this.orderProcess.beneficiaries.length) {
          return false
        }
      }
    }
    return true
  }

  adjustPriceAccordingToAge(date: Date): number {
    const currenDate = new Date();
    const birthdate = new Date(date);
    const milisecondsAge = currenDate.getTime() - birthdate.getTime();
    const yearAge = milisecondsAge / (1000 * 60 * 60 * 24 * 365.25);

    const price: number = this.onePackage.price + this.onePackage.aditionalPrice
    if (yearAge < 5) {
      return this.onePackage.aditionalPrice
    } else if (yearAge >= 5 && yearAge < 10) {
      return price * 0.70
    } else {
      return price
    }
  }

  //<------------------->

  next() {
    if (!this.formGroup.invalid) {
      if (this.orderProcess !== undefined) {
        let wasChanged: boolean = false
        if (this.formGroup.value.packageId !== this.orderProcess.order.package.packageId) {
          wasChanged = true
        }
        const oneCustomer = this.allCustomers.find(c => c.document === this.formGroup.value.document)
        const beneficiariesPriceConverted: Array<any> = []
        let beneficiaries: Array<any> = []
        for (const element of this.orderProcess.beneficiaries) {
          if (element !== undefined) {
            const exists = beneficiaries.find(b => b.document === element.document)
            if (exists === undefined) {
              beneficiaries.push(element)
            }
          }
        }
        if (beneficiaries.length > 0) {
          if (this.formGroup.value.document !== this.orderProcess.order.customer.document) {
            const exists = beneficiaries.find(b => b.document === this.formGroup.value.document)
            if (exists === undefined) {
              const currenTitular = beneficiaries.find(b => b.customerId === this.orderProcess.order.customer.customerId)
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
        if (this.formGroup.value.beneficiariesAmount < this.orderProcess.order.takenQuotas) {
          this.editPackage(this.formGroup.value.beneficiariesAmount, true)
        } else if (this.formGroup.value.beneficiariesAmount > this.orderProcess.order.takenQuotas) {
          this.editPackage(this.formGroup.value.beneficiariesAmount, false)
        }
        const orderProcess = ({
          action: 'CreateOrder',
          order: {
            customer: oneCustomer,
            package: this.onePackage,
            beneficiaries: this.formGroup.value.beneficiariesAmount,
            takenQuotas: this.formGroup.value.beneficiariesAmount
          },
          beneficiaries: beneficiaries
        })
        this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
        this.router.navigate(['Home/ProcesoBeneficiarios']);
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
            price: this.onePackage.price + this.onePackage.aditionalPrice,
            addToFt: false
          }]
          this.editPackage(this.formGroup.value.beneficiariesAmount, false)
          const orderProcess = {
            action: 'CreateOrder',
            order: {
              customer: oneCustomer,
              package: this.onePackage,
              beneficiaries: this.formGroup.value.beneficiariesAmount,
              takenQuotas: this.formGroup.value.beneficiariesAmount
            },
            beneficiaries: beneficiaries,
          }
          this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
          this.router.navigate(['Home/ProcesoBeneficiarios']);
        } else {

          this.editPackage(this.formGroup.value.beneficiariesAmount, false)
          const orderProcess = {
            action: 'CreateOrder',
            order: {
              customer: oneCustomer,
              package: this.onePackage,
              beneficiaries: this.formGroup.value.beneficiariesAmount,
              takenQuotas: this.formGroup.value.beneficiariesAmount
            },
            beneficiaries: {},
          }
          this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
          this.router.navigate(['Home/ProcesoBeneficiarios']);
        }
      }
    }
  }

  editPackage(beneficiaries: number, toAdd: boolean, allQuotasTaken?: number) {
    let updatePackage: Package
    if (toAdd) {
      let quotasToAdd: number
      if (allQuotasTaken !== undefined) {
        quotasToAdd = allQuotasTaken
      } else {
        quotasToAdd = this.orderProcess.order.takenQuotas - beneficiaries
      }
      updatePackage = {
        packageId: this.onePackage.packageId,
        name: this.onePackage.name,
        destination: this.onePackage.destination,
        details: this.onePackage.details,
        transport: this.onePackage.transport,
        hotel: this.onePackage.hotel,
        arrivalDate: this.onePackage.arrivalDate,
        departureDate: this.onePackage.departureDate,
        departurePoint: this.onePackage.departurePoint,
        totalQuotas: this.onePackage.totalQuotas,
        availableQuotas: this.onePackage.availableQuotas + quotasToAdd,
        price: this.onePackage.price,
        type: this.onePackage.type,
        status: this.onePackage.status,
        aditionalPrice: this.onePackage.aditionalPrice,
        photos: this.onePackage.photos
      }
    } else {
      let quotasToReduce: number
      if (this.orderProcess !== undefined) {
        quotasToReduce = beneficiaries - this.orderProcess.order.takenQuotas
      } else {
        quotasToReduce = beneficiaries
      }
      updatePackage = {
        packageId: this.onePackage.packageId,
        name: this.onePackage.name,
        destination: this.onePackage.destination,
        details: this.onePackage.details,
        transport: this.onePackage.transport,
        hotel: this.onePackage.hotel,
        arrivalDate: this.onePackage.arrivalDate,
        departureDate: this.onePackage.departureDate,
        departurePoint: this.onePackage.departurePoint,
        totalQuotas: this.onePackage.totalQuotas,
        availableQuotas: this.onePackage.availableQuotas - quotasToReduce,
        price: this.onePackage.price,
        type: this.onePackage.type,
        status: this.onePackage.status,
        aditionalPrice: this.onePackage.aditionalPrice,
        photos: this.onePackage.photos
      }
    }
    this.apiService.updatePackage(updatePackage.packageId, updatePackage).subscribe({
      next: (data) => {
      },
      error: (err) => {
        console.log("Error while updating: ", err)
      }
    })
    if (allQuotasTaken === undefined) {
      this.onePackage = updatePackage
    }
  }
}
