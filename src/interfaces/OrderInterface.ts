import OrderProductInterface from "./OrderProductInterface";

export default interface OrderInterface{
    id: number;
    user_id: number;
    checkout_id: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    value: number;
    products: OrderProductInterface[]
}