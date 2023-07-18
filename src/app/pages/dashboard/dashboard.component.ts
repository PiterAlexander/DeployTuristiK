<<<<<<< HEAD
import {Component} from '@angular/core';
import { Subscription } from 'rxjs';
=======
import { Order } from '@/models/order';
import { Package } from '@/models/package';
import { AppState } from '@/store/state';
import { GetAllOrdersRequest, GetTopPackagesRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
>>>>>>> 35f71f4935920362fa62791fda4f5453ea575b5a

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
<<<<<<< HEAD
export class DashboardComponent {
    
    data: any;

    chartOptions: any;

    subscription: Subscription;


    constructor() {}

    ngOnInit() {
        this.data = {
            datasets: [{
                data: [
                    11,
                    16,
                    7,
                    3,
                    14
                ],
                backgroundColor: [
                    "#42A5F5",
                    "#66BB6A",
                    "#FFA726",
                    "#26C6DA",
                    "#7E57C2"
                ],
                label: 'My dataset'
            }],
            labels: [
                "Red",
                "Green",
                "Yellow",
                "Grey",
                "Blue"
            ]
        };

    }

    getLightTheme() {
        return {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        }
    }

    getDarkTheme() {
        return {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(255,255,255,0.2)'
                    }
                }
            }
        }
    }
=======
export class DashboardComponent implements OnInit {

  public ui: Observable<UiState>;

  pieData: any;

  pieOptions: any;
  public packagesList: Array<Package>;
  public ordersList: Array<Order> = []

  constructor(private store: Store<AppState>){

  }

  ngOnInit(): void {
    this.store.dispatch(new GetTopPackagesRequest());
    this.store.dispatch(new GetAllOrdersRequest())
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.packagesList = state.allTopPackages.data
      this.ordersList = state.allOrders.data
      this.initCharts();
    });
  }

  initCharts(){
    const documentStyle = getComputedStyle(document.documentElement);

   if(this.packagesList.length>0){


    let cantidad1 = this.ordersList.filter(o => o.packageId === this.packagesList[0].packageId).length;
    let cantidad2 = this.ordersList.filter(o => o.packageId === this.packagesList[1].packageId).length;
    let cantidad3 = this.ordersList.filter(o => o.packageId === this.packagesList[2].packageId).length;

    this.pieData = {
      labels: [this.packagesList[0].name, this.packagesList[1].name, this.packagesList[2].name],
        datasets: [
            {
                data: [
                  cantidad1, cantidad2, cantidad3
                ],
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
   }
  }
>>>>>>> 35f71f4935920362fa62791fda4f5453ea575b5a
}
