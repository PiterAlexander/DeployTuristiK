import { Package } from "@/models/package";
import { Order } from "@/models/order";
import { Role } from '@/models/role';
import { Permission } from "@/models/permission";
import { Costumer } from "@/models/costumer";
import { User } from "@/models/user";

export default <UiState>{
  //<--- TOGGLER --->
  darkMode: false,
  navbarVariant: 'navbar-light',
  sidebarSkin: 'sidebar-dark-primary',
  menuSidebarCollapsed: false,
  controlSidebarCollapsed: true,
  //<--------------->
  //<--- PACAKGE --->
  allPackages: {
    data: [],
    error: undefined,
    loading: false
  },
  onePackage: {
    data: undefined,
    error: undefined,
    loading: false
  },
  //<-------------->
  //<--- ORDERS --->
  allOrders: {
    data: [],
    error: undefined,
    loading: false
  },
  //<----------------------------->
  //<--- ROLES AND PERMISSIONS --->
  allRoles: {
    data: [],
    error: undefined,
    loading: false
  },
  oneRole: {
    data: undefined,
    error: undefined,
    loading: false
  },
  allPermissions: {
    data: [],
    error: undefined,
    loading: false
  },
  //<----------------->
  //<--- COSTUMERS --->
  allCostumers: {
    data: [],
    error: undefined,
    loading: false
  },
  //<----------------->
  //<--- EMPLOYEES --->
  allEmployees: {
    data: [],
    error: undefined,
    loading: false
  },
  //<------------->
  //<--- USERS --->
  allUsers: {
    data: [],
    error: undefined,
    loading: false
  },
  currentUser: {
    data: undefined,
    error: undefined,
    loading: false
  }
};


export interface UiState {
  //<--- TOGGLER --->
  darkMode: boolean;
  menuSidebarCollapsed: boolean;
  controlSidebarCollapsed: boolean;
  navbarVariant: string;
  sidebarSkin: string;
  screenSize: any;
  //<---------------->
  //<--- PACKAGES --->
  allPackages: {
    data: Array<Package>,
    error: string,
    loading: boolean
  },
  onePackage: {
    data: Package,
    error: string,
    loading: boolean
  },
  //<-------------->
  //<--- ORDERS --->
  allOrders: {
    data: Array<Order>,
    error: string,
    loading: boolean
  };
  //<----------------------------->
  //<--- ROLES AND PERMISSIONS --->
  allRoles: {
    data: Array<Role>,
    error: string,
    loading: boolean
  };
  oneRole: {
    data: Role,
    error: string,
    loading: boolean
  }
  allPermissions: {
    data: Array<Permission>,
    error: string,
    loading: boolean
  };
  //<----------------->
  //<--- COSTUMERS --->
  allCostumers: {
    data: Array<Costumer>,
    error: string,
    loading: boolean
  };
  //<----------------->
  //<--- EMPLOYEES --->
  allEmployees: {
    data: Array<Costumer>,
    error: string,
    loading: boolean
  };
  //<------------->
  //<--- USERS --->
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
  //<------------->
}
