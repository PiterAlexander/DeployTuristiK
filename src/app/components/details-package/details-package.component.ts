import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {ApiService} from '@services/api.service';
import { Location } from '@angular/common';
import {
    GetAllCustomerRequest,
    GetAllPackagesRequest,
    OpenModalCreateOrderDetail
} from '@/store/ui/actions';
import {Package} from '@/models/package';
import {Customer} from '@/models/customer';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@services/auth/auth.service';

@Component({
    selector: 'app-details-package',
    templateUrl: './details-package.component.html',
    styleUrls: ['./details-package.component.scss']
})
export class DetailsPackageComponent implements OnInit {
    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private location: Location
    ) {}
    public ui: Observable<UiState>;
    public packagesList: Array<Package>;
    public filteredPackagesList: Array<Package>;
    public loading: boolean;
    public search: string;
    public total: number;
    arrayPackagesClient: Array<Package>;

    color: string = 'bluegray';

    size: string = 'M';

    liked: boolean = false;

    images: string[] = [];

    selectedImageIndex: number = 0;
    isLoggedIn: boolean = false;
    quantity: number = 1;
    public pack;
    public role;
    public user;
    public allCustomers: Array<Customer>;
    elementId: string;
    ngOnInit(): void {
        this.ui = this.store.select('ui');
        this.store.dispatch(new GetAllPackagesRequest());
        this.store.dispatch(new GetAllCustomerRequest());
        this.ui.subscribe((state: UiState) => {
            this.packagesList = state.allPackages.data;
            this.route.paramMap.subscribe((params) => {
                this.elementId = params.get('id');
                this.pack = this.packagesList.find(
                    (e) => e.packageId === this.elementId
                );
            });
            this.allCustomers = state.allCustomers.data
            this.arrayPackagesClient = state.allPackages.data.filter(
                (element) => element.availableQuotas > 0
            );
            this.loading = state.allPackages.loading;
            this.user = JSON.parse(localStorage.getItem('TokenPayload'));
            this.role = this.user['role'];
            
        });
        this.images = [
            'https://cdn.colombia.com/images/v2/turismo/sitios-turisticos/tolu/Mar-Caribe-en-tolu-Covenas-en-Colombia-800.jpg',
            'https://chipviajero.com/wp-content/uploads/2018/05/Como-Llegar-a-Tol%C3%BA-Y-Cove%C3%B1as-Chip-Viajero-5.jpg',
            'https://i0.wp.com/fushoots.com/wp-content/uploads/2020/06/covenas-y-tolu.jpg?fit=1000%2C563&ssl=1',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/227337583.jpg?k=1420126e344632715bd61aa55ba85d173ff554526f2d36d6137aa95b0fac1cfe&o=&hp=1',
            'https://cdn.colombia.com/images/v2/turismo/sitios-turisticos/tolu/Mar-Caribe-en-tolu-Covenas-en-Colombia-800.jpg',
            'https://chipviajero.com/wp-content/uploads/2018/05/Como-Llegar-a-Tol%C3%BA-Y-Cove%C3%B1as-Chip-Viajero-5.jpg'
        ];
        this.isLoggedIn = this.authService.isAuthenticated();
    }

    goBack() {
        this.location.back();
    }

    reserve(onePackage: Package, cant: number) {
        const customer: Customer = this.allCustomers.find(
            (c) => c.userId === this.user['id']
        );
        console.log(cant);
        
        const orderProcess = [
            {
                action: 'CreateOrder',
                order: {
                    customer: customer,
                    package: onePackage
                },
                beneficiaries: {}
            }
        ];
        this.store.dispatch(new OpenModalCreateOrderDetail(orderProcess));
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
