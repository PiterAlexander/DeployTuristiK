import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import { LoginComponent } from '@modules/login/login.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { PackagesComponent } from '@pages/packages/packages.component';
import { RolesComponent } from '@pages/roles/roles.component';
import { OrdersComponent } from '@pages/orders/orders.component';
import { CustomersComponent } from '@pages/customers/customers.component';
import { EmployeesComponent } from '@pages/employees/employees.component';
import { UsersComponent } from '@pages/users/users.component';
import { CalendarComponent } from '@pages/calendar/calendar.component';
import { MainPublicComponent } from '@modules/main copy/main.component';
import { PackagePublicComponent } from '@modules/packages/package-public.component';
import { DetailsPackageComponent } from '@components/details-package/details-package.component';
import { PublicHomeComponent } from '@pages/public-home/public-home.component';
import { AboutUsComponent } from '@pages/about-us/about-us.component';
import { ContactUsComponent } from '@pages/contact-us/contact-us.component';
import { ListFrequentTravelerComponent } from '@components/list-frequent-traveler/list-frequent-traveler.component';
import { CreateOrderDetailFormComponent } from '@components/create-order-detail-form/create-order-detail-form.component';
import { CreatePaymentFormComponent } from '@components/create-payment-form/create-payment-form.component';
import { ReadOrderPaymentComponent } from '@components/read-order-payment/read-order-payment.component';

const routes: Routes = [
    {
        path: 'Home',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                component: PackagesComponent
            },
            {
                path: 'Dashboard',
                canActivate: [AuthGuard],
                component: DashboardComponent
            },
            {
                path: 'profile',
                canActivate: [AuthGuard],
                component: ProfileComponent
            },
            {
                path: 'Paquetes',
                canActivate: [AuthGuard],
                component: PackagesComponent
            },
            {
                path: 'Roles',
                canActivate: [AuthGuard],
                component: RolesComponent
            },
            {
                path: 'Pedidos',
                canActivate: [AuthGuard],
                component: OrdersComponent
            },
            {
                path: 'DetallesPaquete/:id',
                canActivate: [AuthGuard],
                component: DetailsPackageComponent
            },
            {
                path: 'Clientes',
                canActivate: [AuthGuard],
                component: CustomersComponent
            },
            {
                path: 'Empleados',
                canActivate: [AuthGuard],
                component: EmployeesComponent
            },
            {
                path: 'Usuarios',
                canActivate: [AuthGuard],
                component: UsersComponent
            },
            {
                path: 'Calendario',
                canActivate: [AuthGuard],
                component: CalendarComponent
            },
            {
                path: 'MisBeneficiarios',
                canActivate: [AuthGuard],
                component: ListFrequentTravelerComponent
            },
            {
                path: 'DetallesPedido/:id',
                canActivate: [AuthGuard],
                component: ReadOrderPaymentComponent
            },
            {
                path: 'CrearBeneficiarios',
                canActivate: [AuthGuard],
                component: CreateOrderDetailFormComponent,
            },
            {
                path: 'CrearAbono',
                canActivate: [AuthGuard],
                component: CreatePaymentFormComponent,
            },
        ]
    },
    {
        path: '',
        canActivate: [NonAuthGuard],
        component: MainPublicComponent,
        canActivateChild: [NonAuthGuard],
        children: [
            {
                path: '',
                component: PublicHomeComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'contactUs',
                component: ContactUsComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'aboutUs',
                component: AboutUsComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'Paquetes',
                component: PackagesComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'detailsPackage/:id',
                component: DetailsPackageComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'register',
                component: RegisterComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'recover-password',
                component: RecoverPasswordComponent,
                canActivate: [NonAuthGuard]
            }
        ]
    },

    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
