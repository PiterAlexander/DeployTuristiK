import { AssociatedPermission } from "./associated-permission";

export interface Role {
  roleId?:string,
  name:string,
  status:number,
  associatedPermission?:AssociatedPermission[]
}
