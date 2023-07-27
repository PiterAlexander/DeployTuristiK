import {AppState} from '@/store/state';
import { ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit, Input} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import {Observable} from 'rxjs';

var BASE_CLASSES = 'main-header navbar navbar-expand';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: UntypedFormGroup;
    public role;
    public isStyleActive: boolean
    constructor(
        private appService: AppService,
        private store: Store<AppState>
    ) {}

    onProfileButtonClick() {
        this.appService.showProfileSidebar();
    }
    

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            var user = JSON.parse(localStorage.getItem('TokenPayload'))
            this.role = user['role']

            if (this.role === 'Cliente') {
              BASE_CLASSES = 'navbar navbar-expand-lg bg-body-tertiary fixed-top mb-5'
            }
            
            this.isStyleActive = state.menuSidebarCollapsed

            this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
        });
        this.searchForm = new UntypedFormGroup({
            search: new UntypedFormControl(null)
        });
    }

    logout() {
        this.appService.logout();
    }

    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

}
