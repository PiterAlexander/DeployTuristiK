import { Costumer } from '@/models/costumer';
import { OrderDetail } from '@/models/orderDetail';
import { Package } from '@/models/package';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { EditCostumerRequest, GetAllRoleRequest, OpenModalCreateOrder, OpenModalCreatePayment, OpenModalListFrequentTravelersToOrders, OpenModalOrderDetails } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

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
  public allCostumers: Array<Costumer>
  public orderDetails: Array<OrderDetail>
  public allRoles: Array<Role>
  public oneCostumer: Costumer
  public onePackage: Package
  public oneRole: Role
  public orderDetailCostumers: Array<Costumer> = []
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public beneficiariesAmount: number

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllRoleRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.orderProcess = state.orderProcess.data
      this.allCostumers = state.allCostumers.data
      this.allRoles = state.allRoles.data
      if (this.allRoles != undefined) {
        this.oneRole = this.allRoles.find(r => r.name === 'Beneficiario')
      }
    })
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      birthdate: ['', Validators.required],
      eps: [0, Validators.required],
    });
    if (this.orderProcess != undefined) {
      if (this.orderProcess[0].action === 'CreateOrderDetail') {
        this.orderDetails = this.orderProcess[0].order.orderDetail
        for (const element of this.orderDetails) {
          const costumer = this.allCostumers.find(c => c.costumerId === element.beneficiaryId)
          if (costumer != undefined) {
            this.orderDetailCostumers.push(costumer)
          }
        }
        this.onePackage = this.orderProcess[0].order.package
        if (this.orderProcess[0].beneficiaries != undefined) {
          if (this.orderProcess[0].beneficiaries.length > 0) {
            for (const element of this.orderProcess[0].beneficiaries) {
              if (element != undefined) {
                const exists = this.beneficiaries.find(b => b.document === element.document)
                if (exists == undefined) {
                  this.beneficiaries.push(element)
                }
              }
            }
            this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
          } else {
            this.beneficiariesAmount = 1
          }
        } else {
          this.beneficiariesAmount = 1
        }
      } else if ((this.orderProcess[0].action === 'EditOrderDetail')) {
        this.beneficiariesAmount = 1
        const birthDateValue = this.orderProcess[0].costumer.birthDate.split('T')[0]
        this.formGroup.setValue({
          name: this.orderProcess[0].costumer.name,
          lastName: this.orderProcess[0].costumer.lastName,
          document: this.orderProcess[0].costumer.document,
          address: this.orderProcess[0].costumer.address,
          phoneNumber: this.orderProcess[0].costumer.phoneNumber,
          birthdate: birthDateValue,
          eps: this.orderProcess[0].costumer.eps,
        })
      } else {
        this.onePackage = this.orderProcess[0].order.package
        if (this.orderProcess[0].beneficiaries.length > 0) {
          for (const element of this.orderProcess[0].beneficiaries) {
            if (element != undefined) {
              const exists = this.beneficiaries.find(b => b.document === element.document)
              if (exists == undefined) {
                this.beneficiaries.push(element)
              }
            }
          }
          if (this.orderProcess[0].order.beneficiaries > this.orderProcess[0].beneficiaries.length) {
            this.beneficiariesAmount = this.orderProcess[0].order.beneficiaries
          } else {
            this.beneficiariesAmount = this.orderProcess[0].beneficiaries.length
          }
        } else {
          this.beneficiariesAmount = this.orderProcess[0].order.beneficiaries
        }
      }
    }
  }


  back() {
    if (this.orderProcess[0].action === 'CreateOrderDetail') {
      if (this.beneficiaries.length > 0) {
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
            this.store.dispatch(new OpenModalOrderDetails(this.orderProcess[0].order))
          }
        })
      } else {
        this.modalService.dismissAll();
        this.store.dispatch(new OpenModalOrderDetails(this.orderProcess[0].order))
      }
    } else if (this.orderProcess[0].action === 'EditOrderDetail') {
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalOrderDetails(this.orderProcess[0].order))
    } else {
      this.orderProcess = [{
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
        payment: {}
      }]
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreateOrder(this.orderProcess))
    }
  }

  frequentTravelers() {
    this.orderProcess = [{
      order: this.orderProcess[0].order,
      beneficiaries: this.beneficiaries,
      payment: {}
    }]
    this.modalService.dismissAll();
    this.store.dispatch(new OpenModalListFrequentTravelersToOrders(this.orderProcess))
  }

  deleteBeneficiarie(document: string) {
    const oneCostumer = this.beneficiaries.find(c => c.document === document)
    const index = this.beneficiaries.indexOf(oneCostumer)
    this.beneficiaries.splice(index, 1)
    if (this.beneficiariesAmount > 1) {
      this.beneficiariesAmount--
    }
  }

  addAnotherBeneficiarie() {
    if (this.onePackage.availableQuotas >= this.beneficiariesAmount + 1) {
      this.beneficiariesAmount++
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

  reduceBeneficiariesAmount() {
    if (this.beneficiariesAmount > this.beneficiaries.length) {
      if (this.beneficiariesAmount == 1) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Debe haber al menos un beneficiario.',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        })
      } else {
        this.beneficiariesAmount--
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Debes eliminar uno de tus beneficiarios antes de completar esta acción.',
        showConfirmButton: true,
        confirmButtonText: 'Volver'
      })
    }
  }

  //<--- VALIDATIONS --->

  validForm(): boolean {
    if (this.beneficiariesForm()) {
      return this.formGroup.value.name != '' &&
        this.formGroup.value.phoneNumber != '' &&
        this.formGroup.value.birthdate != '' &&
        this.formGroup.value.eps != 0 && !this.alreadyExists() && !this.costumerInformation() &&
        !this.formGroup.invalid && !this.alreadyExistsFromEdit()
    } else {
      return true
    }
  }

  beneficiariesForm() {
    if (this.beneficiaries.length === this.beneficiariesAmount) {
      return false
    }
    return true
  }

  costumerInformation(): boolean {
    if (this.orderProcess[0].action != 'EditOrderDetail') {
      if (this.formGroup.value.document >= 8) {
        this.oneCostumer = this.allCostumers.find(c => c.document === this.formGroup.value.document)
        if (this.oneCostumer != undefined) {
          return true
        }
      }
    }
    return false
  }

  alreadyExistsFromEdit(): boolean {
    if (this.orderProcess[0].action === 'EditOrderDetail') {
      if (this.formGroup.value.document >= 8) {
        this.oneCostumer = this.allCostumers.find(c => c.document === this.formGroup.value.document)
        if (this.oneCostumer != undefined) {
          if (this.oneCostumer.document === this.orderProcess[0].costumer.document) {
            return false
          }
          return true
        }
      }
    }
    return false
  }

  fillCostumerInformation() {
    this.beneficiaries.push(this.oneCostumer)
    this.formGroup.reset()
  }

  alreadyExists(): boolean {
    if (this.orderProcess[0].action != 'EditOrderDetail') {
      if (this.orderProcess[0].action === 'CreateOrderDetail') {
        const oneCostumer = this.orderDetailCostumers.find(b => b.document === this.formGroup.value.document)
        const anotherCostumer = this.beneficiaries.find(b => b.document === this.formGroup.value.document)
        if (anotherCostumer == undefined && oneCostumer == undefined) {
          return false
        }
      } else {
        const oneCostumer = this.beneficiaries.find(b => b.document === this.formGroup.value.document)
        if (oneCostumer == undefined) {
          return false
        }
      }
      return true
    }
  }

  showBeneficiariesTable(): boolean {
    if (this.beneficiaries.length > 0) {
      return true
    }
    return false
  }
  //<------------------->

  add() {
    if (this.beneficiaries.length < this.beneficiariesAmount) {
      if (!this.formGroup.invalid) {
        const user: User = {
          userName: 'pakitours',
          email: 'pakitours@pakitours.com',
          password: 'pakitours',
          status: 2,
          roleId: this.oneRole.roleId,
        }
        this.beneficiaries.push({
          name: this.formGroup.value.name,
          lastName: this.formGroup.value.lastName,
          document: this.formGroup.value.document,
          address: this.formGroup.value.address,
          phoneNumber: this.formGroup.value.phoneNumber,
          birthDate: this.formGroup.value.birthdate,
          eps: this.formGroup.value.eps,
          User: user,
        })
        this.formGroup.reset()
      }
    }
  }

  next() {
    if (this.orderProcess[0].action === 'CreateOrderDetail') {
      this.orderProcess = [{
        action: 'CreateOrderDetail',
        order: {
          orderId: this.orderProcess[0].order.orderId,
          package: this.orderProcess[0].order.package,
          costumerId: this.orderProcess[0].order.costumerId,
          totalCost: this.orderProcess[0].order.package.price * this.beneficiaries.length
        },
        beneficiaries: this.beneficiaries,
        payment: {}
      }]
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreatePayment(this.orderProcess))
    } else if (this.orderProcess[0].action === 'EditOrderDetail') {
      const costumer: Costumer = {
        costumerId: this.orderProcess[0].costumer.costumerId,
        name: this.formGroup.value.name,
        lastName: this.formGroup.value.lastName,
        document: this.formGroup.value.document,
        birthDate: this.formGroup.value.birthdate,
        phoneNumber: this.formGroup.value.phoneNumber,
        address: this.formGroup.value.address,
        eps: this.formGroup.value.eps,
        userId: this.orderProcess[0].costumer.userId
      }
      this.store.dispatch(new EditCostumerRequest(costumer))
      this.modalService.dismissAll();
      Swal.fire({
        icon: 'success',
        title: '¡Beneficiario editado exitosamente!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } else {
      this.orderProcess = [{
        action: 'CreateOrder',
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
        payment: {}
      }]
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreatePayment(this.orderProcess))
    }
  }
}
