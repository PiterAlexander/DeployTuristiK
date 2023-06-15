import { Costumer } from '@/models/costumer';
import { Order } from '@/models/order';
import { OrderDetail } from '@/models/orderDetail';
import { Package } from '@/models/package';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import { CreateOrderData, GetAllCostumerRequest, GetAllRoleRequest, OpenModalCreateOrder, OpenModalCreatePayment, OpenModalOrderDetails } from '@/store/ui/actions';
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
  public oneOrder: Order
  public orderDetailCostumers: Array<Costumer> = []
  public allEps: Array<string> = ['COOSALUD EPS-S', 'NUEVA EPS', 'MUTUAL SER', 'ALIANSALUD EPS', 'SALUD TOTAL EPS S.A.', 'EPS SANITAS', 'EPS SURA', 'FAMISANAR', 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'SALUD MIA', 'COMFENALCO VALLE', 'COMPENSAR EPS', 'EPM - EMPRESAS PUBLICAS MEDELLIN', 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'CAJACOPI ATLANTICO', 'CAPRESOCA', 'COMFACHOCO', 'COMFAORIENTE', 'EPS FAMILIAR DE COLOMBIA', 'ASMET SALUD', 'ECOOPSOS ESS EPS-S', 'EMSSANAR E.S.S', 'CAPITAL SALUD EPS-S', 'SAVIA SALUD EPS', 'DUSAKAWI EPSI', 'ASOCOACION INDIGENA DEL CAUCA EPSI', 'ANAS WAYUU EPSI', 'PIJAOS SALUD EPSI', 'SALUD BOLIVAR EPS SAS', 'OTRA']
  public beneficiariesAmount: number

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCostumerRequest)
    this.store.dispatch(new GetAllRoleRequest)
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.oneOrder = state.oneOrder.data
      this.allCostumers = state.allCostumers.data
      this.allRoles = state.allRoles.data
      this.oneRole = this.allRoles.find(r => r.name === 'Beneficiario')
      console.log(this.oneOrder);

      if (this.oneOrder != null) {
        this.orderDetails = state.oneOrder.data.orderDetail
        for (const element of this.orderDetails) {
          const costumer = this.allCostumers.find(c => c.costumerId === element.beneficiaryId)
          if (costumer != undefined) {
            this.orderDetailCostumers.push(costumer)
          }
        }
        this.onePackage = this.oneOrder.package
        this.beneficiariesAmount = 1
      } else {
        this.orderProcess = state.orderProcess.data
        this.beneficiariesAmount = this.orderProcess[0].order.beneficiaries
        this.onePackage = this.orderProcess[0].order.package
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
  }


  back() {
    if (this.oneOrder != null) {
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalOrderDetails(this.oneOrder))
    } else {
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreateOrder)
    }
  }

  deleteBeneficiarie(document: string) {
    const oneCostumer = this.beneficiaries.find(c => c.document === document)
    const index = this.beneficiaries.indexOf(oneCostumer)
    this.beneficiaries.splice(index, 1)
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
        timer: 2500,
        timerProgressBar: true
      })
    }
  }

  //<--- VALIDATIONS --->

  validForm(): boolean {
    if (this.beneficiariesForm()) {
      return this.formGroup.value.name != '' &&
        this.formGroup.value.phoneNumber != '' &&
        this.formGroup.value.birthdate != '' &&
        this.formGroup.value.eps != 0 && !this.alreadyExists() && !this.costumerInformation() && !this.formGroup.invalid
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
    if (this.formGroup.value.document >= 8) {
      this.oneCostumer = this.allCostumers.find(c => c.document === this.formGroup.value.document)
      if (this.oneCostumer != undefined) {
        return true
      }
    }
    return false
  }

  fillCostumerInformation() {
    this.beneficiaries.push(this.oneCostumer)
    this.formGroup.reset()
  }

  alreadyExists(): boolean {
    if (this.oneOrder != null) {
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
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Todos los campos son obligatorios',
          text: 'Por favor rellene cada uno de los campos.',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        })
      }
    }
  }

  next() {
    if (this.oneOrder != null) {
      this.orderProcess = [{
        order: {
          orderId: this.oneOrder.orderId,
          packageId: this.oneOrder.packageId,
          costumerId: this.oneOrder.costumerId,
          totalCost: this.oneOrder.package.price * this.beneficiaries.length
        },
        beneficiaries: this.beneficiaries,
        payment: {}
      }]
      this.store.dispatch(new CreateOrderData(this.orderProcess))
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreatePayment)
    } else {
      this.orderProcess = [{
        order: this.orderProcess[0].order,
        beneficiaries: this.beneficiaries,
        payment: {}
      }]
      this.store.dispatch(new CreateOrderData(this.orderProcess))
      this.modalService.dismissAll();
      this.store.dispatch(new OpenModalCreatePayment)
    }
  }
}