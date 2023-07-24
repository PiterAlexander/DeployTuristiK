import { Package } from '@/models/package';
import { ChangeStatusPackageRequest, GetAllCustomerRequest, GetAllPackagesRequest, OpenModalCreateOrderDetail, OpenModalCreatePackage, OpenModalDetailsPackage } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { Customer } from '@/models/customer';
import Swal from 'sweetalert2';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { element } from 'protractor';
import { HostBinding } from '@angular/core';
import { Router } from '@angular/router';
interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
  providers: [DialogService]
})
export class PackagesComponent implements OnInit {
  @HostBinding('class') miSombraStyles = 'miSombraStyles';
  public ui: Observable<UiState>;
  public packagesList: Array<Package>;
  public filteredPackagesList: Array<Package>;
  public loading: boolean;
  public search: string
  public total: number

  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';
  arrayPackagesClient: Array<Package>
  private _state: State = {
    page: 1,
    pageSize: 5
  };

  public role;
  public user;
  public allCustomers: Array<Customer>


  checked2: boolean = true;
  constructor(private store: Store<AppState>, public dialogService: DialogService, private router: Router) { }
  ngOnInit() {
    this.store.dispatch(new GetAllPackagesRequest());
    this.store.dispatch(new GetAllCustomerRequest())
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.allCustomers = state.allCustomers.data
      this.packagesList = state.allPackages.data;
      this.arrayPackagesClient = state.allPackages.data.filter(element => element.availableQuotas > 0);
      console.log(this.arrayPackagesClient);
      console.log(this.packagesList);
      this.loading = state.allPackages.loading
      this.searchByName();
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
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
    this.router.navigate(['detailsPackage/'+ elementoId]);
  }

  quotas(cant: number){
    if (cant > 10) {
      return 1
    } else {
      return 2
    }
  }

  matches(packageResolved: Package, term: string, pipe: PipeTransform) {
    return (
      packageResolved.name.toLowerCase().includes(term.toLowerCase())
    );
  }


  // show() {
  //   const ref = this.dialogService.open(CreatePackageFormComponent, {
  //     width: '70%'
  //   });
  // }
  ref: DynamicDialogRef;
  show() {
    this.store.dispatch(new OpenModalCreatePackage());

    // this.ref = this.dialogService.open(OpenModalCreatePackage, {
    //   header: 'Agregar paquete',
    //   width: '50%',
    //   contentStyle: { "max-height": "700px", "overflow": "auto", 'padding-bottom' : '0px' },
    //   baseZIndex: 10000
    // });

  }




  openEditPackageModal(pack: Package) {
    this.store.dispatch(new OpenModalCreatePackage(pack));
  }

  modalShowDetailsPackage(pack: Package) {
    console.log(pack)
    this.store.dispatch(new OpenModalDetailsPackage(pack));
  }

  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredPackagesList = this.packagesList;
      this.total = this.filteredPackagesList.length;
      this.filteredPackagesList = this.filteredPackagesList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredPackagesList = this.packagesList.filter(packageModel => packageModel.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredPackagesList.length;
      this.filteredPackagesList = this.filteredPackagesList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
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
    Swal.fire({
      title: '¿Estás seguro de ' + text1 + ' el paquete ' + pack.name + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, ' + text1,
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-right',
        cancelButton: 'swal2-cancel-left'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(new ChangeStatusPackageRequest(pack))

        Swal.fire(
          text2 + ' con éxito.'
        ).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 0);
        });
      }
    })
  }

  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this.searchByName();
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
