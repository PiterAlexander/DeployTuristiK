import { Order } from '@/models/order';
import { GetAllCustomerRequest, GetAllOrdersRequest, GetAllPackagesRequest, GetAllRoleRequest, GetUsersRequest, OpenModalCreateOrder } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';
import { Package } from '@/models/package';
import { DataView } from 'primeng/dataview';
import { Router } from '@angular/router';

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
      this.allCustomers = state.allCustomers.data
      this.allOrders = state.allOrders.data
      this.allPackages = state.allPackages.data
      this.packagesClients = state.allPackages.data.filter(
        (pkg) => pkg.availableQuotas > 0
      );
      this.compareCustomer()
    })

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
                payment: element.payment,
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
              payment: element.payment,
            }
            this.ordersList.push(order)
          }
        }
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

  async sendToPayments(order: Order) {
    this.router.navigate(['Home/DetallesPedido/' + order.orderId]);
    console.log('hello bro', this.router.config);
  }

  verDetalles(elementoId: string) {
    if (this.role == 'Administrador') {
      this.router.navigate(['Home/DetallesPaquete/' + elementoId]);
      console.log('hello bro', this.router.config);
    }
    if (this.role == 'Cliente') {
      this.router.navigate(['Home/DetallesPaquete/' + elementoId]);
      console.log('hello bro', this.router.config);
    }
    if (this.role == undefined) {
      this.router.navigate(['detailsPackage/' + elementoId]);
      console.log('hello nigga', this.router.config);
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