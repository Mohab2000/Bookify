/* Replace with your SQL commands */
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    model VARCHAR(100),
    make VARCHAR(100),
    year INT,
    color VARCHAR(50),
    customer_id INT,   -- Optional foreign key to link a car to a customer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
);
