import { Component } from '@angular/core';
import { LayoutService } from '@services/app.layout.service';

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
        {icon: 'pi pi-fw pi-phone', title: 'Telefono', info:'aca va el telefono de esa cucha xd'},
        {icon: 'pi pi-fw pi-map-marker', title: 'Direccion de residencia', info:'aca va la direccion de esa cucha xd'},
        {icon: 'bx bx-message-dots', title: 'Redes sociales', info:'Y aca va el wasa o alguna cosa asi'}
    ];

    constructor(private layoutService: LayoutService) { }

    get mapStyle() {
        return {
            'background-image':  this.layoutService.config.colorScheme === 'light' ? "url('assets/demo/images/contact/map-light.svg')" : "url('assets/demo/images/contact/map-dark.svg')"
        }
    }
}
