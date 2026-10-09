-- Restaurant Table Reservation System
-- Database SQL used for the project
-- Database: restaurant_reservation

CREATE DATABASE IF NOT EXISTS restaurant_reservation;
USE restaurant_reservation;

-- =========================
-- 1. CUSTOMERS
-- =========================
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- =========================
-- 2. RESTAURANTS
-- =========================
CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_name VARCHAR(100) NOT NULL,
    location VARCHAR(150)
);

-- =========================
-- 3. TABLES
-- Actual table name used in the project: tables_info
-- =========================
CREATE TABLE IF NOT EXISTS tables_info (
    table_id INT PRIMARY KEY AUTO_INCREMENT,
    table_number INT NOT NULL,
    capacity INT NOT NULL,
    availability BOOLEAN DEFAULT 1,
    restaurant_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

-- =========================
-- 4. RESERVATIONS
-- =========================
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    table_id INT,
    reservation_date DATE,
    reservation_time TIME,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (table_id) REFERENCES tables_info(table_id)
);

-- =========================
-- 5. PAYMENTS
-- Demo payment table added for the project
-- =========================
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(20),
    transaction_id VARCHAR(50),
    payment_status VARCHAR(20)
);

-- =========================
-- SAMPLE DATA
-- =========================
INSERT INTO restaurants (restaurant_name, location)
VALUES
('Grand Restaurant', 'Chennai');

INSERT INTO customers (customer_name, email, phone)
VALUES
('Hema', 'hema@example.com', '9876543210'),
('Customer 2', 'customer2@example.com', '9876543211'),
('Customer 3', 'customer3@example.com', '9876543212');

INSERT INTO tables_info (table_number, capacity, availability, restaurant_id)
VALUES
(1, 2, 1, 1),
(2, 4, 1, 1),
(3, 4, 1, 1),
(4, 6, 1, 1),
(5, 8, 1, 1);

-- =========================
-- JOIN QUERY
-- Display reservation + customer + table details
-- =========================
SELECT
    r.reservation_id,
    c.customer_name,
    t.table_number,
    t.capacity,
    r.reservation_date,
    r.reservation_time
FROM reservations r
INNER JOIN customers c
    ON r.customer_id = c.customer_id
INNER JOIN tables_info t
    ON r.table_id = t.table_id;

-- =========================
-- SUBQUERY
-- Tables reserved more than average
-- =========================
SELECT
    t.table_id,
    t.table_number,
    COUNT(r.reservation_id) AS reservation_count
FROM tables_info t
INNER JOIN reservations r
    ON t.table_id = r.table_id
GROUP BY t.table_id, t.table_number
HAVING COUNT(r.reservation_id) >
(
    SELECT AVG(reservation_count)
    FROM
    (
        SELECT COUNT(*) AS reservation_count
        FROM reservations
        GROUP BY table_id
    ) AS average_table_counts
);

-- =========================
-- STORED PROCEDURE
-- Reserve a table
-- =========================
DROP PROCEDURE IF EXISTS ReserveTable;

DELIMITER //

CREATE PROCEDURE ReserveTable(
    IN p_customer_id INT,
    IN p_table_id INT,
    IN p_reservation_date DATE,
    IN p_reservation_time TIME
)
BEGIN
    INSERT INTO reservations
    (customer_id, table_id, reservation_date, reservation_time)
    VALUES
    (p_customer_id, p_table_id, p_reservation_date, p_reservation_time);
END //

DELIMITER ;

-- Example:
-- CALL ReserveTable(1, 2, '2026-10-10', '19:00:00');

-- =========================
-- FUNCTION
-- Return number of reservations
-- =========================
DROP FUNCTION IF EXISTS GetReservationCount;

DELIMITER //

CREATE FUNCTION GetReservationCount()
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total_reservations INT;

    SELECT COUNT(*)
    INTO total_reservations
    FROM reservations;

    RETURN total_reservations;
END //

DELIMITER ;

-- Example:
-- SELECT GetReservationCount();

-- =========================
-- TRIGGER
-- Automatically make a table unavailable
-- after a reservation is inserted
-- =========================
DROP TRIGGER IF EXISTS after_reservation_insert;

DELIMITER //

CREATE TRIGGER after_reservation_insert
AFTER INSERT ON reservations
FOR EACH ROW
BEGIN
    UPDATE tables_info
    SET availability = 0
    WHERE table_id = NEW.table_id;
END //

DELIMITER ;

-- Check trigger:
-- SHOW CREATE TRIGGER after_reservation_insert;

-- =========================
-- RELEASE TABLE QUERY
-- Used by the REST API to make a table available again
-- =========================
UPDATE tables_info
SET availability = 1
WHERE table_id = 1;

-- =========================
-- USEFUL TEST QUERIES
-- =========================

-- View customers
SELECT * FROM customers;

-- View restaurants
SELECT * FROM restaurants;

-- View tables
SELECT * FROM tables_info;

-- View reservations
SELECT * FROM reservations;

-- View payments
SELECT * FROM payments;

-- Count reservations
SELECT GetReservationCount();

-- Reservation procedure example
-- CALL ReserveTable(1, 2, '2026-10-10', '19:00:00');
