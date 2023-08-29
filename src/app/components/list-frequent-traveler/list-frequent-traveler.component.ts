import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DeleteFrequentTravelerRequest, GetAllRoleRequest, OpenModalCreateCustomer } from '@/store/ui/actions';
import { Customer } from '@/models/customer';
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Role } from '@/models/role';
import { ConfirmationService } from 'primeng/api';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { DataView } from 'primeng/dataview';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-frequent-traveler',
  templateUrl: './list-frequent-traveler.component.html',
  styleUrls: ['./list-frequent-traveler.component.scss']
})

export class ListFrequentTravelerComponent implements OnInit {
  public ui: Observable<UiState>
  public role: any
  public user: any
  public allRoles: Array<Role>
  public allCustomers: Array<Customer>
  public oneCustomer: Customer
  public frequentTravelersList: Array<any> = []
  public loading: boolean = true
  public visible: boolean = true
  public customerId: string
  public showAddButton: number = 0
  public firstItem: boolean
  avatars: string[] = [
    'https://img.freepik.com/vector-gratis/ilustracion-icono-vector-dibujos-animados-lindo-gato-sentado-concepto-icono-naturaleza-animal-aislado-premium-vector-estilo-dibujos-animados-plana_138676-4148.jpg?w=740&t=st=1692921535~exp=1692922135~hmac=3bed835feabe03cfb5aa9d45ae688588799d42b98f2faf54655759ba61b30a45',
    'https://img.freepik.com/vector-gratis/ilustracion-icono-vector-dibujos-animados-lindo-gato-bostezo-sonoliento-concepto-icono-naturaleza-animal-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3732.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/raton-lindo-sentado-ilustracion-icono-vector-dibujos-animados-queso-concepto-icono-alimento-animal-aislado_138676-5860.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/lindo-panda-bambu-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-vector-aislado_138676-4386.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/lindo-cerdo-sentado-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado-premium-plano_138676-7818.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/linda-vaca-sentada-comiendo-hierba-cartoon-vector-icono-ilustracion-animal-naturaleza-icono-aislado-plano_138676-4780.jpg?size=626&ext=jpg&ga=GA1.2.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/lindo-gato-durmiendo-pollito-cartoon-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado_138676-5228.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/gato-lindo-ejemplo-icono-vector-historieta-agujero-concepto-icono-naturaleza-animal-aislado-premium-vector-estilo-dibujos-animados-plana_138676-4236.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/ilustracion-icono-vector-dibujos-animados-lindo-conejo-sentado-concepto-icono-naturaleza-animal-plano-aislado_138676-7351.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/ilustracion-icono-vector-dibujos-animados-pie-ardilla-linda-naturaleza-animal-icono-concepto-aislado-premium_138676-6545.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587',
    'https://img.freepik.com/vector-gratis/lindo-gato-jugando-mano-telefono-dibujos-animados-vector-icono-ilustracion-concepto-icono-tecnologia-animal-aislado-premium-vector-estilo-dibujos-animados-plana_138676-4231.jpg?size=626&ext=jpg&ga=GA1.1.439880410.1692375587'
  ];

  constructor(
    private store: Store<AppState>,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllRoleRequest())
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      this.allRoles = state.allRoles.data
      this.allCustomers = state.allCustomers.data
      if (this.role !== 'Cliente') {
        this.route.paramMap.subscribe((params) => {
          this.customerId = params.get('id');
          this.compareCustomerId()
        });
      } else {
        this.compareCustomerId()
      }
    })
  }

  dataViewRow(): number {
    if (this.role === 'Cliente') {
      return 6
    } else {
      return 4
    }
  }
  compareCustomerId() {
    console.log('yo')
    if (this.allCustomers !== undefined) {
      const frequentTraveler: any = {
        addFtButton: true
      }
      const alreadyExists: any = this.frequentTravelersList.find(o => o.addFtButton === frequentTraveler.addFtButton)
      if (alreadyExists === undefined) {
        this.frequentTravelersList.push(frequentTraveler)
      }
      if (this.customerId !== undefined) {
        this.oneCustomer = this.allCustomers.find(c => c.customerId === this.customerId)
      } else {
        this.oneCustomer = this.allCustomers.find(c => c.userId === this.user['id'])
      }
      if (this.oneCustomer !== undefined && this.oneCustomer.frequentTraveler.length > 0) {
        let index: number = 0
        for (const element of this.oneCustomer.frequentTraveler) {
          const customer = this.allCustomers.find(c => c.customerId === element.travelerId)
          if (customer !== undefined) {
            const frequentTraveler: any = {
              customerId: customer.customerId,
              name: customer.name,
              lastName: customer.lastName,
              document: customer.document,
              birthDate: customer.birthDate,
              phoneNumber: customer.phoneNumber,
              address: customer.address,
              eps: customer.eps,
              userId: customer.userId,
              user: customer.user,
              img: this.avatars[index],
              addFtButton: false
            }
            const alreadyExists: Customer = this.frequentTravelersList.find(o => o.customerId === element.travelerId)
            if (alreadyExists === undefined) {
              this.frequentTravelersList.push(frequentTraveler)
              if (index === 10) {
                index = 0
              } else {
                index++
              }
            }
          }
        }
      }
      this.updateVisibility()
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  getRandomAvatarUrl() {
    const randomIndex = Math.floor(Math.random() * this.avatars.length);
    return this.avatars[randomIndex];
  }

  updateVisibility(): void {
    this.loading = false
    this.visible = false
    setTimeout(() => this.visible = true, 0)
  }

  createFrequentTraveler() {
    const oneCustomer = {
      action: 'createFrequentTraveler',
      customer: this.oneCustomer
    }
    this.store.dispatch(new OpenModalCreateCustomer({ ...oneCustomer }))
  }

  validateEditAllowing(customer: Customer): boolean {
    if (this.allRoles !== undefined) {
      const role = this.allRoles.find(r => r.roleId === customer.user.roleId)
      if (role !== undefined) {
        if (role.name !== 'Cliente') {
          return true
        }
      }
    }
    return false
  }

  editFrequentTraveler(customer: Customer) {
    const oneCustomer = {
      action: 'editCustomerFromFrequentTraveler',
      customer: customer,
      titularCustomer: this.oneCustomer
    }
    this.store.dispatch(new OpenModalCreateCustomer({ ...oneCustomer }))
  }

  deleteFrequentTraveler(customer: Customer) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Está seguro de eliminar a ' + customer.name + ' ' + customer.lastName + ' ?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        const frequentTraveler: FrequentTraveler = this.oneCustomer.frequentTraveler.find(ft => ft.travelerId === customer.customerId)
        if (frequentTraveler !== undefined) {
          this.store.dispatch(new DeleteFrequentTravelerRequest({ ...frequentTraveler }))
          const frequentTravelerToDelete: any = this.frequentTravelersList.find(ft => ft.customerId === customer.customerId)
          if (frequentTravelerToDelete !== undefined) {
            const index = this.frequentTravelersList.indexOf(frequentTravelerToDelete)
            this.frequentTravelersList.splice(index, 1)
            this.updateVisibility()
          }
        }
      }
    })
  }

  back() {
    this.router.navigate(['Home/Clientes'])
  }

  forEachFt(frequentTraveler: Customer): boolean {
    if (frequentTraveler.name === 'Alexander' || frequentTraveler.name === null) {
      return true
    } else {
      return false
    }
  }
}