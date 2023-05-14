import { Package } from '@/models/package';
import { GetAllPackagesRequest, OpenModalCreatePackage } from '@/store/package/actions';
import { PackageState } from '@/store/package/state';
import { AppState } from '@/store/state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit{
  public packageStorage: Observable<PackageState>;

  public packageList: Array<Package>;
  public loading: boolean;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllPackagesRequest());

    this.packageStorage = this.store.select('packageStorage');
        this.packageStorage.subscribe((state: PackageState) => {
            console.log(state.allPackages);
        });
  }

  openModalCreatePackage(){
    this.store.dispatch(new OpenModalCreatePackage());
  }
}
