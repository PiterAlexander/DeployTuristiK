import { Costumer } from "./costumer";
import { Employee } from "./employee";
import { Role } from "./role";

export interface User {
  userId?: string,
  userName: string,
  email: string,
  password: string,

  status: number,
  roleId?: string;
  
  role?: Role
  employee?: Employee,
  costumer?: Costumer,
}
