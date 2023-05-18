import { Package } from "@/models/package";
import { Permission } from "@/models/permission";
import { Role } from '@/models/role';

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
    allPermissions: {
      data: [],
      error: undefined,
      loading: false
    },
    allRoles:{
      data: [],
      error: undefined,
      loading: false
    },
    oneRole:{
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
    };
    allPermissions :{
      data: Array<Permission>,
      error: string,
      loading: boolean
    };
    allRoles:{
      data: Array<Role>,
      error: string,
      loading: boolean
    };
    oneRole:{
      data: Role,
      error: string,
      loading: boolean
    }
}
