import { Costumer } from '@/models/costumer';
import { FrequentTraveler } from '@/models/frequentTraveler';
import { AppState } from '@/store/state';
import { GetAllCostumerRequest, OpenModalCreateFrequentTraveler } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { element } from 'protractor';
import { Observable } from 'rxjs';

interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-list-frequent-traveler',
  templateUrl: './list-frequent-traveler.component.html',
  styleUrls: ['./list-frequent-traveler.component.scss']
})
export class ListFrequentTravelerComponent {
  public filteredFrequentTravelerList: Array<Costumer>;
  public search: string
  public total: number
  public ui: Observable<UiState>
  public FrequentTravelerList: Array<any>
  public costumerData : Costumer
  public frequentTravelers : Array<FrequentTraveler>
  public allCostumer : Array<Costumer>
  public frequentTravelerCostumers : Array<Costumer> = []

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(private fb: FormBuilder, private modalService: NgbModal, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllCostumerRequest)
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.allCostumer = state.allCostumers.data
      this.costumerData = state.oneCostumer.data
      this.frequentTravelers = state.oneCostumer.data.frequentTraveler
      this.compareCostumerId() 
      console.log(this.frequentTravelers)
    })
  }

  compareCostumerId(){
    for(const element of this.frequentTravelers){
    const costumer = this.allCostumer.find(c => c.costumerId === element.travelerId) 
    if (costumer != undefined) {
      this.frequentTravelerCostumers.push(costumer)  
    }
    };
  }

  openModalCreateFrequentTraveler() {
    this.store.dispatch(new OpenModalCreateFrequentTraveler(this.costumerData));
    console.log(this.frequentTravelerCostumers)
  }

  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredFrequentTravelerList = this.FrequentTravelerList;
      this.total = this.filteredFrequentTravelerList.length;
      this.filteredFrequentTravelerList = this.filteredFrequentTravelerList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredFrequentTravelerList = this.FrequentTravelerList.filter(frequentTravelerModel => frequentTravelerModel.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredFrequentTravelerList.length;
      this.filteredFrequentTravelerList = this.filteredFrequentTravelerList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }


  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this.searchByName();
  }
  
  cancel() {
    this.modalService.dismissAll();
  }
}
