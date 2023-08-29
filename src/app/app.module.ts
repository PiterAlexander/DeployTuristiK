import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '@/app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from '@modules/main/main.component';
import { LoginComponent } from '@modules/login/login.component';
import { HeaderComponent } from '@modules/main/header/header.component';
import { FooterComponent } from '@modules/main/footer/footer.component';
import { MenuSidebarComponent } from '@modules/main/menu-sidebar/menu-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from '@pages/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { NotificationsComponent } from '@modules/main/header/notifications/notifications.component';
import { registerLocaleData } from '@angular/common';
import { UserComponent } from '@modules/main/header/user/user.component';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { ControlSidebarComponent } from './modules/main/control-sidebar/control-sidebar.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/reducer';
import { uiReducer } from './store/ui/reducer';
import { ProfabricComponentsModule } from '@profabric/angular-components';
import { defineCustomElements } from '@profabric/web-components/loader';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { PackagesComponent } from './pages/packages/packages.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { PackageEffects } from './store/ui/effects';
import { CreatePackageFormComponent } from './components/create-package-form/create-package-form.component';
import { RolesComponent } from './pages/roles/roles.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CreateOrderFormComponent } from './components/create-order-form/create-order-form.component';
import { CreateRoleFormComponent } from '@components/create-role-form/create-role-form.component';
import { DetailsPackageComponent } from './components/details-package/details-package.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { CreatecustomerformComponent } from './components/create-customer-form/create-customer-form.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { CreateEmployeeFormComponent } from './components/create-employee-form/create-employee-form.component';
import { CreateOrderDetailFormComponent } from './components/create-order-detail-form/create-order-detail-form.component';
import { UsersComponent } from '@pages/users/users.component';
import { CreateUserFormComponent } from '@components/create-user-form/create-user-form.component';
import { CreatePaymentFormComponent } from './components/create-payment-form/create-payment-form.component';
import { ReadOrderPaymentComponent } from './components/read-order-payment/read-order-payment.component';
import { ListFrequentTravelerComponent } from './components/list-frequent-traveler/list-frequent-traveler.component';
import { EditPaymentFormComponent } from './components/edit-payment-form/edit-payment-form.component';
import { MainPublicComponent } from '@modules/main copy/main.component';
import { PackagePublicComponent } from '@modules/packages/package-public.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';

//<-----------PRIMENG--------------->
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { OrderListModule } from 'primeng/orderlist';
import { TooltipModule } from 'primeng/tooltip';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { SidebarModule } from 'primeng/sidebar';
import { DataViewModule } from 'primeng/dataview';
import { PublicHomeComponent } from './pages/public-home/public-home.component';
import { GalleriaModule } from 'primeng/galleria';
import { AnimateEnterDirective } from '@pages/public-home/animateenter.directive';
import { StyleClassModule } from 'primeng/styleclass';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ChipModule } from 'primeng/chip';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
defineCustomElements();


//IDIOMA
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AnimateEnterDirective,
    AppComponent,
    MainComponent,
    MainPublicComponent,
    PackagePublicComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MenuSidebarComponent,
    ProfileComponent,
    RegisterComponent,
    DashboardComponent,
    NotificationsComponent,
    UserComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
    MenuItemComponent,
    ControlSidebarComponent,
    SidebarSearchComponent,
    PackagesComponent,
    CreatePackageFormComponent,
    RolesComponent,
    CreateRoleFormComponent,
    DetailsPackageComponent,
    OrdersComponent,
    CreateOrderFormComponent,
    CreateRoleFormComponent,
    CustomersComponent,
    CreatecustomerformComponent,
    EmployeesComponent,
    CreateEmployeeFormComponent,
    CreateOrderDetailFormComponent,
    UsersComponent,
    CreateUserFormComponent,
    CreatePaymentFormComponent,
    ReadOrderPaymentComponent,
    ListFrequentTravelerComponent,
    EditPaymentFormComponent,
    CalendarComponent,
    PublicHomeComponent,
    ChangePasswordComponent,
    PaymentDetailsComponent,
  ],
  imports: [
    GooglePlaceModule,
    ChipModule,
    ScrollTopModule,
    StyleClassModule,
    GalleriaModule,
    CarouselModule,
    AutoCompleteModule,
    TabViewModule,
    TabMenuModule,
    DividerModule,
    CalendarModule,
    CascadeSelectModule,
    InputSwitchModule,
    TooltipModule,
    OrderListModule,
    DialogModule,
    DynamicDialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    InputNumberModule,
    RatingModule,
    DialogModule,
    CommonModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
    BrowserModule,
    StoreModule.forRoot({ auth: authReducer, ui: uiReducer }),
    EffectsModule.forRoot([PackageEffects]),
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,

    //<--------PRIMENG----------->
    InputSwitchModule,
    DynamicDialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    FullCalendarModule,
    DialogModule,
    InputTextareaModule,
    RippleModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    TableModule,
    DividerModule,
    BrowserAnimationsModule,
    CheckboxModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    ConfirmPopupModule,
    BadgeModule,
    ChartModule,
    OverlayPanelModule,
    SidebarModule,
    DataViewModule,
    PanelModule,
    SkeletonModule,
    ImageModule,
    AccordionModule,
    AvatarModule,
    AvatarGroupModule,

    //<------------------------->
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    ProfabricComponentsModule,
    NgbModule,
    FormsModule,
    ChartModule,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    DialogService,
    ToastModule,
    MessageService,
    ConfirmationService,
    DynamicDialogRef,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
