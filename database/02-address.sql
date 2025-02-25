CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    postal_code TEXT NULL,
    local TEXT NULL,
    CONSTRAINT fk_adress_user FOREIGN KEY(user_id) REFERENCES users(id)
)