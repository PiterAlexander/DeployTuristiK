import { User } from "./user";
export interface Employee {
    employeeId?: string
    name:string;
    lastName:string;
    document:string;
    phoneNumber:string;
    user?: User;
    userId?:string;
}