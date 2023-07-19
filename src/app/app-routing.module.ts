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


const routes: Routes = [
    {
        path: 'Home',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'Dashboard',
                canActivate: [AuthGuard],
                component: DashboardComponent
            },
            {
                path: 'profile',
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
        ]
    },
    {
        path: '',
        canActivate: [NonAuthGuard],
        component: MainPublicComponent,
        canActivateChild: [NonAuthGuard],
        children:[
            {
                path: '',
                component: PackagesComponent,
                canActivate: [NonAuthGuard]
            },
            {
                path: 'aboutUs',
                component: LoginComponent,
                canActivate:[NonAuthGuard]
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
            },
        ]
    },
    
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
