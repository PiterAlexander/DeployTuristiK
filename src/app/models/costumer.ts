import { FrequentTraveler } from "./frequentTraveler";
export interface Costumer {
    costumerId?: string
    name:string;
    lastName:string;
    document:string;
    birthDate:Date;
    phoneNumber:string;
    address:string;
    EPS:string;
    userId?:string;
    frequentTravel:FrequentTraveler[];
}