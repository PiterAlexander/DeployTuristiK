import { Customer } from "./customer";
import { OrderDetail } from "./orderDetail";
import { Package } from "./package";
import { Payment } from "./payment";

export interface Order {
    orderId?: string;
    customerId: string;
    packageId: string;
    totalCost: number;
    status: number;
    payment: Payment[],
    orderDetail: OrderDetail[]
    package?: Package
    customer?: Customer
}