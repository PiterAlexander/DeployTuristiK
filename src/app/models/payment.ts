export interface Payment {
    paymentId?: String;
    orderId?: String;
    amount: number;
    remainingAmount: number;
    date: Date
    image: String;
    status: number
}