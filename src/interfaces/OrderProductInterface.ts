import ProductInterface from "./ProductInterface";

export default interface OrderProductInterface{
    id: number;
    order_id: number;
    product_id: number;
    qtd: number;
    created_at: Date;
    updated_at: Date;
    product: ProductInterface;
}