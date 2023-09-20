import { Order } from "./order";
import { OrderDetail } from "./orderDetail";

export interface Payment {
    paymentId?: string
    orderId?: string
    order?: Order
    amount: number
    remainingAmount: number
    date: string
    image?: string
    imageFile?: File
    orderDetailJson?: string
    status: number
    orderDetail?: OrderDetail[]
}