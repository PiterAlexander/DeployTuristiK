import { Customer } from '@/models/customer';
import { Order } from '@/models/order';
import { Package } from '@/models/package';
import { Payment } from '@/models/payment';
import { User } from '@/models/user';
import { AppState } from '@/store/state';
import {
    GetAllCustomerRequest,
    GetAllOrdersRequest,
    GetAllPaymentsRequest,
    GetTopPackagesRequest,
    GetUsersRequest
} from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { differenceInYears } from 'date-fns';
import { ChartModule } from 'primeng/chart';
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
    public customerCount: number;
    public paymentCurrentMonth: number;
    public ordersCurrentMonth: number;
    ageChartData: any;
    chartData: any; // Puedes ajustar el tipo según el formato de datos del gráfico
    chartOptions: any;
    public lineChartData: any = {};

    showDate: string;
    basicData: any;
    barOptions: any;
    selectedYear: any;
    years: Array<number>;


    public lineChartOptions: any = {
        legend: {
            display: true,
            position: 'top'
        }
    };

    public dataLoaded = false;

    constructor(private store: Store<AppState>, private messageService: MessageService) { }

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
            this.ordersList = state.allOrders.data.filter(o => o.status !== 3);
            this.payments = state.allPayments.data.filter(p => p.status === 1);
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
                    borderColor: '#6366F1',
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
        const currentDate = new Date();
        this.showDate = (currentDate.getMonth() + 1).toString().padStart(2, '0') + "/" + currentDate.getFullYear().toString().slice(-2);

        this.ordersCurrentMonth = 0
        this.paymentCurrentMonth = 0;


        for (let i = 0; i < this.ordersList.length; i++) {
            const date = new Date(this.ordersList[i].orderDate);
            if (
                date.getMonth() == currentDate.getMonth() &&
                date.getFullYear() == currentDate.getFullYear()
            ) {
                this.ordersCurrentMonth += this.ordersList[i].totalCost;
            }
        }


        for (let i = 0; i < this.payments.length; i++) {
            const date = new Date(this.payments[i].date);
            if (
                date.getMonth() == currentDate.getMonth() &&
                date.getFullYear() == currentDate.getFullYear()
            ) {
                this.paymentCurrentMonth += this.payments[i].amount;
            }
        }


        this.customerCount = this.customers.length;

        this.initSecondChart(currentDate.getFullYear());
        this.years = []
        for (let y = 2023; y <= currentDate.getFullYear() + 1; y++) {
            this.years.push(y)
        }
    }

    calculateAgeData(
        customers: Array<Customer>
    ): Array<{ label: string; value: number }> {
        const ageRanges = [
            { label: '0-20', minAge: 0, maxAge: 20 },
            { label: '21-40', minAge: 21, maxAge: 40 },
            { label: '41-60', minAge: 41, maxAge: 60 },
            { label: '61-80', minAge: 61, maxAge: 80 },
            { label: '81+', minAge: 81, maxAge: 999 }
        ];

        const ageData = ageRanges.map((range) => {
            const customersInRange = customers.filter((customer) => {
                const age = differenceInYears(
                    new Date(),
                    new Date(customer.birthDate)
                );
                return age >= range.minAge && age <= range.maxAge;
            });
            return { label: range.label, value: customersInRange.length };
        });
        return ageData;

    }

    initSecondChart(year: number) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        var arraytotalOrders: Array<number> = []
        var arraytotalpayments: Array<number> = []

        for (let i = 0; i < 12; i++) {
            var datitaVentas: number = 0
            var datitaPayments: number = 0
            for (let j = 0; j < this.ordersList.length; j++) {
                const date = new Date(this.ordersList[j].orderDate);
                if (
                    date.getMonth() == i &&
                    date.getFullYear() == year
                ) {
                    datitaVentas += this.ordersList[j].totalCost;
                }
            }
            arraytotalOrders.push(datitaVentas)

            for (let k = 0; k < this.payments.length; k++) {
                const date = new Date(this.payments[k].date);
                if (
                    date.getMonth() == i &&
                    date.getFullYear() == year
                ) {
                    datitaPayments += this.payments[k].amount;
                }
            }
            arraytotalpayments.push(datitaPayments)
        }

        this.basicData = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: 'Total Ventas Estimadas',
                    backgroundColor: documentStyle.getPropertyValue('--primary-700'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: arraytotalOrders
                },
                {
                    label: 'Total Ingresos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-400'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: arraytotalpayments
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700,
                        },
                        padding: 28
                    },
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    onYearChange() {
        this.initSecondChart(this.selectedYear)
    }
}
