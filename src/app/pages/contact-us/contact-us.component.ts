import { sendPQRS } from '@/models/recoverPasswordEmail';
import { AppState } from '@/store/state';
import { ContactUsRequest } from '@/store/ui/actions';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutService } from '@services/app.layout.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
    options: any;

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
            title: 'Telefono',
            info: 'aca va el telefono de esa cucha xd'
        },
        {
            icon: 'bx bx-message-dots',
            title: 'Redes sociales',
            info: 'Y aca va el wasa o alguna cosa asi'
        }
    ];

    types: Type[];

    selectedType: Type;
    constructor(private layoutService: LayoutService, private messageService: MessageService, private store: Store<AppState>,) {
        this.types = [
            { name: 'Pregunta', code: '1' },
            { name: 'Queja', code: '2' },
            { name: 'Respuesta', code: '3' },
            { name: 'Sugerencia', code: '4' },
            { name: 'Felicitacion', code: '5' }
        ];
    }

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
        if (this.name == "" || this.email == "" || this.message == "" || !this.selectedType) {
            this.messageService.add({ key: 'alert-message', severity: 'error', summary: '¡Espera!', detail: 'Todos los campos deben estar completos' });

        } else if (regex.test(this.email)) {
            let model: sendPQRS = {
                "EmailAddress": this.email,
                "Subject": this.selectedType.name,
                "Body": this.message,
                "From": this.name
            }
            this.store.dispatch(new ContactUsRequest({
                ...model
            }))

            this.name = ""
            this.message = ""
            this.email = ""
            this.selectedType = this.types[0]

            this.messageService.add({ key: 'alert-message', severity: 'success', summary: '¡Proceso completado!', detail: this.selectedType.name + " enviada correctamente" });

        } else {
            this.messageService.add({ key: 'alert-message', severity: 'error', summary: '¡Lo sentimos!', detail: 'Correo no vàlido' });

        }
    }
}

interface Type {
    name: string;
    code: string;
}
