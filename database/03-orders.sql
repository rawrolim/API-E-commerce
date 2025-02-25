CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    checkout_id TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_users FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_order_addresses FOREIGN KEY(address_id) REFERENCES address(id)
)