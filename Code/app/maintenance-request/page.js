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
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

export default function MaintenanceRequests() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        number: "",
        status: "",
        room_type_name: "",
        floor_number: "",
    });
    const [rooms, setRooms] = useState([]); // Fetch rooms from API
    const [statuses, setStatuses] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [floorNumbers, setFloorNumbers] = useState([]);

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [newIssue, setNewIssue] = useState({
        room_number: "",
        issue_description: "",
        employee_ssn: "",
    });
    const [employees, setEmployees] = useState([]); // Store employees for the dropdown

    useEffect(() => {
        // Fetch maintenance requests and related data
        const fetchData = async () => {
            try {
                // Fetch maintenance requests
                const requestsData = await fetch("/api/maintenance-requests").then((res) =>
                    res.json()
                );
                setRequests(requestsData);
                setFilteredRequests(requestsData);

                // Fetch rooms
                const roomsData = await fetch("/api/rooms/allrooms").then((res) => res.json());
                setRooms(roomsData);

                // Fetch employees
                const employeesData = await fetch("/api/employees").then((res) =>
                    res.json()
                );
                setEmployees(employeesData);

                // Extract unique statuses and room types
                const uniqueStatuses = [...new Set(requestsData.map((req) => req.status))];
                const uniqueRoomTypes = [
                    ...new Set(requestsData.map((req) => req.room_type_name)),
                ];
                const uniqueFloorNumbers = [
                    ...new Set(roomsData.map((room) => room.floor_number)),
                ];

                setStatuses(uniqueStatuses);
                setRoomTypes(uniqueRoomTypes);
                setFloorNumbers(uniqueFloorNumbers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // Apply filters to the requests list
        const applyFilters = () => {
            setFilteredRequests(
                requests.filter(
                    (request) =>
                        (filterOptions.number
                            ? request.number.toString() === filterOptions.number
                            : true) &&
                        (filterOptions.status
                            ? request.status === filterOptions.status
                            : true) &&
                        (filterOptions.room_type_name
                            ? request.room_type_name === filterOptions.room_type_name
                            : true) &&
                        (filterOptions.floor_number
                            ? request.floor_number.toString() === filterOptions.floor_number
                            : true)
                )
            );
        };
        applyFilters();
    }, [filterOptions, requests]);

    const handleCreateIssue = async () => {
        try {
            const response = await fetch("/api/maintenance-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newIssue),
            });
            const newRequest = await response.json();
            setRequests((prev) => [...prev, newRequest]);
            setFilteredRequests((prev) => [...prev, newRequest]);
            setOpenDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error creating maintenance request:", error);
        }
    };

    return (
        <div>
            <h1>Maintenance Requests</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                style={{ marginBottom: "20px" }}
            >
                Create New Issue
            </Button>
            <div
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                {/* Other filters */}
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Room Number</TableCell>
                            <TableCell>Floor Number</TableCell>
                            <TableCell>Room Type</TableCell>
                            <TableCell>Issue Description</TableCell>
                            <TableCell>Request Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Assigned Employees</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRequests.map((request, index) => (
                            <TableRow key={index}>
                                <TableCell>{request.number}</TableCell>
                                <TableCell>{request.floor_number}</TableCell>
                                <TableCell>{request.room_type_name}</TableCell>
                                <TableCell>{request.issue_description}</TableCell>
                                <TableCell>{new Date(request.request_date).toLocaleDateString('en-CA')}</TableCell>
                                <TableCell>{request.status}</TableCell>
                                <TableCell>{request.assigned_employees}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for creating a new issue */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create New Issue</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={rooms.map((room) => room.room_number)}
                        onChange={(e, value) =>
                            setNewIssue((prev) => ({ ...prev, room_number: value }))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Room Number" variant="outlined" />
                        )}
                        fullWidth
                    />
                    <TextField
                        label="Issue Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={newIssue.issue_description}
                        onChange={(e) =>
                            setNewIssue((prev) => ({
                                ...prev,
                                issue_description: e.target.value,
                            }))
                        }
                        style={{ marginTop: "20px" }}
                    />
                    <Autocomplete
                        options={employees.map(
                            (emp) => `${emp.first_name} ${emp.last_name}`
                        )}
                        onChange={(e, value) => {
                            const selectedEmployee = employees.find(
                                (emp) =>
                                    `${emp.first_name} ${emp.last_name}` === value
                            );
                            setNewIssue((prev) => ({
                                ...prev,
                                employee_ssn: selectedEmployee?.ssn || "",
                            }));
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Assign Employee" variant="outlined" />
                        )}
                        fullWidth
                        style={{ marginTop: "20px" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateIssue} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
