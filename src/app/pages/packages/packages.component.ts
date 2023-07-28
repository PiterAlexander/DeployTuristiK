import { Package } from '@/models/package';
import { ChangeStatusPackageRequest, GetAllCustomerRequest, GetAllPackagesRequest, OpenModalCreatePackage, OpenModalDetailsPackage } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})

export class PackagesComponent implements OnInit {
  public ui: Observable<UiState>;
  public role: any;
  public user: any;
  public packagesList: Array<Package>;
  public filteredPackagesList: Array<Package>;
  public loading: boolean;
  public search: string
  public total: number
  public sortOptions: SelectItem[] = [];
  public sortOrder: number = 0;
  public sortField: string = '';
  public arrayPackagesClient: Array<Package>
  public allCustomers: Array<Customer>
  public checked2: boolean = true;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.store.dispatch(new GetAllPackagesRequest)
    this.store.dispatch(new GetAllCustomerRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.allCustomers = state.allCustomers.data
      this.packagesList = state.allPackages.data
      this.arrayPackagesClient = state.allPackages.data;
      this.loading = state.allPackages.loading
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
      console.log("cliente"+this.arrayPackagesClient);
      console.log(this.packagesList);

    });

    this.sortOptions = [
      { label: 'Del mayor al menor', value: '!price' },
      { label: 'Del menor al mayor', value: 'price' }
    ];
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  verDetalles(elementoId: string) {

    if (this.user !== null ) {
      this.router.navigate(['detailsPackage/' + elementoId]);
        console.log("hello bro", this.router.config)
    }
    this.router.navigate(['detailsPackage/' + elementoId]);
    console.log("hello nigga", this.router.config)
  }

  quotas(cant: number) {
    if (cant > 10) {
      return 1
    } else {
      return 2
    }
  }

  show() {
    this.store.dispatch(new OpenModalCreatePackage())
  }

  openEditPackageModal(pack: Package) {
    this.store.dispatch(new OpenModalCreatePackage({ ...pack }));
  }

  disablePackage(pack: Package) {
    var text1 = ""
    var text2 = ""
    if (pack.status) {
      text1 = "inhabilitar"
      text2 = "Inhabilitado"
    } else {
      text1 = "habilitar"
      text2 = "Habilitado"
    }
    this.confirmationService.confirm({
      header: 'Confirmación', // Cambia el encabezado del cuadro de confirmación
      message: '¿Está seguro de ' + text1 + ' el paquete ' + pack.name + '?',
      icon: 'pi pi-exclamation-triangle', // Cambia el icono del cuadro de confirmación
      acceptLabel: 'Aceptar', // Cambia el texto del botón de aceptar
      acceptIcon: 'pi pi-check',
      rejectLabel: 'Cancelar', // Cambia el texto del botón de rechazar
      acceptButtonStyleClass: 'p-button-sm', // Agrega una clase CSS al botón de aceptar
      rejectButtonStyleClass: 'p-button-outlined p-button-sm', // Agrega una clase CSS al botón de rechazar
      accept: () => {
        // Lógica para confirmar
        this.store.dispatch(new ChangeStatusPackageRequest(pack))
        this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: 'Estado editado exitosamente.' });
      },
      reject: () => {
        // Lógica para rechazar
      }
    })
  }

  //PARA LA VISTA DEL CLIENTE-----------------------------------------------
  calculateDays(departureDate: Date, returnDate: Date): number {

    if (!(departureDate instanceof Date) || !(returnDate instanceof Date)) {
      departureDate = new Date(departureDate);
      returnDate = new Date(returnDate);
    }
    const fechaSalida = departureDate;
    // Fecha de regreso
    const fechaRegreso = returnDate;

    // Diferencia en milisegundos
    const diferenciaMilisegundos = fechaRegreso.getTime() - fechaSalida.getTime();

    // Convertir la diferencia de milisegundos a días
    const unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
    const diferenciaDias = Math.floor(diferenciaMilisegundos / unDiaEnMilisegundos);

    return diferenciaDias
  }
}
