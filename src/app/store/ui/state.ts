import { Costumer } from "@/models/costumer";
import { Package } from "@/models/package";
import { Order } from "@/models/order";
import { Permission } from "@/models/permission";
import { Role } from '@/models/role';
import { User } from "@/models/user";

export default <UiState>{
  darkMode: false,
  navbarVariant: 'navbar-light',
  sidebarSkin: 'sidebar-dark-primary',
  menuSidebarCollapsed: false,
  controlSidebarCollapsed: true,
  allPackages: {
    data: [],
    error: undefined,
    loading: false
  },
  //<--- ORDER STATES --->
  allOrders: {
    data: [],
    error: undefined,
    loading: false
  },
  onePackage: {
    data: undefined,
    error: undefined,
    loading: false
  },
  allPermissions: {
    data: [],
    error: undefined,
    loading: false
  },
  allRoles: {
    data: [],
    error: undefined,
    loading: false
  },
  allCostumers: {
    data: [],
    error: undefined,
    loading: false
  },
  allEmployees: {
    data: [],
    error: undefined,
    loading: false
  },
  oneRole: {
    data: undefined,
    error: undefined,
    loading: false
  },
  //<-------------------->

  //<--USER STATES->
  allUsers: {
    data: [],
    error: undefined,
    loading: false
  },
  currentUser:{
    data: undefined,
    error: undefined,
    loading: false
  }
};


export interface UiState {
  darkMode: boolean;
  menuSidebarCollapsed: boolean;
  controlSidebarCollapsed: boolean;
  navbarVariant: string;
  sidebarSkin: string;
  screenSize: any;
  allPackages: {
    data: Array<Package>,
    error: string,
    loading: boolean
  },
  //<--- ORDER STATES --->
  allOrders: {
    data: Array<Order>,
    error: string,
    loading: boolean
  };
  onePackage: {
    data: Package,
    error: string,
    loading: boolean
  },
  allPermissions: {
    data: Array<Permission>,
    error: string,
    loading: boolean
  };
  allRoles: {
    data: Array<Role>,
    error: string,
    loading: boolean
  };
  allCostumers: {
    data: Array<Costumer>,
    error: string,
    loading: boolean
  };
  allEmployees: {
    data: Array<Costumer>,
    error: string,
    loading: boolean
  };
  oneRole: {
    data: Role,
    error: string,
    loading: boolean
  }
  //<-------------------->

  //<--USER STATES->
  allUsers: {
    data: Array<User>,
    error: string,
    loading: boolean
  }
  currentUser: {
    data: User,
    error: string,
    loading: boolean
  }
}
