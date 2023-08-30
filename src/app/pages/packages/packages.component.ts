import { Package } from '@/models/package';
import {
    ChangeStatusPackageRequest,
    GetAllCustomerRequest,
    GetAllPackagesRequest,
    GetTopPackagesRequest,
    OpenModalCreatePackage,
    OpenModalDetailsPackage,
    SaveOrderProcess,
} from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    @ViewChild('packagesSection') packagesSection: ElementRef;
    public ui: Observable<UiState>;
    public role: any;
    public user: any;
    public packagesList: Array<Package>;
    public filteredPackagesList: Array<Package>;
    public loading: boolean;
    public search: string;
    public total: number;
    public orderProcess: any
    public sortOptions: SelectItem[] = [];
    public sortOrder: number = 0;
    public sortField: string = '';
    public arrayPackagesClient: Array<Package>;
    public allCustomers: Array<Customer>;
    public checked2: boolean = true;
    public top;
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.store.dispatch(new GetTopPackagesRequest());
        this.store.dispatch(new GetAllPackagesRequest());
        this.store.dispatch(new GetAllCustomerRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.user = JSON.parse(localStorage.getItem('TokenPayload'));
            if (this.user && this.user.role) {
                this.role = this.user['role'];
            } else {
                this.role = undefined;
            }
            this.orderProcess = state.orderProcess.data
            this.top = state.allTopPackages.data
            this.allCustomers = state.allCustomers.data;
            this.packagesList = state.allPackages.data;

const currentDate = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
this.arrayPackagesClient = state.allPackages.data.filter((pkg) => {
    const departureDate = new Date(pkg.departureDate);
    const timeDifference = departureDate.getTime() - currentDate.getTime();
    const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;
    const isWithinOneMonth = timeDifference >= oneMonthInMillis;

    return pkg.availableQuotas > 0 && isWithinOneMonth;
});

            this.loading = state.allPackages.loading;
        });

        if (this.orderProcess !== undefined) {
            this.store.dispatch(new SaveOrderProcess(undefined))
        }

        this.sortOptions = [
            { label: 'Del mayor al menor', value: '!price' },
            { label: 'Del menor al mayor', value: 'price' }
        ];
    }
    scrollToSelector(): void {
        this.packagesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
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

    quotas(cant: number) {
        if (cant > 10) {
            return 1;
        } else {
            return 2;
        }
    }

    show() {
        this.store.dispatch(new OpenModalCreatePackage());
    }

    openEditPackageModal(pack: Package) {
        this.store.dispatch(new OpenModalCreatePackage({ ...pack }));
    }

    disablePackage(pack: Package) {
        var text1 = '';
        var text2 = '';
        if (pack.status) {
            text1 = 'inhabilitar';
            text2 = 'Inhabilitado';
        } else {
            text1 = 'habilitar';
            text2 = 'Habilitado';
        }
        this.confirmationService.confirm({
            header: 'Confirmación',
            message:
                '¿Está seguro de ' + text1 + ' el paquete ' + pack.name + '?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            acceptIcon: 'pi pi-check',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-sm',
            rejectButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.store.dispatch(new ChangeStatusPackageRequest(pack));
                this.messageService.add({
                    key: 'alert-message',
                    severity: 'success',
                    summary: '¡Proceso completado!',
                    detail: 'Estado editado exitosamente.'
                });
            },
            reject: () => { }
        });
    }

    //PARA LA VISTA DEL CLIENTE-----------------------------------------------
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
