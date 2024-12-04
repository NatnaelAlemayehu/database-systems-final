-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 04, 2024 at 04:26 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbclass`
--

-- --------------------------------------------------------

--
-- Table structure for table `Amenity`
--

CREATE TABLE `Amenity` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------

--
-- Table structure for table `DynamicPricingRates`
--

CREATE TABLE `DynamicPricingRates` (
  `id` int(11) NOT NULL,
  `threshold` float NOT NULL,
  `increase_rate` float NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------

--
-- Table structure for table `Employee`
--

CREATE TABLE `Employee` (
  `ssn` char(9) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `role_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `Feedback`
--

CREATE TABLE `Feedback` (
  `id` int(11) NOT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comments` text DEFAULT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Guest`
--

CREATE TABLE `Guest` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `InventoryItem`
--

CREATE TABLE `InventoryItem` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `item_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity_in_stock` int(11) DEFAULT NULL,
  `reorder_level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



--
-- Triggers `InventoryItem`
--
DELIMITER $$
CREATE TRIGGER `CheckLowStock` AFTER UPDATE ON `InventoryItem` FOR EACH ROW BEGIN
    IF NEW.quantity_in_stock <= NEW.reorder_level THEN
        INSERT INTO LowStockAlert (item_id, item_name, current_stock, reorder_level, alert_date)
        VALUES (NEW.id, NEW.item_name, NEW.quantity_in_stock, NEW.reorder_level, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE 
            current_stock = NEW.quantity_in_stock,
            alert_date = CURRENT_TIMESTAMP;
    ELSE
        -- Optionally remove the alert if the stock level goes above the reorder level
        DELETE FROM LowStockAlert WHERE item_id = NEW.id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `LowStockAlert`
--

CREATE TABLE `LowStockAlert` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `current_stock` int(11) NOT NULL,
  `reorder_level` int(11) NOT NULL,
  `alert_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `MaintenanceRequest`
--

CREATE TABLE `MaintenanceRequest` (
  `id` int(11) NOT NULL,
  `room_number` int(11) DEFAULT NULL,
  `issue_description` text DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `MaintenanceRequestEmployee`
--

CREATE TABLE `MaintenanceRequestEmployee` (
  `employee_ssn` char(9) NOT NULL,
  `maintenance_request_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `Payment`
--

CREATE TABLE `Payment` (
  `id` int(11) NOT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `payment_method_name` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



--
-- Triggers `Payment`
--
DELIMITER $$
CREATE TRIGGER `update_reservation_status` AFTER INSERT ON `Payment` FOR EACH ROW BEGIN
    UPDATE Reservation
    SET reservation_status = 'Checked-Out',
        payment_id = NEW.id
    WHERE guest_id = NEW.guest_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `PaymentMethod`
--

CREATE TABLE `PaymentMethod` (
  `method_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



--
-- Table structure for table `Reservation`
--

CREATE TABLE `Reservation` (
  `reservation_id` int(11) NOT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `check_in_date` date DEFAULT NULL,
  `check_out_date` date DEFAULT NULL,
  `reservation_status` varchar(20) DEFAULT NULL,
  `amount_due` int(11) DEFAULT NULL,
  `room_number` int(11) DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `Role`
--

CREATE TABLE `Role` (
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `number` int(11) NOT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `room_type_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `RoomAmenity`
--

CREATE TABLE `RoomAmenity` (
  `room_number` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `RoomType`
--

CREATE TABLE `RoomType` (
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `maximum_occupancy` int(11) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `Supplier`
--

CREATE TABLE `Supplier` (
  `id` int(11) NOT NULL,
  `supplier_name` varchar(100) DEFAULT NULL,
  `contact_person_full_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `employee_id` char(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `SupplierProvidedItem`
--

CREATE TABLE `SupplierProvidedItem` (
  `supplier_id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for dumped tables
--

--
-- Indexes for table `Amenity`
--
ALTER TABLE `Amenity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `DynamicPricingRates`
--
ALTER TABLE `DynamicPricingRates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Employee`
--
ALTER TABLE `Employee`
  ADD PRIMARY KEY (`ssn`),
  ADD KEY `role_name` (`role_name`);

--
-- Indexes for table `Feedback`
--
ALTER TABLE `Feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feedback_ibfk_1` (`guest_id`);

--
-- Indexes for table `Guest`
--
ALTER TABLE `Guest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `InventoryItem`
--
ALTER TABLE `InventoryItem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventoryitem_ibfk_1` (`supplier_id`);

--
-- Indexes for table `LowStockAlert`
--
ALTER TABLE `LowStockAlert`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `MaintenanceRequest`
--
ALTER TABLE `MaintenanceRequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maintenancerequest_ibfk_1` (`room_number`);

--
-- Indexes for table `MaintenanceRequestEmployee`
--
ALTER TABLE `MaintenanceRequestEmployee`
  ADD PRIMARY KEY (`employee_ssn`,`maintenance_request_id`),
  ADD KEY `maintenance_request_id` (`maintenance_request_id`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_ibfk_1` (`guest_id`),
  ADD KEY `payment_ibfk_2` (`payment_method_name`);

--
-- Indexes for table `PaymentMethod`
--
ALTER TABLE `PaymentMethod`
  ADD PRIMARY KEY (`method_name`);

--
-- Indexes for table `Reservation`
--
ALTER TABLE `Reservation`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `guest_id` (`guest_id`),
  ADD KEY `room_number` (`room_number`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `Role`
--
ALTER TABLE `Role`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`number`),
  ADD KEY `room_type_name` (`room_type_name`);

--
-- Indexes for table `RoomAmenity`
--
ALTER TABLE `RoomAmenity`
  ADD PRIMARY KEY (`room_number`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Indexes for table `RoomType`
--
ALTER TABLE `RoomType`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `Supplier`
--
ALTER TABLE `Supplier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_ibfk_1` (`employee_id`);

--
-- Indexes for table `SupplierProvidedItem`
--
ALTER TABLE `SupplierProvidedItem`
  ADD PRIMARY KEY (`supplier_id`,`inventory_id`),
  ADD KEY `inventory_id` (`inventory_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Amenity`
--
ALTER TABLE `Amenity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `DynamicPricingRates`
--
ALTER TABLE `DynamicPricingRates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Feedback`
--
ALTER TABLE `Feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Guest`
--
ALTER TABLE `Guest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `InventoryItem`
--
ALTER TABLE `InventoryItem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `MaintenanceRequest`
--
ALTER TABLE `MaintenanceRequest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `Payment`
--
ALTER TABLE `Payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Reservation`
--
ALTER TABLE `Reservation`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `Supplier`
--
ALTER TABLE `Supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Employee`
--
ALTER TABLE `Employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`role_name`) REFERENCES `Role` (`name`);

--
-- Constraints for table `Feedback`
--
ALTER TABLE `Feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`guest_id`) REFERENCES `Guest` (`id`);

--
-- Constraints for table `InventoryItem`
--
ALTER TABLE `InventoryItem`
  ADD CONSTRAINT `inventoryitem_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `Supplier` (`id`);

--
-- Constraints for table `LowStockAlert`
--
ALTER TABLE `LowStockAlert`
  ADD CONSTRAINT `lowstockalert_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `InventoryItem` (`id`);

--
-- Constraints for table `MaintenanceRequest`
--
ALTER TABLE `MaintenanceRequest`
  ADD CONSTRAINT `maintenancerequest_ibfk_1` FOREIGN KEY (`room_number`) REFERENCES `Room` (`number`);

--
-- Constraints for table `MaintenanceRequestEmployee`
--
ALTER TABLE `MaintenanceRequestEmployee`
  ADD CONSTRAINT `maintenancerequestemployee_ibfk_1` FOREIGN KEY (`employee_ssn`) REFERENCES `Employee` (`ssn`),
  ADD CONSTRAINT `maintenancerequestemployee_ibfk_2` FOREIGN KEY (`maintenance_request_id`) REFERENCES `MaintenanceRequest` (`id`);

--
-- Constraints for table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`guest_id`) REFERENCES `Guest` (`id`),
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`payment_method_name`) REFERENCES `PaymentMethod` (`method_name`);

--
-- Constraints for table `Reservation`
--
ALTER TABLE `Reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`guest_id`) REFERENCES `Guest` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`room_number`) REFERENCES `Room` (`number`),
  ADD CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`payment_id`) REFERENCES `Payment` (`id`);

--
-- Constraints for table `Room`
--
ALTER TABLE `Room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`room_type_name`) REFERENCES `RoomType` (`name`);

--
-- Constraints for table `RoomAmenity`
--
ALTER TABLE `RoomAmenity`
  ADD CONSTRAINT `roomamenity_ibfk_1` FOREIGN KEY (`room_number`) REFERENCES `Room` (`number`),
  ADD CONSTRAINT `roomamenity_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `Amenity` (`id`);

--
-- Constraints for table `Supplier`
--
ALTER TABLE `Supplier`
  ADD CONSTRAINT `supplier_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `Employee` (`ssn`);

--
-- Constraints for table `SupplierProvidedItem`
--
ALTER TABLE `SupplierProvidedItem`
  ADD CONSTRAINT `supplierprovideditem_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `Supplier` (`id`),
  ADD CONSTRAINT `supplierprovideditem_ibfk_2` FOREIGN KEY (`inventory_id`) REFERENCES `InventoryItem` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
