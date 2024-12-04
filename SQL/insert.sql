-- Insert into Amenity
INSERT INTO `Amenity` (`id`, `name`, `description`) VALUES
(1, 'WiFi', 'High-speed internet access'),
(2, 'Breakfast', 'Complimentary breakfast'),
(3, 'Gym', '24/7 gym access'),
(4, 'Pool', 'Outdoor swimming pool'),
(5, 'Parking', 'Complimentary parking'),
(6, 'Spa', 'Full-service spa'),
(7, 'Room Service', '24/7 room service'),
(8, 'Airport Shuttle', 'Complimentary airport shuttle'),
(9, 'Laundry', 'On-site laundry service'),
(10, 'Pet-Friendly', 'Pets allowed in room');


-- Insert into Role
INSERT INTO `Role` (`name`, `description`) VALUES
('Housekeeping', 'Responsible for cleaning and maintenance of rooms'),
('Maintenance', 'Handles maintenance requests and repairs'),
('Manager', 'Oversees hotel operations'),
('Receptionist', 'Manages guest check-ins and check-outs');

-- Insert into Employee
INSERT INTO `Employee` (`ssn`, `first_name`, `last_name`, `phone_number`, `role_name`) VALUES
('012345678', 'Jane', 'Orange', '0987654321', 'Housekeeping'),
('123456789', 'Alice', 'Green', '9876543210', 'Manager'),
('234567890', 'Bob', 'Blue', '8765432109', 'Housekeeping'),
('345678901', 'Charlie', 'Yellow', '7654321098', 'Receptionist'),
('456789012', 'Daisy', 'Brown', '6543210987', 'Maintenance'),
('567890123', 'Evan', 'Gray', '5432109876', 'Manager'),
('678901234', 'Fiona', 'White', '4321098765', 'Housekeeping'),
('789012345', 'George', 'Black', '3210987654', 'Receptionist'),
('890123456', 'Holly', 'Purple', '2109876543', 'Maintenance'),
('901234567', 'Ian', 'Red', '1098765432', 'Manager');



-- Insert into Supplier
INSERT INTO `Supplier` (`id`, `supplier_name`, `contact_person_full_name`, `phone_number`, `email`, `employee_id`) VALUES
(1, 'HotelSupplies Inc.', 'Tom Supplier', '1230000000', 'tom.supplier@example.com', '123456789'),
(2, 'CleanCo', 'Anna Clean', '1240000000', 'anna.clean@example.com', '234567890'),
(3, 'FoodService Ltd.', 'Joe Food', '1250000000', 'joe.food@example.com', '345678901');

-- Insert into DynamicPricingRates
INSERT INTO `DynamicPricingRates` (`id`, `threshold`, `increase_rate`, `created_at`, `updated_at`) VALUES
(1, 0.7, 1.2, '2024-12-03 20:20:41', '2024-12-03 20:20:41'),
(2, 0.9, 1.4, '2024-12-03 20:20:41', '2024-12-03 20:20:41'),
(3, 0.5, 1.1, '2024-12-03 22:13:15', '2024-12-03 22:13:15');

-- Insert into PaymentMethod
INSERT INTO `PaymentMethod` (`method_name`) VALUES
('Credit Card'),
('Debit Card');



-- Insert into RoomType
INSERT INTO `RoomType` (`name`, `description`, `maximum_occupancy`, `base_price`, `image`) VALUES
('Double', 'A room with two beds', 2, 80.00, 'double.jpg'),
('Single', 'A single room with one bed', 1, 50.00, 'single.jpg'),
('Suite', 'A luxurious suite with amenities', 4, 200.00, 'suite.jpg');

-- Insert into Room
INSERT INTO `Room` (`number`, `floor_number`, `status`, `room_type_name`) VALUES
(101, 1, 'Available', 'Single'),
(102, 1, 'Available', 'Double'),
(103, 1, 'Available', 'Single'),
(201, 2, 'Available', 'Single'),
(202, 2, 'Available', 'Double'),
(301, 3, 'Available', 'Single'),
(302, 3, 'Available', 'Double'),
(303, 3, 'Available', 'Single'),
(401, 4, 'Available', 'Double'),
(402, 4, 'Available', 'Suite');

-- Insert into RoomAmenity
INSERT INTO `RoomAmenity` (`room_number`, `amenity_id`) VALUES
(101, 1),
(101, 2),
(102, 3),
(102, 4),
(103, 5),
(103, 6),
(201, 7),
(202, 8),
(301, 9),
(401, 10);




-- Insert into Feedback
-- (No data was provided for this table.)

-- Insert into Guest
INSERT INTO `Guest` (`id`, `first_name`, `last_name`, `email`, `phone_number`, `street`, `city`, `state`, `zip_code`) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Springfield', 'IL', '62701'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '2345678901', '456 Oak St', 'Chicago', 'IL', '62702'),
(3, 'Emily', 'Johnson', 'emily.johnson@example.com', '3456789012', '789 Pine St', 'Atlanta', 'IL', '62703'),
(4, 'Michael', 'Miami', 'michael.williams@example.com', '4567890123', '101 Maple St', 'Springfield', 'IL', '62704'),
(5, 'David', 'Brown', 'david.brown@example.com', '5678901234', '202 Birch St', 'Boston', 'IL', '62705'),
(6, 'Sarah', 'Davis', 'sarah.davis@example.com', '6789012345', '303 Cedar St', 'Springfield', 'IL', '62706'),
(13, 'Natnael', 'Alemayehu', 'natnaelzewdu0@gmail.com', '4045793940', '123', 'Atlanta', 'GA', '30314'),
(14, 'Natnael', 'Alemayehu', 'test@gmail.com', '4045793940', '122', 'Atlanta', 'GA', '30314'),
(15, 'User', 'Y', 'n@gmail.com', '4045793940', '120 Ozone St SW', 'Atlanta', 'GA', '30314'),
(16, 'zx', 'y', 'test@gmail.com', '4045793940', '120 Ozone St SW', 'Atlanta', 'GA', '30314'),
(17, 'old', 'guest', 'test@gmail.com', '4045793940', '120 Ozone St SW', 'Atlanta', 'GA', '30314');

-- Insert into InventoryItem
INSERT INTO `InventoryItem` (`id`, `supplier_id`, `item_name`, `description`, `quantity_in_stock`, `reorder_level`) VALUES
(1, 1, 'Shampoo', 'Small bottle of shampoo', 5, 10),
(2, 2, 'Towels', 'Bath towels', 5, 10),
(3, 3, 'Breakfast cereals', 'Various types of cereals', 30, 5),
(4, 1, 'TV Remote', 'Universal remote control', 2, 5),
(5, 2, 'Mattress', 'King-size mattress', 15, 3),
(6, 3, 'Plants', 'Indoor plants for decor', 40, 8),
(7, 1, 'Pool chemicals', 'Chemicals for pool maintenance', 25, 5),
(8, 2, 'Pillows', 'Standard size pillows', 30, 5),
(9, 3, 'Security cameras', 'Surveillance cameras', 10, 2),
(10, 1, 'Air freshener', 'Scented air fresheners', 60, 15),
(11, 2, 'Sample Item', 'Description of sample item', 40, 20);

-- Insert into MaintenanceRequest
INSERT INTO `MaintenanceRequest` (`id`, `room_number`, `issue_description`, `request_date`, `status`) VALUES
(13, 101, 'wifi is not working', '2024-12-03', 'Pending'),
(14, 102, 'lights are off', '2024-12-03', 'Pending');

-- Insert into MaintenanceRequestEmployee
INSERT INTO `MaintenanceRequestEmployee` (`employee_ssn`, `maintenance_request_id`) VALUES
('012345678', 13),
('678901234', 14);

-- Insert into Reservation
INSERT INTO `Reservation` (`reservation_id`, `guest_id`, `check_in_date`, `check_out_date`, `reservation_status`, `amount_due`, `room_number`, `payment_id`) VALUES
(31, 15, '2024-12-03', '2024-12-05', 'Confirmed', 100, 101, NULL),
(32, 14, '2024-12-03', '2024-12-04', 'Confirmed', 50, 103, NULL),
(33, 13, '2024-12-03', '2024-12-04', 'Confirmed', 50, 201, NULL),
(34, 6, '2024-12-03', '2024-12-04', 'Confirmed', 50, 301, NULL);



-- Insert into SupplierProvidedItem
INSERT INTO `SupplierProvidedItem` (`supplier_id`, `inventory_id`) VALUES
(1, 1),
(1, 4),
(1, 7),
(1, 10),
(2, 2),
(2, 5),
(2, 8),
(3, 3),
(3, 6),
(3, 9);
