export interface recoverPasswordEmail {
    To: string;
    Subject: string;
    Body: string;
}

export interface sendPQRS {
    From: string;
    EmailAddress: string;
    Subject: string;
    Body: string;
}

export interface mailRecepcion {
    orderId: string,
    amount: number
}

export interface paymentStatusMail {
    orderId: string,
    paymentId?: string,
    cause?: string
}
