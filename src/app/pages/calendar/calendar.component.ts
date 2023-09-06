import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ApiService } from '@services/api.service';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { formatDate } from '@angular/common';
import {
    GetAllOrdersRequest,
    GetAllPackagesRequest,
    OpenModalCreatePackage
} from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Store } from '@ngrx/store';
import { UiState } from '@/store/ui/state';
import { Observable } from 'rxjs';
import { Package } from '@/models/package';
import { Order } from '@/models/order';

@Component({
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {


    @Output() packagesInformation: EventEmitter<string> =
        new EventEmitter<string>();

    public ui: Observable<UiState>;

    public allOrders: Array<Order>;

    public allPackages: Array<Package>;

    events: any[] = [];

    today: string = '';

    calendarOptions: any = {
        initialView: 'dayGridMonth'
    };

    showDialog: boolean = false;

    clickedEvent: any = null;

    dateClicked: boolean = false;

    edit: boolean = false;

    tags: any[] = [];

    view: string = '';

    changedEvent: any;

    constructor(
        private store: Store<AppState>,
        private apiService: ApiService
    ) { }

    ngOnInit() {
        let actualDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.today = actualDate;
        this.store.dispatch(new GetAllOrdersRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.allOrders = state.allOrders.data;
        });
        this.apiService.getPackages().subscribe({
            next: (data) => {
                const packages = [];
                data.forEach((p) => {
                    var modeloEvento = {
                        id: p.packageId,
                        title: p.name,
                        destination: p.destination,
                        description: p.details,
                        transport: p.transport,
                        hotel: p.hotel,
                        start: formatDate(
                            p.departureDate,
                            'yyyy-MM-dd',
                            'en-US'
                        ).toString(),
                        end: formatDate(
                            p.arrivalDate,
                            'yyyy-MM-dd',
                            'en-US'
                        ).toString(),
                        location: p.departurePoint,
                        totalQuotas: p.totalQuotas,
                        availableQuotas: p.availableQuotas,
                        price: p.price,
                        type: p.type,
                        status: p.status,
                        departureDate: p.departureDate,
                        arrivalDate: p.arrivalDate,
                        photos: p.photos,
                        tag: { color: '#FFB6B6', name: 'a' }
                    };
                    packages.push(modeloEvento);
                });
                this.allPackages = data;
                this.events = packages;
                this.calendarOptions = {
                    ...this.calendarOptions,
                    ...{ events: packages }
                };
                this.tags = this.events.map((item) => item.tag);
            },
            error: (e) => {
                console.error(e);
            }
        });

        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            height: 720,
            initialDate: this.today,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: false,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventClick: (e: MouseEvent) => this.onEventClick(e),
            // select: (e: MouseEvent) => this.onDateSelect(e),
            locale: esLocale
        };
    }

    //<------VER DETALLE DEL PAQUETE--------->
    onEventClick(e: any) {
        this.clickedEvent = e.event;
        let plainEvent = e.event.toPlainObject({
            collapseExtendedProps: true,
            collapseColor: true
        });
        this.view = 'display';
        this.showDialog = true;

        this.changedEvent = { ...plainEvent, ...this.clickedEvent };
        this.changedEvent.start = this.clickedEvent.start;
        this.changedEvent.end = this.clickedEvent.end
            ? this.clickedEvent.end
            : this.clickedEvent.start;
    }

    // //<------MOSTRAR DIALOGO PARA NUEVO PAQUETE--------->
    // onDateSelect(e: any) {
    //     this.view = 'new';
    //     this.showDialog = false;
    //     this.store.dispatch(new OpenModalCreatePackage(null, e.start));
    //     //this.changedEvent = { ...e, title: null, description: null, location: null, backgroundColor: null, borderColor: null, textColor: null, tag: { color: null, name: null } };
    // }

    handleSave() {
        if (!this.validate()) {
            return;
        } else {
            this.showDialog = false;
            this.clickedEvent = {
                ...this.changedEvent,
                backgroundColor: this.changedEvent.tag.color,
                borderColor: this.changedEvent.tag.color,
                textColor: '#212121'
            };

            if (this.clickedEvent.hasOwnProperty('id')) {
                //<---EDITAR PAQUETE---->
                this.events = this.events.map((i) =>
                    i.id.toString() === this.clickedEvent.id.toString()
                        ? (i = this.clickedEvent)
                        : i
                );
            } else {
                //<---CREAR PAQUETE---->

                this.events = [
                    ...this.events,
                    {
                        ...this.clickedEvent,
                        id: Math.floor(Math.random() * 10000)
                    }
                ];
            }

            this.calendarOptions = {
                ...this.calendarOptions,
                ...{ events: this.events }
            };
            this.clickedEvent = null;
        }
    }

    //<------MOSTRAR DIALOGO PARA EDITAR PAQUETE--------->
    onEditClick() {
        var pack = this.allPackages.find(
            (p) => p.packageId == this.clickedEvent.id
        );
        this.store.dispatch(new OpenModalCreatePackage(pack));
        this.showDialog = false;
        // this.view = 'edit';
    }

    delete() {
        this.events = this.events.filter(
            (i) => i.id.toString() !== this.clickedEvent.id.toString()
        );
        this.calendarOptions = {
            ...this.calendarOptions,
            ...{ events: this.events }
        };
        this.showDialog = false;
    }

    validate() {
        let { start, end } = this.changedEvent;
        return start && end;
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
    closeDialog() {
        this.showDialog = false;
    }
}
