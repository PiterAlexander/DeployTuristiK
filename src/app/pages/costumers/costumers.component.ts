import { Costumer } from '@/models/costumer';
import { GetAllCostumerRequest, OpenModalCreateCostumer} from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';

interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-costumers',
  templateUrl: './costumers.component.html',
  styleUrls: ['./costumers.component.scss']
})
export class CostumersComponent implements OnInit {
  public ui: Observable<UiState>;
  public costumersList: Array<Costumer>;
  public filteredCostumersList: Array<Costumer>;
  public loading: boolean;
  public search: string
  public total: number

  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new GetAllCostumerRequest());

    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.costumersList = state.allCostumers.data,
      this.loading = state.allCostumers.loading
      this.searchByName();
    });
  }

  matches(costumerResolved: Costumer, term: string, pipe: PipeTransform) {
    return (
      costumerResolved.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  openModalCreateCostumer() {
    this.store.dispatch(new OpenModalCreateCostumer());
  }

  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredCostumersList = this.costumersList;
      this.total = this.filteredCostumersList.length;
      this.filteredCostumersList = this.filteredCostumersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredCostumersList = this.costumersList.filter(costumerModel => costumerModel.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredCostumersList.length;
      this.filteredCostumersList = this.filteredCostumersList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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
}