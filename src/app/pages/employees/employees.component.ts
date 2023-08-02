import { Employee } from '@/models/employee';
import { DeleteEmployeeRequest, GetAllCustomerRequest, GetAllEmployeeRequest, GetAllRoleRequest, GetUsersRequest, OpenModalCreateEmployee } from '@/store/ui/actions';
import { AppState } from '@/store/state';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from '@services/app.service';

interface State {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  public user
  public ui: Observable<UiState>;
  public employeesList: Array<Employee>;
  public filteredEmployeesList: Array<Employee>;
  public loading: boolean;
  public search: string
  public total: number
  public employeeData
  private _state: State = {
    page: 1,
    pageSize: 5
  };

  constructor(
    private store: Store<AppState>,
    private confirmationService: ConfirmationService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.user = this.appService.user
    this.store.dispatch(new GetAllCustomerRequest());
    this.store.dispatch(new GetAllRoleRequest());
    this.store.dispatch(new GetAllEmployeeRequest());
    this.store.dispatch(new GetUsersRequest())

    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.employeesList = state.allEmployees.data,
        this.loading = state.allEmployees.loading
      this.searchByName();
    });
  }

  matches(employeeResolver: Employee, term: string, pipe: PipeTransform) {
    return (
      employeeResolver.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  openModalCreateEmployee() {
    this.store.dispatch(new OpenModalCreateEmployee());
  }

  openModalEditEmployee(employee: Employee) {
    this.store.dispatch(new OpenModalCreateEmployee(employee));
  }

  deleteEmployee(employee: Employee) {
    this.confirmationService.confirm({
      header: 'Confirmación', // Cambia el encabezado del cuadro de confirmación
      message: '¿Está seguro de eliminar a ' + employee.name + '?',
      icon: 'pi pi-exclamation-triangle', // Cambia el icono del cuadro de confirmación
      acceptLabel: 'Eliminar', // Cambia el texto del botón de aceptar
      acceptIcon: 'pi pi-trash',
      rejectLabel: 'Cancelar', // Cambia el texto del botón de rechazar
      acceptButtonStyleClass: 'p-button-danger p-button-sm', // Agrega una clase CSS al botón de aceptar
      rejectButtonStyleClass: 'p-button-outlined p-button-sm', // Agrega una clase CSS al botón de rechazar
      accept: () => {
        // Lógica para confirmar
        this.store.dispatch(new DeleteEmployeeRequest(employee));
      }
    });
  }

  searchByName() {
    if (this.search === undefined || this.search.length <= 0) {
      this.filteredEmployeesList = this.employeesList;
      this.total = this.filteredEmployeesList.length;
      this.filteredEmployeesList = this.filteredEmployeesList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    } else {
      this.filteredEmployeesList = this.employeesList.filter(employeeModel => employeeModel.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase().trim()));
      this.total = this.filteredEmployeesList.length;
      this.filteredEmployeesList = this.filteredEmployeesList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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
