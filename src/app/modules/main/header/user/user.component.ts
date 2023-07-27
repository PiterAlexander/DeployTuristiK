import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { DateTime } from 'luxon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { GetAllCustomerRequest, GetAllEmployeeRequest, GetUserInfoRequest, OpenModalCreateCustomer, OpenModalCreateEmployee } from '@/store/ui/actions';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '@/models/customer';
import { Employee } from '@/models/employee';



@Component({
    selector: 'app-profilemenu',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user: any;
    public allInfo: any;
    public customersList: Array<any>;
    public employeesList: Array<any>;
    public ui: Observable<UiState>;


    constructor(private appService: AppService, private confirmationService: ConfirmationService, private messageService: MessageService, private store: Store<AppState>, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.user = this.appService.user;
        console.log(typeof (this.user));
        this.store.dispatch(new GetAllCustomerRequest());
        this.store.dispatch(new GetAllEmployeeRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.customersList = state.allCustomers.data
            this.employeesList = state.allEmployees.data

        });
        this.info();
    }

    get visible(): boolean {
        return this.appService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.appService.state.profileSidebarVisible = _val;
    }

    info() {
        this.appService.getProfile();
        console.log("infoo: ", this.user)

        setTimeout(() => {
            if (this.user.role === 'Cliente') {
                this.allInfo = this.customersList.find(c => c.user.userId == this.user.id)
                console.log(this.allInfo)

            } else {
                this.allInfo = this.employeesList.find(e => e.user.userId == this.user.id)
                console.log(this.allInfo)
            }

        }, 2000)
    }

    logoutConfirm(event: Event) {
        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget,
            message: '¿Seguro quieres cerrar sesión?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: "Sí",
            rejectLabel: "No",
            accept: () => {
                this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Sesión cerrada' });
                this.appService.logout();
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Sesión activa' });
            }
        });
    }

    formatDate(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    }

    editCustomer(customer: Customer) {
        const oneCustomer = {
            action: 'editCustomer',
            customer: customer
        }
        this.store.dispatch(new OpenModalCreateCustomer({ ...oneCustomer }))
    }

    editEmployee(employee: Employee) {
        this.store.dispatch(new OpenModalCreateEmployee(employee));
    }
}
