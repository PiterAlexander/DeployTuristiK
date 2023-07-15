import { Customer } from "./customer";
import { Employee } from "./employee";
import { Role } from "./role";

export interface User {
  userId?: string,
  email: string,
  password: string,

  status: number,
  roleId?: string;

  role?: Role
  employee?: Employee,
  customer?: Customer,
}
