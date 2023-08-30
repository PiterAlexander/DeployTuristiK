import { Order } from '@/models/order';
import { EditOrderRequest, GetAllCustomerRequest, GetAllOrdersRequest, GetAllPackagesRequest, GetAllRoleRequest, GetUsersRequest, OpenModalCreateOrder, SaveOrderProcess } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';
import { Package } from '@/models/package';
import { DataView } from 'primeng/dataview';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '@services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
  public ui: Observable<UiState>;
  public role: any
  public user: any
  public allCustomers: Array<Customer>
  public orderProcess: any
  public oneCustomer: Customer
  public allOrders: Array<Order>
  public ordersList: Array<Order> = []
  public allPackages: Array<Package>
  public statuses: any[] = [];
  public loading: boolean = true
  public visible: boolean = true
  public packagesClients: Array<Package>
  public responsiveOptions: any

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {
    this.store.dispatch(new GetAllRoleRequest)
    this.store.dispatch(new GetUsersRequest)
    this.store.dispatch(new GetAllCustomerRequest)
    this.store.dispatch(new GetAllPackagesRequest)
    this.store.dispatch(new GetAllOrdersRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.orderProcess = state.orderProcess.data
      this.allCustomers = state.allCustomers.data
      this.allOrders = state.allOrders.data
      this.allPackages = state.allPackages.data
      this.packagesClients = state.allPackages.data.filter(
        (pkg) => pkg.availableQuotas > 0
      );
      this.compareCustomer()
    })

    if (this.orderProcess !== undefined) {
      this.store.dispatch(new SaveOrderProcess(undefined))
    }

    this.statuses = [
      { 'label': 'Pendiente', 'code': 0 },
      { 'label': 'En curso', 'code': 1 },
      { 'label': 'Pagado', 'code': 2 },
      { 'label': 'Cancelado', 'code': 3 }
    ]
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  compareCustomer() {
    if (this.role !== undefined) {
      if (this.role === 'Cliente') {
        if (this.allCustomers !== undefined) {
          this.oneCustomer = this.allCustomers.find(c => c.userId === this.user['id'])
          if (this.oneCustomer !== undefined) {
            this.fillOrdersListArray()
          }
        }
      } else {
        for (const element of this.allOrders) {
          const exists: Order = this.ordersList.find(o => o.orderId === element.orderId)
          if (exists === undefined) {
            const onePackage: Package = this.allPackages.find(p => p.packageId === element.packageId)
            const oneCustomer: Customer = this.allCustomers.find(p => p.customerId === element.customerId)
            if (onePackage !== undefined && oneCustomer !== undefined) {
              const order: Order = {
                orderId: element.orderId,
                customerId: element.customerId,
                customer: oneCustomer,
                packageId: element.packageId,
                package: onePackage,
                totalCost: element.totalCost,
                status: element.status,
                orderDate: element.orderDate,
                payment: element.payment
              }
              this.ordersList.push(order)
            }
          }
        }
      }
    }
    this.updateVisibility()
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

  fillOrdersListArray() {
    for (const element of this.allOrders) {
      if (this.oneCustomer.customerId === element.customerId) {
        const exists = this.ordersList.find(o => o.orderId === element.orderId)
        if (exists === undefined) {
          const onePackage: Package = this.allPackages.find(p => p.packageId === element.packageId)
          if (onePackage !== undefined) {
            const order: Order = {
              orderId: element.orderId,
              customerId: element.customerId,
              packageId: element.packageId,
              package: onePackage,
              totalCost: element.totalCost,
              status: element.status,
              orderDate: element.orderDate,
            }
            this.ordersList.push(order)
          }
        }
      }
    }
  }

  changeOrderStatus(order: Order) {
    if (order.status !== 3) {
      this.confirmationService.confirm({
        key: 'cancel-order-message',
        header: '¿Está seguro de cancelar este Pedido?',
        message: 'Tenga en cuenta que: <br><br>- Todas los procesos del pedido se inhabilitaran.<br>- Se le informará al titular sobre esta cancelación.<br>- Es posible revertir esta cancelación.',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'No, salir',
        rejectButtonStyleClass: 'p-button-outlined',
        rejectIcon: 'pi pi-times',
        acceptLabel: 'Sí, cancelar Pedido',
        acceptButtonStyleClass: 'p-button-danger',
        acceptIcon: 'pi pi-ban',
        accept: () => {
          const orderToUpdate: Order = {
            orderId: order.orderId,
            customerId: order.customerId,
            customer: order.customer,
            packageId: order.packageId,
            package: order.package,
            totalCost: order.totalCost,
            status: 3,
            orderDate: order.orderDate,
          }
          this.store.dispatch(new EditOrderRequest({ ...orderToUpdate }))
          const index = this.ordersList.indexOf(order)
          if (index !== -1) {
            this.ordersList.splice(index, 1)[0]; // Eliminar y obtener el elemento eliminado
            this.ordersList.splice(index, 0, orderToUpdate); // Volver a agregar en la misma posición
            this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Pedido cancelado exitosamente.' });
          }
        }
      })
    } else {
      this.confirmationService.confirm({
        key: 'cancel-order-message',
        header: '¿Está seguro de habilitar Pedido?',
        message: 'Tenga en cuenta que: <br><br>- Todas los procesos del pedido se habilitar de nuevo.<br>- Se le informará al titular sobre este cambio.',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancelar',
        rejectButtonStyleClass: 'p-button-outlined',
        rejectIcon: 'pi pi-times',
        acceptLabel: 'Sí, habilitar',
        acceptButtonStyleClass: 'p-button-primary',
        acceptIcon: 'pi pi-check',
        accept: () => {
          this.activateOrder(order)
        }
      })
    }
  }

  async activateOrder(order: Order) {
    const orderPromise: Order = await new Promise((resolve, reject) => {
      this.apiService.getOrderById(order.orderId).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    if (orderPromise) {
      let accepted: boolean = false
      let pending: boolean = false
      let addition: number = 0

      for (const element of orderPromise['payment']) {
        if (element !== undefined && element.status === 1 || element.status === 0) {
          addition += element.amount
          if (element.status === 1) {
            accepted = true
          } else {
            pending = true
          }
        }
      }
      const remainingAmount: number = orderPromise.totalCost - addition
      let orderStatus: number
      if ((accepted && pending && remainingAmount === 0) || (accepted && pending && remainingAmount > 0)) {
        orderStatus = 1
      } else if (accepted && !pending && remainingAmount === 0) {
        orderStatus = 2
      } else if ((!accepted && pending && remainingAmount === 0) || (!accepted && pending && remainingAmount > 0)) {
        orderStatus = 0
      } else if (accepted && !pending && remainingAmount > 0) {
        orderStatus = 1
      } else if (!accepted && !pending) {
        orderStatus = 0
      }

      const orderToUpdate: Order = {
        orderId: orderPromise['orderId'],
        customerId: orderPromise['customerId'],
        customer: orderPromise['customer'],
        packageId: orderPromise['packageId'],
        package: orderPromise['package'],
        totalCost: orderPromise['totalCost'],
        status: orderStatus,
        orderDate: orderPromise['orderDate']
      }
      this.store.dispatch(new EditOrderRequest({ ...orderToUpdate }))
      const index = this.ordersList.indexOf(order)
      if (index !== -1) {
        this.ordersList.splice(index, 1)[0]; // Eliminar y obtener el elemento eliminado
        this.ordersList.splice(index, 0, orderToUpdate); // Volver a agregar en la misma posición
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Pedido habilitado exitosamente.' });
      }
    }
  }

  showStatus(orderStatus: any): string {
    for (let status of this.statuses) {
      if (orderStatus === status.code) {
        return status.label
      }
    }
  }

  create() {
    this.router.navigate(['Home/RegistrarPedido/' + 'asasas']);
  }

  sendToPayments(order: Order) {
    this.router.navigate(['Home/DetallesPedido/' + order.orderId])
  }

  sendToPackage(order: Order) {
    const orderProcess = {
      action: 'PackageDetails'
    }
    this.store.dispatch(new SaveOrderProcess({ ...orderProcess }))
    this.router.navigate(['Home/DetallesPaquete/' + order.packageId]);
  }

  verDetalles(elementoId: string) {
    if (this.role == 'Administrador') {
      this.router.navigate(['Home/DetallesPaquete/' + elementoId]);
    }
    if (this.role == 'Cliente') {
      this.router.navigate(['Home/DetallesPaquete/' + elementoId]);
    }
    if (this.role == undefined) {
      this.router.navigate(['detailsPackage/' + elementoId]);
    }
  }

  calculateDays(departureDate: Date, returnDate: Date): number {
    if (!(departureDate instanceof Date) || !(returnDate instanceof Date)) {
      departureDate = new Date(departureDate);
      returnDate = new Date(returnDate);
    }
    const fechaSalida = departureDate;
    const fechaRegreso = returnDate;
    const diferenciaMilisegundos =
      fechaRegreso.getTime() - fechaSalida.getTime();
    const unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
    const diferenciaDias = Math.floor(
      diferenciaMilisegundos / unDiaEnMilisegundos
    );

    return diferenciaDias;
  }
}