CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    qtd INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_products_products FOREIGN KEY(product_id) REFERENCES products(id),
    CONSTRAINT fk_order_products_orders FOREIGN KEY(order_id) REFERENCES orders(id)
)