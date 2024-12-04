"use client";

import { useState, useEffect } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete, Button } from "@mui/material";

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        room_number: "",
        status: "",
        floor_number: ""
    });
    const [roomNumbers, setRoomNumbers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [floorNumbers, setFloorNumbers] = useState([]);

    useEffect(() => {
        // Fetch rooms and unique filter options (room numbers, statuses, and floor numbers)
        const fetchData = async () => {
            try {
                const roomsData = await fetch('/api/rooms/filter').then(res => res.json());
                setRooms(roomsData);
                setFilteredRooms(roomsData);

                // Extract unique room numbers, statuses, and floor numbers
                const uniqueRoomNumbers = [...new Set(roomsData.map(room => room.number))];
                const uniqueStatuses = [...new Set(roomsData.map(room => room.status))];
                const uniqueFloorNumbers = [...new Set(roomsData.map(room => room.floor_number))];

                setRoomNumbers(uniqueRoomNumbers);
                setStatuses(uniqueStatuses);
                setFloorNumbers(uniqueFloorNumbers);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // Apply filters on the rooms list
        const applyFilters = () => {
            setFilteredRooms(rooms.filter(room =>
                (filterOptions.number ? room.number.toString() === filterOptions.number : true) &&
                (filterOptions.status ? room.status === filterOptions.status : true) &&
                (filterOptions.floor_number ? room.floor_number.toString() === filterOptions.floor_number : true)
            ));
        };
        applyFilters();
    }, [filterOptions, rooms]);

    return (
        <div>
            <h1>Rooms</h1>
            <div style={{ marginBottom: "20px", display: 'flex', gap: '10px' }}>
                <Autocomplete
                    options={roomNumbers}
                    onInputChange={(e, value) => setFilterOptions((prev) => ({ ...prev, number: value }))}
                    renderInput={(params) => <TextField {...params} label="Room Number" variant="outlined" />}
                    sx={{
                        width: 300, // Adjust width here
                        '& .MuiAutocomplete-popper': {
                            maxWidth: 'none', // Prevent dropdown truncation
                            width: 'auto',
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: 'nowrap', // Ensure options are not wrapping
                        },
                    }}
                />
                <Autocomplete
                    options={statuses}
                    onInputChange={(e, value) => setFilterOptions((prev) => ({ ...prev, status: value }))}
                    renderInput={(params) => <TextField {...params} label="Status" variant="outlined" />}
                    sx={{
                        width: 300, // Adjust width here
                        '& .MuiAutocomplete-popper': {
                            maxWidth: 'none',
                            width: 'auto',
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: 'nowrap',
                        },
                    }}
                />
                <Autocomplete
                    options={floorNumbers}
                    onInputChange={(e, value) => setFilterOptions((prev) => ({ ...prev, floor_number: value }))}
                    renderInput={(params) => <TextField {...params} label="Floor Number" variant="outlined" />}
                    sx={{
                        width: 300, // Adjust width here
                        '& .MuiAutocomplete-popper': {
                            maxWidth: 'none',
                            width: 'auto',
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: 'nowrap',
                        },
                    }}
                />
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Room Number</TableCell>
                            <TableCell>Floor Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Room Type</TableCell>
                            <TableCell>Amenities</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRooms.map((room, index) => (
                            <TableRow key={index}>
                                <TableCell>{room.number}</TableCell>
                                <TableCell>{room.floor_number}</TableCell>
                                <TableCell>{room.status}</TableCell>
                                <TableCell>{room.room_type_name}</TableCell>
                                <TableCell>{room.amenities}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
