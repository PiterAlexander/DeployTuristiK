import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import localeEn from '@angular/common/locales/en';
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
import { CostumersComponent } from './pages/costumers/costumers.component';
import { CreatecostumerformComponent } from './components/create-costumer-form/createcostumerform.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { CreateEmployeeFormComponent } from './components/create-employee-form/create-employee-form.component';
import { CreateOrderDetailFormComponent } from './components/create-order-detail-form/create-order-detail-form.component';
import { UsersComponent } from '@pages/users/users.component';
import { CreateUserFormComponent } from '@components/create-user-form/create-user-form.component';
import { CreatePaymentFormComponent } from './components/create-payment-form/create-payment-form.component';
import { ReadOrderOrderDetailComponent } from './components/read-order-order-detail/read-order-order-detail.component';
import { ReadOrderPaymentComponent } from './components/read-order-payment/read-order-payment.component';
import { CreateFrequentTravelerFormComponent } from './components/create-frequent-traveler-form/create-frequent-traveler-form.component';
import { ListFrequentTravelerComponent } from './components/list-frequent-traveler/list-frequent-traveler.component';
import { EditPaymentFormComponent } from './components/edit-payment-form/edit-payment-form.component';
import { ListFrequentTravelersToOrdersComponent } from './components/list-frequent-travelers-to-orders/list-frequent-travelers-to-orders.component';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { OrderListModule } from 'primeng/orderlist';
import {TooltipModule} from 'primeng/tooltip';
import {InputSwitchModule} from 'primeng/inputswitch';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import {DividerModule} from 'primeng/divider';
    defineCustomElements();
registerLocaleData(localeEn, 'en-EN');

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
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
        CostumersComponent,
        CreatecostumerformComponent,
        EmployeesComponent,
        CreateEmployeeFormComponent,
        CreateOrderDetailFormComponent,
        UsersComponent,
        CreateUserFormComponent,
        CreatePaymentFormComponent,
        ReadOrderOrderDetailComponent,
        ReadOrderPaymentComponent,
        CreateFrequentTravelerFormComponent,
        ListFrequentTravelerComponent,
        EditPaymentFormComponent,
        ListFrequentTravelersToOrdersComponent
    ],
    imports: [
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
        DataViewModule,
        BrowserModule,
        StoreModule.forRoot({ auth: authReducer, ui: uiReducer }),
        EffectsModule.forRoot([PackageEffects]),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        ProfabricComponentsModule,
        NgbModule,
        FormsModule,
        TableModule
    ],
    providers: [DialogService, MessageService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
