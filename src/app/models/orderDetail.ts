import { Payment } from "./payment";

export interface OrderDetail {
    orderDetailId?: string
    paymentId?: string
    payment?: Payment
    beneficiaryId: string
    unitPrice: number
}