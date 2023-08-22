import { Customer } from "./customer";
import { Package } from "./package";
import { Payment } from "./payment";

export interface Order {
    orderId?: string
    customerId: string
    customer?: Customer
    packageId: string
    package?: Package
    totalCost: number
    orderDate: Date
    status: number
    payment?: Payment[]
}