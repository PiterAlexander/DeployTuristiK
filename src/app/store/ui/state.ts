import { Package } from "@/models/package";

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
    }
}
