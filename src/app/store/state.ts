import { PackageState } from './package/state';
import {UiState} from './ui/state';

export interface AppState {
    auth: any;
    ui: UiState;
    packageStorage: PackageState;
}
