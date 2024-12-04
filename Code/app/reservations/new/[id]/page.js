"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function MakeReservation() {
    const router = useRouter();
    const { id } = useParams();

    const [roomTypes] = useState(["Single", "Double", "Suite"]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [totalPrice, setTotalPrice] = useState(null);
    const [error, setError] = useState(""); // To store validation error messages
    const [reservationData, setReservationData] = useState({
        check_in: dayjs(), // Initialize with `dayjs`
        check_out: dayjs().add(1, "day"), // Ensure check-out is at least one day later
        room_type: "",
        room_number: ""
    });

    const validateDates = () => {
        const today = dayjs().startOf("day"); // Today's date, at midnight
        const { check_in, check_out } = reservationData;

        if (!check_in || !check_out) {
            setError("Both check-in and check-out dates are required.");
            return false;
        }

        if (check_in.isAfter(check_out)) {
            setError("Check-in date cannot be after check-out date.");
            return false;
        }

        if (check_out.diff(check_in, "day") < 1) {
            setError("Check-out date must be at least one day after check-in.");
            return false;
        }

        if (check_in.isBefore(today) || check_out.isBefore(today)) {
            setError("Dates must be today or in the future.");
            return false;
        }

        setError(""); // Clear any previous error
        return true;
    };

    const handleDateChange = (name, date) => {
        setReservationData((prev) => ({ ...prev, [name]: date }));
    };

    useEffect(() => {
        // Fetch available rooms when the dates or room type changes
        const fetchAvailableRooms = async () => {
            if (validateDates() && reservationData.room_type) {
                try {
                    const response = await fetch(
                        `/api/rooms?roomType=${reservationData.room_type}&checkInDate=${reservationData.check_in.format("YYYY-MM-DD")}&checkOutDate=${reservationData.check_out.format("YYYY-MM-DD")}`
                    );
                    const roomsData = await response.json();
                    setAvailableRooms(roomsData);
                } catch (error) {
                    console.error("Failed to fetch available rooms:", error);
                }
            }
        };
        fetchAvailableRooms();
    }, [reservationData.room_type, reservationData.check_in, reservationData.check_out]);

    useEffect(() => {
        // Fetch total price when the dates or room type changes
        const fetchPrice = async () => {
            const { room_type, check_in, check_out } = reservationData;
            if (validateDates() && room_type) {
                try {
                    const response = await fetch(
                        `/api/pricing?room_type_name=${room_type}&check_in_date=${check_in.format("YYYY-MM-DD")}&check_out_date=${check_out.format("YYYY-MM-DD")}`
                    );
                    const data = await response.json();
                    setTotalPrice(data.total_price);
                } catch (error) {
                    console.error("Failed to fetch price:", error);
                }
            }
        };
        fetchPrice();
    }, [reservationData.room_type, reservationData.check_in, reservationData.check_out]);

    const handleConfirmReservation = async () => {
        if (!validateDates()) return;

        try {
            await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    guest_id: id,
                    ...reservationData,
                    check_in_date: reservationData.check_in.format("YYYY-MM-DD"),
                    check_out_date: reservationData.check_out.format("YYYY-MM-DD"),
                    amount_due: totalPrice
                })
            });
            router.push("/reservations");
        } catch (error) {
            console.error("Failed to make reservation:", error);
        }
    };

    return (
        <div>
            <h1>Make Reservation</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <DatePicker
                        label="Check In Date"
                        value={reservationData.check_in}
                        onChange={(date) => handleDateChange("check_in", date)}
                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                        minDate={dayjs()} // Disable past dates
                    />
                    <DatePicker
                        label="Check Out Date"
                        value={reservationData.check_out}
                        onChange={(date) => handleDateChange("check_out", date)}
                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                        minDate={dayjs()} // Disable past dates
                    />
                </div>
            </LocalizationProvider>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Show validation errors */}
            <Autocomplete
                options={roomTypes}
                onChange={(e, value) =>
                    setReservationData((prev) => ({ ...prev, room_type: value }))
                }
                renderInput={(params) => <TextField {...params} label="Room Type" variant="outlined" />}
            />
            <Autocomplete
                options={availableRooms.map((room) => room.number)}
                onChange={(e, value) =>
                    setReservationData((prev) => ({ ...prev, room_number: value }))
                }
                renderInput={(params) => <TextField {...params} label="Room Number" variant="outlined" />}
            />

            <div style={{ margin: "20px 0" }}>
                <h3>
                    Total Price: {totalPrice !== null ? `$${totalPrice}` : "Please select room type and dates"}
                </h3>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmReservation}
                disabled={!totalPrice || !reservationData.room_number} // Disable if no price or room number
            >
                Confirm Reservation
            </Button>
        </div>
    );
}

