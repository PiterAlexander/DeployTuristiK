export interface Package {
    packageId?: string;
    name: string;
    destination: string;
    details: string;
    transport: string;
    hotel: string;
    arrivalDate: Date;
    departureDate: Date;
    departurePoint: string;
    totalQuotas: number;
    availableQuotas: number;
    price: number;
    type: boolean;
    status: boolean;
    aditionalPrice: number;
    photos: string;
}
