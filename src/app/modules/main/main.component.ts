import { AppState } from '@/store/state';
import { ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    @HostBinding('class') class = 'wrapper';
    public ui: Observable<UiState>;
    public role;
    public isStyleActive: boolean = true;

    constructor(private renderer: Renderer2, private store: Store<AppState>,
      private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.dataPickerLanguaje()
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            var user = JSON.parse(localStorage.getItem('TokenPayload'));
            this.role = user['role'];
            this.isStyleActive = state.menuSidebarCollapsed
        });

        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'register-page'
        );
        this.renderer.addClass(
            document.querySelector('app-root'),
            'layout-fixed'
        );

        this.ui.subscribe(
            ({ menuSidebarCollapsed, controlSidebarCollapsed, darkMode }) => {
                if (menuSidebarCollapsed) {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'sidebar-open'
                    );
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'sidebar-collapse'
                    );
                } else {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'sidebar-collapse'
                    );
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'sidebar-open'
                    );
                }

                if (controlSidebarCollapsed) {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'control-sidebar-slide-open'
                    );
                } else {
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'control-sidebar-slide-open'
                    );
                }

                if (darkMode) {
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'dark-mode'
                    );
                } else {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'dark-mode'
                    );
                }
            }
        );
    }

    dataPickerLanguaje(){
      this.primengConfig.setTranslation({
        firstDayOfWeek: 0,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ],
        monthNamesShort: [
          'ene', 'feb', 'mar', 'abr', 'may', 'jun',
          'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
        ],
        today: 'Hoy',
        clear: 'Limpiar'
      });
    }

}
