import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Location } from '@angular/common';
import {
    GetAllCustomerRequest,
    GetAllPackagesRequest,
    SaveOrderProcess,
} from '@/store/ui/actions';
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
    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private location: Location
    ) { }
    public ui: Observable<UiState>;
    public packagesList: Array<Package>;
    public filteredPackagesList: Array<Package>;
    public loading: boolean;
    public search: string;
    public total: number;
    public orderProcess: any
    arrayPackagesClient: Array<Package>;

    color: string = 'bluegray';

    size: string = 'M';

    liked: boolean = false;

    images: string[] = [];
    visibleMember: number = -1;
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
            this.orderProcess = state.orderProcess.data
            this.packagesList = state.allPackages.data;
            this.route.paramMap.subscribe((params) => {
                this.elementId = params.get('id');
                this.pack = this.packagesList.find(
                    (e) => e.packageId === this.elementId
                );
                const photosString = this.pack?.photos || '';
                const photosArray = photosString.split(',').map(photo => photo.trim());

                this.images = photosArray;
                // this.images = photosArray.slice(0, 7);
            });
            this.allCustomers = state.allCustomers.data;
            this.arrayPackagesClient = state.allPackages.data.filter(
                (element) => element.availableQuotas > 0
            );
            this.loading = state.allPackages.loading;
            this.user = JSON.parse(localStorage.getItem('TokenPayload'));
            this.role = this.user['role'];
        });

        this.isLoggedIn = this.authService.isAuthenticated();
    }

    goBack() {
        this.location.back();
    }

    reserve(onePackage: Package, cant: number) {
        const customer: Customer = this.allCustomers.find(
            (c) => c.userId === this.user['id']
        );

        const orderProcess =
        {
            action: 'CreateOrder',
            order: {
                customer: customer,
                package: onePackage
            },
            beneficiaries: {}
        }
        this.store.dispatch(new SaveOrderProcess({ ...orderProcess }));
        this.router.navigate(['Home/ProcesoBeneficiarios'])
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
