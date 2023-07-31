import { Order } from '@/models/order';
import { Package } from '@/models/package';
import { AppState } from '@/store/state';
import { GetAllOrdersRequest, GetTopPackagesRequest } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public ui: Observable<UiState>;

  pieData: any;

  pieOptions: any;
  public packagesList: Array<Package>;
  public ordersList: Array<Order> = []
  public porCupSep: number = 45;
  public porAbo: number = 70;


  
  public lineChartData: any = {};

  public lineChartOptions: any = {
    legend: {
      display: true,
      position: 'top'
    }
  };

  public dataLoaded = false;

  constructor(private store: Store<AppState>) {

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


  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);

    if (this.packagesList.length > 0) {


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
}
