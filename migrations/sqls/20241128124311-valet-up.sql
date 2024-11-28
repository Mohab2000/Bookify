/* Replace with your SQL commands */
CREATE TABLE valet (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  -- Foreign key referencing the users table
    availability VARCHAR(50) DEFAULT 'available',  -- E.g., 'available', 'on-duty'
    rating DECIMAL(3, 2) DEFAULT 0.00,  -- Rating from customers (default 0)
    assigned_vehicle_id INT,  -- Optional: Car assigned to the valet
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_vehicle_id) REFERENCES cars(id) ON DELETE SET NULL
);
