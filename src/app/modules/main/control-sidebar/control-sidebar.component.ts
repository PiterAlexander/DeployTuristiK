import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import {
    Option,
    NAVBAR_LIGHT_VARIANTS,
    NAVBAR_DARK_VARIANTS,
    SIDEBAR_DARK_SKINS,
    SIDEBAR_LIGHT_SKINS
} from '@/utils/themes';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-control-sidebar',
    templateUrl: './control-sidebar.component.html',
    styleUrls: ['./control-sidebar.component.scss']
})
export class ControlSidebarComponent{
    @HostBinding('class') classes: string =
        'control-sidebar control-sidebar-dark';
    public navbarLightVariants: Array<Option> = NAVBAR_LIGHT_VARIANTS;
    public navbarDarkVariants: Array<Option> = NAVBAR_DARK_VARIANTS;
    public darkSidebarSkins: Array<Option> = SIDEBAR_DARK_SKINS;
    public lightSidebarSkins: Array<Option> = SIDEBAR_LIGHT_SKINS;
    public ui: Observable<UiState>;
    public navbarVariant: string;
    public darkMode: boolean;
    public sidebarSkin: string;

    constructor(private store: Store<AppState>) { }



}