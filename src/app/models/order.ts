import { Costumer } from "./costumer";
import { OrderDetail } from "./orderDetail";
import { Package } from "./package";
import { Payment } from "./payment";

export interface Order {
    orderId?: string;
    costumerId: string;
    packageId: string;
    totalCost: number;
    status: number;
    payment: Payment[],
    orderDetail: OrderDetail[]
    package?: Package
    costumer?: Costumer
}