import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {LayoutService} from '@services/app.layout.service';
import {Store} from '@ngrx/store';
import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ContactUsRequest, GetTopPackagesRequest} from '@/store/ui/actions';
import {Observable} from 'rxjs';
import {sendPQRS} from '@/models/mail';

@Component({
    selector: 'app-public-home',
    templateUrl: './public-home.component.html',
    styleUrls: ['./public-home.component.scss']
})
export class PublicHomeComponent implements OnInit {
    subscription: Subscription;
    darkMode: boolean = false;
    public top;
    public ui: Observable<UiState>;
    public role: any;
    responsiveOptions;
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private layoutService: LayoutService
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

        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.darkMode =
                    config.colorScheme === 'dark' ||
                    config.colorScheme === 'dim'
                        ? true
                        : false;
            }
        );
        this.types = [
            {name: 'Pregunta', code: '1'},
            {name: 'Queja', code: '2'},
            {name: 'Respuesta', code: '3'},
            {name: 'Sugerencia', code: '4'},
            {name: 'Felicitación', code: '5'}
        ];
    }

    options: any;
    visibleMember: number = -1;

    overlays: any[] = [];

    dialogVisible: boolean = false;

    markerTitle: string = '';

    selectedPosition: any;

    infoWindow: any;

    draggable: boolean = false;

    name: string = '';

    email: string = '';

    message: string = '';

    content: any[] = [
        {
            icon: 'pi pi-fw pi-phone',
            title: 'Teléfono',
            info: '+57 321-716-5821 - +57 320-744-6109'
        },
        {
            icon: 'bx bx-message-dots',
            title: 'Redes sociales',
            info: 'Estamos en todas las plataformas como @pakytours'
        }
    ];
    ngOnInit() {
        this.store.dispatch(new GetTopPackagesRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.top = state.allTopPackages.data;
        });

    }
    experiences: any[] = [
        {
            place: 'Acapulco',
            photo: 'https://content.r9cdn.net/rimg/dimg/c1/ce/f9cd2e90-city-35003-167377d30d0.jpg?width=1366&height=768&xhint=2806&yhint=2135&crop=true',
            rating: 1
        },
        {
            place: 'Tolu Coveñas',
            photo: 'https://cdn.colombia.com/images/v2/turismo/sitios-turisticos/tolu/Mar-Caribe-en-tolu-Covenas-en-Colombia-800.jpg',
            rating: 4
        },
        {
            place: 'Paris',
            photo: 'https://viajes.nationalgeographic.com.es/medio/2022/07/13/paris_37bc088a_1280x720.jpg',
            rating: 2
        },
        {
            place: 'Estados Unidos',
            photo: 'https://img.freepik.com/fotos-premium/estatua-libertad-sobre-escena-lado-rio-paisaje-urbano-nueva-york-cuya-ubicacion-es-mas-baja-manhattan_41418-3385.jpg',
            rating: 2
        }
    ];

    hotels: Array<string> = []
    types: Type[];

    selectedType: Type;


    get mapStyle() {
        return {
            'background-image':
                this.layoutService.config.colorScheme === 'light'
                    ? "url('assets/demo/images/contact/map-light.svg')"
                    : "url('assets/demo/images/contact/map-dark.svg')"
        };
    }

    sendEmail() {
        var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (
            this.name == '' ||
            this.email == '' ||
            this.message == '' ||
            !this.selectedType
        ) {
            this.messageService.add({
                key: 'alert-message',
                severity: 'error',
                summary: '¡Espera!',
                detail: 'Todos los campos deben estar completos'
            });
        } else if (regex.test(this.email)) {
            let model: sendPQRS = {
                EmailAddress: this.email,
                Subject: this.selectedType.name,
                Body: this.message,
                From: this.name
            };
            this.store.dispatch(
                new ContactUsRequest({
                    ...model
                })
            );

            this.name = '';
            this.message = '';
            this.email = '';
            this.selectedType = this.types[0];

            this.messageService.add({
                key: 'alert-message',
                severity: 'success',
                summary: '¡Proceso completado!',
                detail: this.selectedType.name + ' enviada correctamente'
            });
        } else {
            this.messageService.add({
                key: 'alert-message',
                severity: 'error',
                summary: '¡Lo sentimos!',
                detail: 'Correo no vàlido'
            });
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

interface Type {
    name: string;
    code: string;
}

interface Experiences {
    name: string;
    photo: string;
}
