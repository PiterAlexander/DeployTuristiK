export interface Order {
    paymentId:String;
    orderId:String;
    amount:number;
    remainingAmount:number;
    date:Date
    image:String;
    status:number
}