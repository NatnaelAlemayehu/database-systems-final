"use client";

import { useState, useEffect } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete } from "@mui/material";

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        supplier_name: "",
        contact_person: "",
        managing_employee: ""
    });
    const [supplierNames, setSupplierNames] = useState([]);
    const [contactPersons, setContactPersons] = useState([]);
    const [managingEmployees, setManagingEmployees] = useState([]);

    useEffect(() => {
        // Fetch suppliers and unique filter options
        const fetchData = async () => {
            try {
                const suppliersData = await fetch('/api/suppliers').then(res => res.json());
                setSuppliers(suppliersData);
                setFilteredSuppliers(suppliersData);

                // Extract unique filter values
                const uniqueSupplierNames = [...new Set(suppliersData.map(supplier => supplier.supplier_name))];
                const uniqueContactPersons = [...new Set(suppliersData.map(supplier => supplier.contact_person_full_name))];
                const uniqueManagingEmployees = [...new Set(suppliersData.map(supplier => supplier.managing_employee))];

                setSupplierNames(uniqueSupplierNames);
                setContactPersons(uniqueContactPersons);
                setManagingEmployees(uniqueManagingEmployees);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // Apply filters on the suppliers list
        const applyFilters = () => {
            setFilteredSuppliers(suppliers.filter(supplier =>
                (filterOptions.supplier_name ? supplier.supplier_name.toLowerCase().includes(filterOptions.supplier_name.toLowerCase()) : true) &&
                (filterOptions.contact_person ? supplier.contact_person_full_name.toLowerCase().includes(filterOptions.contact_person.toLowerCase()) : true) &&
                (filterOptions.managing_employee ? supplier.managing_employee.toLowerCase().includes(filterOptions.managing_employee.toLowerCase()) : true)
            ));
        };
        applyFilters();
    }, [filterOptions, suppliers]);

    return (
        <div>
            <h1>Suppliers</h1>
            <div
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexWrap: "wrap", // Enable wrapping
                    gap: "10px", // Maintain spacing between items
                }}
            >
                <Autocomplete
                    options={supplierNames}
                    onInputChange={(e, value) =>
                        setFilterOptions((prev) => ({ ...prev, supplier_name: value }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Supplier Name" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 300px", // Flexible with a base width
                        '& .MuiAutocomplete-popper': {
                            maxWidth: "none", // Prevent dropdown truncation
                            width: "auto",
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: "nowrap", // Ensure options are on one line
                        },
                    }}
                />
                <Autocomplete
                    options={contactPersons}
                    onInputChange={(e, value) =>
                        setFilterOptions((prev) => ({ ...prev, contact_person: value }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Contact Person" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 300px", // Flexible with a base width
                        '& .MuiAutocomplete-popper': {
                            maxWidth: "none",
                            width: "auto",
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: "nowrap",
                        },
                    }}
                />
                <Autocomplete
                    options={managingEmployees}
                    onInputChange={(e, value) =>
                        setFilterOptions((prev) => ({ ...prev, managing_employee: value }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Managing Employee" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 300px", // Flexible with a base width
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
                            <TableCell>Supplier Name</TableCell>
                            <TableCell>Contact Person</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Managing Employee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSuppliers.map((supplier, index) => (
                            <TableRow key={index}>
                                <TableCell>{supplier.supplier_name}</TableCell>
                                <TableCell>{supplier.contact_person_full_name}</TableCell>
                                <TableCell>{supplier.phone_number}</TableCell>
                                <TableCell>{supplier.email}</TableCell>
                                <TableCell>{supplier.managing_employee}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
