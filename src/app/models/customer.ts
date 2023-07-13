import { FrequentTraveler } from "./frequentTraveler";
import { User } from "./user";
export interface Customer {
    customerId?: string
    name: string;
    lastName: string;
    document: string;
    birthDate: Date;
    phoneNumber: string;
    address: string;
    eps: string;
    user?: User;
    userId?: string;
    frequentTraveler?: FrequentTraveler[];
}