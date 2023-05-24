import { Package } from "@/models/package";
import { Order } from "@/models/order";

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
    }
    //<-------------------->
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
    }
    //<-------------------->
}
