import {Customer} from '@/models/customer';
import {Order} from '@/models/order';
import {Package} from '@/models/package';
import {Payment} from '@/models/payment';
import {User} from '@/models/user';
import {AppState} from '@/store/state';
import {
    GetAllCustomerRequest,
    GetAllOrdersRequest,
    GetAllPaymentsRequest,
    GetTopPackagesRequest,
    GetUsersRequest
} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {differenceInYears} from 'date-fns';
import {ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    public ui: Observable<UiState>;

    pieData: any;
    pieOptions: any;
    public customers: Array<User>;
    public payments: Array<Payment>;
    public packagesList: Array<Package>;
    public allCustomers: Array<Customer>;
    public ordersList: Array<Order> = [];
    public porCupSep: number = 20;
    public porAbo: number;
    public porVen: number = 40;
    public customerCount: number;
    public paymentCurrentMonth: number;
    public paymentLastMonth: number;
    public randomPayments: number;
    public loadingPayments = true;
    ageChartData: any;
    chartData: any; // Puedes ajustar el tipo según el formato de datos del gráfico
    chartOptions: any;
    public lineChartData: any = {};

    public lineChartOptions: any = {
        legend: {
            display: true,
            position: 'top'
        }
    };

    public dataLoaded = false;

    constructor(private store: Store<AppState>, private messageService: MessageService) {}

    ngOnInit(): void {
        this.store.dispatch(new GetTopPackagesRequest());
        this.store.dispatch(new GetAllOrdersRequest());
        this.store.dispatch(new GetUsersRequest());
        this.store.dispatch(new GetAllPaymentsRequest());
        this.store.dispatch(new GetAllCustomerRequest());
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.customers = state.allUsers.data.filter(
                (user) => user.role.name == 'Cliente'
            );
            this.packagesList = state.allTopPackages.data;
            this.ordersList = state.allOrders.data;
            this.payments = state.allPayments.data;
            this.allCustomers = state.allCustomers.data;
            this.initCharts();
            this.initValues();
            this.initAgeChartData();
        });
    }

    initAgeChartData() {
        const ageData = this.calculateAgeData(this.allCustomers);
        this.ageChartData = {
            labels: ageData.map(range => range.label),
            datasets: [
            {
                label: 'En el rango',
                data: ageData.map(range => range.value),
                backgroundColor: '#6366F1',
                borderColor:  '#6366F1',
                tension: .4
            },
            {
                label: '',
                data: [6],
                backgroundColor: 'transparent',
                borderColor: 'transparent',
            }
        ]
            
        };
        console.log(this.ageChartData);
        
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);

        if (this.packagesList.length >= 3) {
            let cantidad1 = this.ordersList.filter(
                (o) => o.packageId === this.packagesList[0].packageId
            ).length;
            let cantidad2 = this.ordersList.filter(
                (o) => o.packageId === this.packagesList[1].packageId
            ).length;
            let cantidad3 = this.ordersList.filter(
                (o) => o.packageId === this.packagesList[2].packageId
            ).length;

            this.pieData = {
                labels: [
                    this.packagesList[0].name,
                    this.packagesList[1].name,
                    this.packagesList[2].name
                ],
                datasets: [
                    {
                        data: [cantidad1, cantidad2, cantidad3],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--primary-700'),
                            documentStyle.getPropertyValue('--primary-400'),
                            documentStyle.getPropertyValue('--primary-100')
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--primary-600'),
                            documentStyle.getPropertyValue('--primary-300'),
                            documentStyle.getPropertyValue('--primary-200')
                        ]
                    }
                ]
            };

            this.pieOptions = {
                animation: {
                    duration: 0
                },
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            font: {
                                weight: 700
                            },
                            padding: 12
                        },
                        position: 'bottom'
                    }
                }
            };
        }
    }

    initValues() {
        this.paymentCurrentMonth = 0;
        this.paymentLastMonth = 0;
        this.porAbo = 0;

        this.loadingPayments = true;

        const currentDate = new Date();
        this.customerCount = this.customers.length;
        for (let i = 0; i < this.payments.length; i++) {
            this.randomPayments = Math.floor(Math.random() * 100);
            const date = new Date(this.payments[i].date);
            if (
                date.getMonth() == currentDate.getMonth() &&
                date.getFullYear() == currentDate.getFullYear()
            ) {
                this.paymentCurrentMonth += this.payments[i].amount;
            } else if (
                date.getMonth() == currentDate.getMonth() - 1 &&
                date.getFullYear() == currentDate.getFullYear()
            ) {
                this.paymentLastMonth += this.payments[i].amount;
            }
        }
        this.porAbo =
            ((this.paymentCurrentMonth - this.paymentLastMonth) /
                this.paymentCurrentMonth) *
            100;
        this.loadingPayments = false;
    }

    calculateAgeData(
        customers: Array<Customer>
    ): Array<{label: string; value: number}> {
        const ageRanges = [
            {label: '0-20', minAge: 0, maxAge: 20},
            {label: '21-40', minAge: 21, maxAge: 40},
            {label: '41-60', minAge: 41, maxAge: 60},
            {label: '61-80', minAge: 61, maxAge: 80},
            {label: '81+', minAge: 81, maxAge: 999}
        ];

        const ageData = ageRanges.map((range) => {
            const customersInRange = customers.filter((customer) => {
                const age = differenceInYears(
                    new Date(),
                    new Date(customer.birthDate)
                );
                return age >= range.minAge && age <= range.maxAge;
            });
            return {label: range.label, value: customersInRange.length};
        });
        return ageData;
        
    }
}
