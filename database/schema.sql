-- -- DATABASE INITIALIZATION SCRIPT
-- -- Project: Ostro Bazar (Industrial Asset Management)
-- -- Author: IMRUL Kaesh Chowdhury
-- -- Updated: 2025-12-19
-- -- Description: This script initializes the database schema and seeds initial data.
-- -- Includes: Products, Categories, Compatibility, Security Clearance, and Admin Auth.

-- -- 0. DATABASE CREATION
-- CREATE DATABASE IF NOT EXISTS ostrobazar_dbms;
-- USE ostrobazar_dbms;

-- -- 1. CLEANUP (Reset tables to avoid errors during re-initialization)
-- SET FOREIGN_KEY_CHECKS = 0; -- Disable foreign key checks to allow dropping
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS clearance_levels;
-- DROP TABLE IF EXISTS admins; -- Added for Admin Panel
-- SET FOREIGN_KEY_CHECKS = 1; -- Re-enable

-- -- 2. CREATE TABLES (The Structure)

-- -- Admin Authentication Table (New)
-- CREATE TABLE admins (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     email VARCHAR(100) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL, -- Plain text for student demo
--     role VARCHAR(50) DEFAULT 'admin',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE clearance_levels (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     level_name VARCHAR(50) NOT NULL
-- );

-- CREATE TABLE categories (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(50) NOT NULL
-- );

-- CREATE TABLE products (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     price DECIMAL(10, 2) NOT NULL,
--     original_price DECIMAL(10, 2) DEFAULT NULL, -- Added for Discounts
--     stock INT DEFAULT 0,
--     category_id INT,
--     thumbnail VARCHAR(255),
--     rating DECIMAL(3, 1) DEFAULT 5.0,
--     description TEXT,
--     clearance_id INT DEFAULT 1,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
--     FOREIGN KEY (clearance_id) REFERENCES clearance_levels(id)
-- );

-- -- 3. SEED DATA (The Initial Content)

-- -- Admin Users (New)
-- INSERT INTO admins (email, password, role) VALUES 
-- ('admin@ostro.com', 'teamostro', 'Super Commander');

-- -- Security Levels
-- INSERT INTO clearance_levels (level_name) VALUES 
-- ('Civilian'), 
-- ('Military'), 
-- ('Classified');

-- -- Categories
-- INSERT INTO categories (name) VALUES 
-- ('Guns'), 
-- ('Missiles'), 
-- ('Rockets'), 
-- ('Drones/UAVs');

-- -- Initial Products For Demo (Examples)
-- INSERT INTO products (title, price, original_price, stock, category_id, thumbnail, rating, description, clearance_id) VALUES 
-- ('Desert Eagle', 105.00, 120.00, 100, 1, '/public/uploads/img-1764043017487-812490617.jpg', 4.8, 'High caliber semi-automatic pistol.', 1),
-- ('AGM-114 Hellfire', 1199.00, 1500.00, 20, 2, '/public/uploads/img-1764042900804-815961335.jpg', 4.9, 'Air-to-surface missile.', 2),
-- ('MQ-9 Reaper', 2500.00, 3000.00, 10, 4, '/public/uploads/img-1764042800559-351517103.jpg', 4.8, 'Hunter-killer UAV.', 3);