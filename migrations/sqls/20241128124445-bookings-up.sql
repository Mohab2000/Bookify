/* Replace with your SQL commands */
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  -- Foreign key referencing the user (customer)
    valet_id INT NOT NULL,  -- Foreign key referencing the valet
    car_id INT NOT NULL,  -- Foreign key referencing the car
    pickup_time TIMESTAMP NOT NULL,
    dropoff_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',  -- e.g., 'pending', 'completed', 'cancelled'
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (valet_id) REFERENCES valet(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
