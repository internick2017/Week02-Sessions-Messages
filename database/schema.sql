-- Inventory Management Database Schema
-- This file contains the SQL schema for inventory management

-- Create classification table
CREATE TABLE IF NOT EXISTS classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_name VARCHAR(100) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(200) NOT NULL,
    inv_thumbnail VARCHAR(200) NOT NULL,
    inv_price DECIMAL(10,2) NOT NULL,
    inv_year INTEGER NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(50) NOT NULL,
    classification_id INTEGER NOT NULL REFERENCES classification(classification_id)
);

-- Insert sample classifications
INSERT INTO classification (classification_name) VALUES 
    ('SUV'),
    ('Sedan'),
    ('Truck'),
    ('Coupe'),
    ('Convertible'),
    ('Hatchback')
ON CONFLICT (classification_name) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (inv_name, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES 
    ('Honda Civic', 'Reliable and fuel-efficient compact car perfect for city driving.', '/images/vehicles/honda-civic.jpg', '/images/vehicles/honda-civic-thumb.jpg', 18500.00, 2020, 25000, 'Silver', 2),
    ('Toyota Camry', 'Comfortable mid-size sedan with excellent resale value.', '/images/vehicles/toyota-camry.jpg', '/images/vehicles/toyota-camry-thumb.jpg', 22500.00, 2019, 32000, 'White', 2),
    ('Ford F-150', 'Powerful pickup truck perfect for work and recreation.', '/images/vehicles/ford-f150.jpg', '/images/vehicles/ford-f150-thumb.jpg', 35000.00, 2021, 15000, 'Blue', 3),
    ('BMW 3 Series', 'Luxury sedan with sporty performance and premium features.', '/images/vehicles/bmw-3series.jpg', '/images/vehicles/bmw-3series-thumb.jpg', 42000.00, 2020, 18000, 'Black', 2),
    ('Jeep Wrangler', 'Iconic off-road SUV with removable doors and top.', '/images/vehicles/jeep-wrangler.jpg', '/images/vehicles/jeep-wrangler-thumb.jpg', 38000.00, 2021, 12000, 'Red', 1),
    ('Tesla Model 3', 'Electric sedan with autopilot and cutting-edge technology.', '/images/vehicles/tesla-model3.jpg', '/images/vehicles/tesla-model3-thumb.jpg', 45000.00, 2022, 8000, 'White', 2),
    ('Chevrolet Corvette', 'High-performance sports car with stunning design.', '/images/vehicles/chevrolet-corvette.jpg', '/images/vehicles/chevrolet-corvette-thumb.jpg', 65000.00, 2021, 5000, 'Yellow', 4),
    ('Audi A4', 'Premium sedan with quattro all-wheel drive.', '/images/vehicles/audi-a4.jpg', '/images/vehicles/audi-a4-thumb.jpg', 38000.00, 2020, 22000, 'Gray', 2),
    ('Subaru Outback', 'All-wheel drive wagon perfect for outdoor adventures.', '/images/vehicles/subaru-outback.jpg', '/images/vehicles/subaru-outback-thumb.jpg', 32000.00, 2021, 16000, 'Green', 1),
    ('Mazda MX-5 Miata', 'Lightweight roadster with excellent handling.', '/images/vehicles/mazda-mx5.jpg', '/images/vehicles/mazda-mx5-thumb.jpg', 28000.00, 2020, 14000, 'Red', 5)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_classification ON inventory(classification_id);
CREATE INDEX IF NOT EXISTS idx_inventory_price ON inventory(inv_price);
CREATE INDEX IF NOT EXISTS idx_inventory_year ON inventory(inv_year);
