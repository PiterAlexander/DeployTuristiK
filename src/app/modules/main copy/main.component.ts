import {AppState} from '@/store/state';
import {ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit, Renderer2} from '@angular/core';
import {Store} from '@ngrx/store';
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

    constructor(private renderer: Renderer2, private store: Store<AppState>) {}

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
        
    }
}
