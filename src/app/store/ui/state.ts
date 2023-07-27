import { Package } from "@/models/package";
import { Order } from "@/models/order";
import { Role } from '@/models/role';
import { Permission } from "@/models/permission";
import { Customer } from "@/models/customer";
import { User } from "@/models/user";
import { Employee } from "@/models/employee";
import { Token, UserLog } from "@/models/token";
import { Payment } from "@/models/payment";

export default <UiState>{
  //<--- TOGGLER --->
  darkMode: false,
  navbarVariant: 'navbar-light',
  sideVariant: 'close',
  menuSidebarCollapsed: false,
  controlSidebarCollapsed: true,
  //<--------------->
  //<--- PACAKGE --->
  allPackages: {
    data: [],
    error: undefined,
    loading: false
  },
  allTopPackages: {
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
  orderProcess: {
    data: [],
    error: undefined,
    loading: false
  },
  oneOrder: {
    data: undefined,
    error: undefined,
    loading: false
  },
  onePayment: {
    data: undefined,
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
  //<--- CUSTOMERS --->
  allCustomers: {
    data: [],
    error: undefined,
    loading: false
  },
  oneCustomer: {
    data: undefined,
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
  oneEmployee: {
    data: undefined,
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
  },
  //<------------->

  //<--- LOGIN --->
  token: {
    data: undefined,
    error: undefined,
    loading: false
  },
  //<----------------->
  userLoged: {
    data: undefined,
    error: undefined,
    loading: false
  },
  //<-------------->
  //<--SAVE DATE CALENDAR SELECTE-------->

  dateCalendarSelected: {
    data: undefined,
    error: undefined,
    loading: false
  }
  //<----------------------------------->
};


export interface UiState {
  //<--- TOGGLER --->
  darkMode: boolean;
  sideVariant:string;
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
  allTopPackages: {
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
  orderProcess: {
    data: Array<any>,
    error: string,
    loading: boolean
  };
  oneOrder: {
    data: Order,
    error: string,
    loading: boolean
  };
  onePayment: {
    data: Payment,
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
  //<--- CUSTOMERS --->
  allCustomers: {
    data: Array<Customer>,
    error: string,
    loading: boolean
  };
  oneCustomer: {
    data: Customer,
    error: string,
    loading: boolean
  };
  //<----------------->
  //<--- EMPLOYEES --->
  allEmployees: {
    data: Array<Employee>,
    error: string,
    loading: boolean
  };
  oneEmployee: {
    data: Employee,
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

  //<--- LOGIN --->
  token: {
    data: Token,
    error: string,
    loading: boolean
  }
  userLoged: {
    data: UserLog,
    error: string,
    loading: boolean
  }
  //<-------------->

  //<--SAVE DATE CALENDAR SELECTE-------->
  dateCalendarSelected: {
    data: Date,
    error: undefined,
    loading: false
  }
  //<----------------------------------->
}
