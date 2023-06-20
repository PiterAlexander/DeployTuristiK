import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { GetOnePackageRequest } from '@/store/ui/actions';

@Component({
  selector: 'app-details-package',
  templateUrl: './details-package.component.html',
  styleUrls: ['./details-package.component.scss']
})
export class DetailsPackageComponent implements OnInit {


  public ui: Observable<UiState>
  public packageData
  constructor(private modalService: NgbModal, private store: Store<AppState>, private service: ApiService) { }

  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.packageData = state.onePackage.data
      if(this.packageData !=  null){
        console.log(this.packageData)
      } else{
        console.log("no hay nada wn")
      }
    })
  }

   

  cancel() {
    this.modalService.dismissAll();
  }

}
