import { AppState } from '@/store/state';
import { ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LayoutService } from '@services/app.layout.service';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainPublicComponent implements OnInit {
  @HostBinding('class') class = 'wrapper';
  public ui: Observable<UiState>;
  public url;
  public role;
  public user: any;
  public route;
  public log;
  get dark(): boolean {
    return this.layoutService.config.colorScheme !== 'light';
  }
  constructor(
    private primengConfig: PrimeNGConfig,
    private renderer: Renderer2,
    private store: Store<AppState>,
    private layoutService: LayoutService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    var navigationBarUrl = window.location.href;
    if (navigationBarUrl) {
      this.changeBgByNavigationBar(navigationBarUrl)
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        var url = this.router.routerState.snapshot.url
        if (url == '/login' || url == '/register' || url == '/forgot-password' || url == '/recover-password') {
          this.log = true
        } else {
          this.log = false
        }
        localStorage.setItem('logStatus', this.log.toString());
      }
    });

    const storedLogStatus = localStorage.getItem('logStatus');
    this.log = storedLogStatus === 'true';

    this.dataPickerLanguaje()
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      if (this.user && this.user.role) {
        this.role = this.user['role']
      } else {
        this.role = undefined
      }
    });
  }

  changeBgByNavigationBar(navigationBarUrl){
    const parts = navigationBarUrl.split('/');
    const url = parts[parts.length - 1];
    if (url == 'login' || url == 'register' || url == 'forgot-password' || url == 'recover-password') {
      this.log = true
    } else {
      this.log = false
    }
    localStorage.setItem('logStatus', this.log.toString());
  }

  dataPickerLanguaje() {
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
