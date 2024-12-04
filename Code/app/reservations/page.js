"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import DoneIcon from "@mui/icons-material/Done";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    first_name: "",
    last_name: "",
    room_number: "",
    reservation_status: "",
  });
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmountDue, setTotalAmountDue] = useState(0);
  const paymentMethods = ["Debit Card", "Credit Card"]; // Payment options

  useEffect(() => {
    // Fetch reservations and unique filter options
    const fetchData = async () => {
      try {
        const reservationsData = await fetch("/api/reservations").then((res) =>
          res.json()
        );
        setReservations(reservationsData);
        setFilteredReservations(reservationsData);

        // Extract unique room numbers and statuses
        const uniqueRoomNumbers = [
          ...new Set(reservationsData.map((res) => res.room_number)),
        ];
        const uniqueStatuses = [
          ...new Set(reservationsData.map((res) => res.status)),
        ];

        setRoomNumbers(uniqueRoomNumbers);
        setStatuses(uniqueStatuses);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentClick = (reservation) => {
    try {
      setSelectedReservation(reservation); // Set the reservation to process payment for
      setTotalAmountDue(reservation.amount_due); // Use amount_due from the reservation object
      setOpenPaymentDialog(true);
    } catch (error) {
      console.error("Error setting up payment:", error);
    }
  };


  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_id: selectedReservation.guest_id,
          payment_method_name: paymentMethod,
          amount: totalAmountDue,
          transaction_reference: `TXN${Date.now()}`, // Example transaction reference
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process payment");
      }

      // Fetch updated reservation data
      const updatedReservation = await fetch(
        `/api/reservations?reservation_id=${selectedReservation.reservation_id}`
      ).then((res) => res.json());

      // Update reservations state
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.reservation_id === updatedReservation.reservation_id
            ? { ...res, ...updatedReservation } // Merge updated data
            : res
        )
      );

      setOpenPaymentDialog(false);
      // alert("Payment successful!");
    } catch (error) {
      console.error("Error making payment:", error);
      alert("Error: Unable to process payment.");
    }
  };





  useEffect(() => {
    // Apply filters on the reservations list
    const applyFilters = () => {
      if (Array.isArray(reservations)) {
        setFilteredReservations(
          reservations.filter(
            (reservation) =>
              (filterOptions.first_name
                ? reservation.first_name
                  .toLowerCase()
                  .includes(filterOptions.first_name.toLowerCase())
                : true) &&
              (filterOptions.last_name
                ? reservation.last_name
                  .toLowerCase()
                  .includes(filterOptions.last_name.toLowerCase())
                : true) &&
              (filterOptions.room_number
                ? reservation.room_number === filterOptions.room_number
                : true) &&
              (filterOptions.reservation_status
                ? reservation.reservation_status === filterOptions.reservation_status
                : true)
          )
        );
      }
    };
    applyFilters();
  }, [filterOptions, reservations]);


  return (
    <div>
      <h1>Reservations</h1>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <TextField
          label="First Name"
          name="first_name"
          variant="outlined"
          onChange={handleFilterChange}
          sx={{ width: 200 }} // Adjust width for consistency
        />
        <TextField
          label="Last Name"
          name="last_name"
          variant="outlined"
          onChange={handleFilterChange}
          sx={{ width: 200 }} // Adjust width for consistency
        />
        <Autocomplete
          options={roomNumbers}
          onInputChange={(e, value) =>
            setFilterOptions((prev) => ({ ...prev, room_number: value }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Room Number" variant="outlined" />
          )}
          sx={{
            width: 250, // Adjust field width
            '& .MuiAutocomplete-popper': {
              maxWidth: 'none', // Prevent dropdown truncation
              width: 'auto',
            },
            '& .MuiAutocomplete-option': {
              whiteSpace: 'nowrap', // Prevent option wrapping
            },
          }}
        />
        <Autocomplete
          options={statuses}
          onInputChange={(e, value) =>
            setFilterOptions((prev) => ({ ...prev, status: value }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
          sx={{
            width: 250, // Adjust field width
            '& .MuiAutocomplete-popper': {
              maxWidth: 'none', // Prevent dropdown truncation
              width: 'auto',
            },
            '& .MuiAutocomplete-option': {
              whiteSpace: 'nowrap', // Prevent option wrapping
            },
          }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Room Number</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.map((reservation, index) => (
              <TableRow key={index}>
                <TableCell>{reservation.first_name}</TableCell>
                <TableCell>{reservation.last_name}</TableCell>
                <TableCell>{reservation.room_number}</TableCell>
                <TableCell>
                  {new Date(reservation.check_in_date).toLocaleDateString('en-CA')}
                </TableCell>
                <TableCell>
                  {new Date(reservation.check_out_date).toLocaleDateString('en-CA')}
                </TableCell>
                <TableCell>{reservation.reservation_status}</TableCell>
                <TableCell>
                  {reservation.payment_id === null ? (
                    <IconButton onClick={() => handlePaymentClick(reservation)}>
                      <PaymentIcon />
                    </IconButton>
                  ) : (
                    <IconButton disabled>
                      <DoneIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
      >
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <TextField
            label="Total Amount Due"
            value={totalAmountDue}
            fullWidth
            disabled
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method, index) => (
                <MenuItem key={index} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handlePaymentSubmit} color="primary">
            Payment Made
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
