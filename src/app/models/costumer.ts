import { FrequentTraveler } from "./frequentTraveler";
import { User } from "./user";
export interface Costumer {
    costumerId?: string
    name:string;
    lastName:string;
    document:string;
    birthDate:Date;
    phoneNumber:string;
    address:string;
    eps:string;
    User?:User;
    userId?:string;
    frequentTraveler?:FrequentTraveler[];
}