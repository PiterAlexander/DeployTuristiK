import { AssociatedPermission } from "./associated-permission";
import { User } from "./user";

export interface Role {
  roleId?: string,
  name: string,
  status: number,
  user?: User[]
  associatedPermission?: AssociatedPermission[]
}
