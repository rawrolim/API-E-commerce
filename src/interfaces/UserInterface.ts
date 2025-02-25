import AddressInterface from "./AddressInterface";
import OrderInterface from "./OrderInterface";

export default interface UserInterface{
    id: number;
    name: string;
    email: string;
    tel: string;
    password: string;
    salt: string;
    active: boolean;
    is_admin: boolean;
    email_verified: boolean;
    access_token: string;
    created_at: string;
    updated_at: string;
    orders: OrderInterface[];
    address: AddressInterface[];
    customer_id: string;
}