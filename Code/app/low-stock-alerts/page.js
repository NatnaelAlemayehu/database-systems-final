"use client";

import { useState, useEffect } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete } from "@mui/material";

export default function LowStockAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        item_name: "",
        supplier_name: ""
    });
    const [itemNames, setItemNames] = useState([]);
    const [supplierNames, setSupplierNames] = useState([]);

    useEffect(() => {
        // Fetch low stock alerts and unique filter options
        const fetchData = async () => {
            try {
                const alertsData = await fetch('/api/low-stock-alerts').then(res => res.json());
                setAlerts(alertsData);
                setFilteredAlerts(alertsData);

                // Extract unique item names and supplier names
                const uniqueItemNames = [...new Set(alertsData.map(alert => alert.item_name))];
                const uniqueSupplierNames = [...new Set(alertsData.map(alert => alert.supplier_name))];

                setItemNames(uniqueItemNames);
                setSupplierNames(uniqueSupplierNames);
            } catch (error) {
                console.error("Error fetching low stock alerts:", error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // Apply filters to the alerts list
        const applyFilters = () => {
            setFilteredAlerts(alerts.filter(alert =>
                (filterOptions.item_name ? alert.item_name.toLowerCase().includes(filterOptions.item_name.toLowerCase()) : true) &&
                (filterOptions.supplier_name ? alert.supplier_name.toLowerCase().includes(filterOptions.supplier_name.toLowerCase()) : true)
            ));
        };
        applyFilters();
    }, [filterOptions, alerts]);

    return (
        <div>
            <h1>Low Stock Alerts</h1>
            <div
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexWrap: "wrap", // Enable wrapping for filters
                    gap: "10px", // Maintain spacing between items
                }}
            >
                <Autocomplete
                    options={itemNames}
                    onInputChange={(e, value) =>
                        setFilterOptions((prev) => ({ ...prev, item_name: value }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Item Name" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 300px", // Flexible with a base width of 300px
                        '& .MuiAutocomplete-popper': {
                            maxWidth: "none", // Prevent dropdown truncation
                            width: "auto",
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: "nowrap", // Prevent option wrapping
                        },
                    }}
                />
                <Autocomplete
                    options={supplierNames}
                    onInputChange={(e, value) =>
                        setFilterOptions((prev) => ({ ...prev, supplier_name: value }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Supplier Name" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 300px", // Flexible with a base width of 300px
                        '& .MuiAutocomplete-popper': {
                            maxWidth: "none",
                            width: "auto",
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: "nowrap",
                        },
                    }}
                />
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Current Stock</TableCell>
                            <TableCell>Reorder Level</TableCell>
                            <TableCell>Supplier Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAlerts.map((alert, index) => (
                            <TableRow key={index}>
                                <TableCell>{alert.item_name}</TableCell>
                                <TableCell>{alert.current_stock}</TableCell>
                                <TableCell>{alert.reorder_level}</TableCell>
                                <TableCell>{alert.supplier_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
