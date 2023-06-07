import { OrderDetail } from "./orderDetail";
import { Payment } from "./payment";

export interface Order {
    orderId?: string;
    costumerId: string;
    packageId: string;
    totalCost: number;
    status: number;
    payment: Payment[],
    orderDetail: OrderDetail[]
}