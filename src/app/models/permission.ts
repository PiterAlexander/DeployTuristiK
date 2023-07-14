import { AssociatedPermission } from "./associated-permission";

export interface Permission {
  permissionId: string,
  module: string,
  status: number,
  associatedPermission?: AssociatedPermission[];
}
