import { Order } from "./order";
import { OrderDetail } from "./orderDetail";

export interface Payment {
    paymentId?: string
    orderId?: string
    order?: Order
    amount: number
    remainingAmount: number
    date: Date
    image?: string
    imageFile?: File
    status: number
    orderDetail?: OrderDetail[]
}