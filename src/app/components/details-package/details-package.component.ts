import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { GetAllCustomerRequest, GetAllPackagesRequest, OpenModalCreateOrderDetail } from '@/store/ui/actions';
import { Package } from '@/models/package';
import { Customer } from '@/models/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-details-package',
  templateUrl: './details-package.component.html',
  styleUrls: ['./details-package.component.scss']
})
export class DetailsPackageComponent implements OnInit {
  constructor(private store: Store<AppState>, private service: ApiService, private route: ActivatedRoute,private router: Router,private authService: AuthService) { }
  public ui: Observable<UiState>;
  public packagesList: Array<Package>;
  public filteredPackagesList: Array<Package>;
  public loading: boolean;
  public search: string
  public total: number
  arrayPackagesClient: Array<Package>

  color: string = 'bluegray';

  size: string = 'M';

  liked: boolean = false;

  images: string[] = [];

  selectedImageIndex: number = 0;
  isLoggedIn: boolean = false;
  quantity: number = 1;
  public pack
  public role;
  public user;
  public allCustomers: Array<Customer>
  elementId: string
  ngOnInit(): void {
    this.ui = this.store.select('ui')
    this.store.dispatch(new GetAllPackagesRequest());
    this.store.dispatch(new GetAllCustomerRequest())
    this.ui.subscribe((state: UiState) => {
      this.packagesList = state.allPackages.data;
      this.route.paramMap.subscribe(params => {
        
        
        this.elementId  = params.get('id')
        this.pack = this.packagesList.find(e => e.packageId === this.elementId);
        console.log(this.pack);
      });
      this.arrayPackagesClient = state.allPackages.data.filter(element => element.availableQuotas > 0);
      this.loading = state.allPackages.loading
      this.user = JSON.parse(localStorage.getItem('TokenPayload'))
      this.role = this.user['role']
    });
    this.images = [
      'https://img.freepik.com/vector-gratis/ilustracion-arte-linea-dibujada-mano_23-2149279750.jpg',
      'https://img.freepik.com/vector-premium/flor-minimalista-dibujada-mano-arte-lineal_278222-309.jpg',
      'https://img.freepik.com/vector-premium/moderno-moderno-arte-linea-dibujado-mano-ilustracion-flores-botanicas-poster-arte-pared_402533-916.jpg',
      'https://img.freepik.com/vector-gratis/ilustracion-arte-linea-dibujada-mano_23-2149279746.jpg?w=2000'
    ];
    this.isLoggedIn = this.authService.isAuthenticated();
    
  }


  reserve(onePackage: Package) {
    const customer: Customer = this.allCustomers.find(c => c.userId === this.user['id'])
    const orderProcess = [{
      action: "CreateOrderFromCustomer",
      order: {
        customer: customer,
        package: onePackage
      },
      beneficiaries: {}
    }]
    this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess))
  }

  
goToLogin() {
  // Redirigir al usuario a la página de inicio de sesión
  this.router.navigate(['/login']);
}
}
