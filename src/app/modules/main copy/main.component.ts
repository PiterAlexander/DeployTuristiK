import {AppState} from '@/store/state';
import {ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit, Renderer2} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {Store} from '@ngrx/store';
import { LayoutService } from '@services/app.layout.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainPublicComponent implements OnInit {
    @HostBinding('class') class = 'wrapper';
    public ui: Observable<UiState>;
    public role;
    public user : any;
    public route;
    public log;
    get dark(): boolean {
      return this.layoutService.config.colorScheme !== 'light';
    }
    constructor(private renderer: Renderer2, private store: Store<AppState>,private layoutService: LayoutService, private router: Router) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
          this.user = JSON.parse(localStorage.getItem('TokenPayload'))
          if (this.user && this.user.role) {
            this.role = this.user['role']
            } else {
              this.role = undefined
            }
        });
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
              const currentRoute = this.getCurrentRoute(event.url);
              this.route = event.url;
              if (event.url == '/login') {
                  this.log = true
              } else{
                this.log= false
              }
          
              console.log(this.log)
            }
      });
      
    }
    getCurrentRoute(url: string): string {
      const routeParts = url.split('/').filter((part) => part !== '');
      if (routeParts.length === 1) {
          return 'Home';
      }
      return routeParts[1];
  }
}
