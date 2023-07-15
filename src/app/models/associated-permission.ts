import { Permission } from "./permission";
export interface AssociatedPermission {
  associatedPermissionId?: string;
  permissionId?: string;
  roleId?: string;
  permission?: Permission;
  temporalStatus?: boolean;
}
