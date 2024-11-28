/* Replace with your SQL commands */
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  -- Foreign key referencing the users table
    preferred_car_id INT,  -- Optional: Car preferred by the customer
    membership_status VARCHAR(50),  -- E.g., 'silver', 'gold', 'platinum'
    booking_history TEXT[],  -- Can store an array of booking IDs (if required)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (preferred_car_id) REFERENCES cars(id) ON DELETE SET NULL
);
