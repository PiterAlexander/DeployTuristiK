import { Package } from "@/models/package";

export default <PackageState>{ 
    allPackages: {
        data: [],
        error: undefined,
        loading: false
    }
};

export interface PackageState{
    allPackages: {
        data: Array<Package>,
        error: string,
        loading: boolean
    }
}
