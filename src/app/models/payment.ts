export interface Payment {
    paymentId?: string;
    orderId?: string;
    amount: number;
    remainingAmount: number;
    date: Date
    image: string;
    status: number
}