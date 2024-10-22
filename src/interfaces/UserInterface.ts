import OrderInterface from "./OrderInterface";

export default interface UserInterface{
    id: number;
    name: string;
    email: string;
    password: string;
    salt: string;
    active: boolean;
    is_admin: boolean;
    email_verified: boolean;
    access_token: string;
    created_at: string;
    updated_at: string;
    orders: OrderInterface[];
    customer_id: string;
}