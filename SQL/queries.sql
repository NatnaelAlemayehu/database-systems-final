-- fetch the dynamic pricing rates
SELECT
    *
FROM
    DynamicPricingRates;

-- add new dynamic pricing rates
INSERT INTO
    DynamicPricingRates (threshold, increase_rate)
VALUES
    (?, ?);


-- select all employees
SELECT
    ssn,
    first_name,
    last_name
FROM
    Employee;

-- get details of supplier and inventory to list / view inventory
SELECT
    InventoryItem.id,
    InventoryItem.item_name,
    InventoryItem.description,
    InventoryItem.quantity_in_stock,
    InventoryItem.reorder_level,
    Supplier.supplier_name
FROM
    InventoryItem
    JOIN Supplier ON InventoryItem.supplier_id = Supplier.id

-- edit stock level on inventory
UPDATE
    InventoryItem
SET
    quantity_in_stock = ?,
    reorder_level = ?
WHERE
    id = ?

-- view lowstockalert items
SELECT
    LowStockAlert.item_id,
    LowStockAlert.item_name,
    LowStockAlert.current_stock,
    LowStockAlert.reorder_level,
    Supplier.supplier_name
FROM
    LowStockAlert
    JOIN InventoryItem ON LowStockAlert.item_id = InventoryItem.id
    JOIN Supplier ON InventoryItem.supplier_id = Supplier.id


-- create a stock alert using triggers
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

-- view maintenace request
SELECT
    MaintenanceRequest.room_number AS number,
    MaintenanceRequest.issue_description,
    MaintenanceRequest.request_date,
    MaintenanceRequest.status,
    Room.room_type_name,
    Room.floor_number,
    GROUP_CONCAT(
        CONCAT(Employee.first_name, ' ', Employee.last_name) SEPARATOR ', '
    ) AS assigned_employees
FROM
    MaintenanceRequest
    JOIN Room ON MaintenanceRequest.room_number = Room.number
    LEFT JOIN MaintenanceRequestEmployee ON MaintenanceRequest.id = MaintenanceRequestEmployee.maintenance_request_id
    LEFT JOIN Employee ON MaintenanceRequestEmployee.employee_ssn = Employee.ssn

-- create a new maintenance request
INSERT INTO
    MaintenanceRequest (
        room_number,
        issue_description,
        request_date,
        status
    )
VALUES
    (?, ?, NOW(), 'Pending');


-- assign an employee to a maintenance request
INSERT INTO
    MaintenanceRequestEmployee (maintenance_request_id, employee_ssn)
VALUES
    (?, ?);


-- create (process) payment 
INSERT INTO
    Payment (
        guest_id,
        payment_method_name,
        amount,
        transaction_reference,
        date
    )
VALUES
    (?, ?, ?, ?, NOW())


-- perform dynamic pricing based on occupancy rate
SELECT
    CASE
        WHEN (
            occupied_rooms.total_occupied / total_rooms.total_available
        ) > (
            SELECT
                threshold
            FROM
                DynamicPricingRates
            WHERE
                increase_rate = MAX(increase_rate)
        ) THEN RoomType.base_price * (
            SELECT
                increase_rate
            FROM
                DynamicPricingRates
            WHERE
                threshold = (
                    SELECT
                        MAX(threshold)
                    FROM
                        DynamicPricingRates
                    WHERE
                        (
                            occupied_rooms.total_occupied / total_rooms.total_available
                        ) > threshold
                )
        ) * DATEDIFF(
            Reservation.check_out_date,
            Reservation.check_in_date
        )
        ELSE RoomType.base_price * DATEDIFF(
            Reservation.check_out_date,
            Reservation.check_in_date
        )
    END AS total_amount_due
FROM
    Reservation
    JOIN Room ON Reservation.room_number = Room.number
    JOIN RoomType ON Room.room_type_name = RoomType.name
    LEFT JOIN (
        SELECT
            Room.room_type_name,
            COUNT(*) AS total_occupied
        FROM
            Room
        WHERE
            status = 'Occupied'
        GROUP BY
            Room.room_type_name
    ) AS occupied_rooms ON Room.room_type_name = occupied_rooms.room_type_name
    LEFT JOIN (
        SELECT
            Room.room_type_name,
            COUNT(*) AS total_available
        FROM
            Room
        GROUP BY
            Room.room_type_name
    ) AS total_rooms ON Room.room_type_name = total_rooms.room_type_name
WHERE
    Reservation.reservation_id = ?;


-- get guest information on a specific reservation
SELECT
    Reservation.*,
    Guest.first_name,
    Guest.last_name
FROM
    Reservation
    JOIN Guest ON Reservation.guest_id = Guest.id
SELECT
    Room.number AS room_number,
    Room.floor_number,
    Room.room_type_name,
    Room.status
FROM
    Room;


-- get room details along with amenity to (when vieiwing rooms table)
SELECT
    Room.number,
    Room.floor_number,
    Room.status,
    Room.room_type_name,
    GROUP_CONCAT(
        Amenity.name
        ORDER BY
            Amenity.name SEPARATOR ', '
    ) AS amenities
FROM
    Room
    LEFT JOIN RoomAmenity ON Room.number = RoomAmenity.room_number
    LEFT JOIN Amenity ON RoomAmenity.amenity_id = Amenity.id
WHERE
    Room.number = ?
    AND Room.status = ?
    AND Room.floor_number = ?


-- check if a room is available to be resevered within a given checkin and checkout date
SELECT
    Room.number,
    Room.floor_number,
    Room.status,
    Room.room_type_name
FROM
    Room
WHERE
    Room.room_type_name = ?
    AND Room.number NOT IN (
        SELECT
            Reservation.room_number
        FROM
            Reservation
        WHERE
            Reservation.check_out_date > ?
            AND Reservation.check_in_date < ?
    )


-- get supplier information along with the employee assigned to manage it
SELECT
    Supplier.supplier_name,
    Supplier.contact_person_full_name,
    Supplier.phone_number,
    Supplier.email,
    CONCAT(Employee.first_name, ' ', Employee.last_name) AS managing_employee
FROM
    Supplier
    JOIN Employee ON Supplier.employee_id = Employee.ssn
WHERE
    Supplier.supplier_name LIKE ?
    AND Supplier.contact_person_full_name LIKE ?


-- create new guest in the system
INSERT INTO
    Guest (
        first_name,
        last_name,
        email,
        phone_number,
        street,
        city,
        state,
        zip_code
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)