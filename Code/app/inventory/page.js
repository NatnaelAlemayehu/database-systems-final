"use client";

import { useState, useEffect } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        supplier_name: "",
        item_name: ""
    });
    const [supplierNames, setSupplierNames] = useState([]);
    const [itemNames, setItemNames] = useState([]);
    const [editItem, setEditItem] = useState(null); // State to track the item being edited
    const [openEditDialog, setOpenEditDialog] = useState(false); // State to track dialog visibility

    useEffect(() => {
        // Fetch inventory and unique filter options
        const fetchData = async () => {
            try {
                const inventoryData = await fetch('/api/inventory').then(res => res.json());
                setInventory(inventoryData);
                setFilteredInventory(inventoryData);

                // Extract unique supplier names and item names
                const uniqueSupplierNames = [...new Set(inventoryData.map(item => item.supplier_name))];
                const uniqueItemNames = [...new Set(inventoryData.map(item => item.item_name))];

                setSupplierNames(uniqueSupplierNames);
                setItemNames(uniqueItemNames);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // Apply filters to the inventory list
        const applyFilters = () => {
            setFilteredInventory(inventory.filter(item =>
                (filterOptions.supplier_name ? item.supplier_name.toLowerCase().includes(filterOptions.supplier_name.toLowerCase()) : true) &&
                (filterOptions.item_name ? item.item_name.toLowerCase().includes(filterOptions.item_name.toLowerCase()) : true)
            ));
        };
        applyFilters();
    }, [filterOptions, inventory]);

    const handleEditClick = (item) => {
        setEditItem(item); // Set the item to be edited
        setOpenEditDialog(true); // Open the dialog
    };

    const handleEditSave = async () => {
        try {
            await fetch(`/api/inventory/${editItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantity_in_stock: editItem.quantity_in_stock,
                    reorder_level: editItem.reorder_level,
                }),
            });

            // Update the local state after saving
            setInventory((prev) =>
                prev.map((item) =>
                    item.id === editItem.id ? { ...item, ...editItem } : item
                )
            );

            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error updating inventory:", error);
        }
    };

    return (
        <div>
            <h1>Inventory</h1>
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
                    options={itemNames}
                    onInputChange={(e, value) =>
                        setFilterOptions((prev) => ({ ...prev, item_name: value }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Item Name" variant="outlined" />
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
                            <TableCell>Item Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Quantity In Stock</TableCell>
                            <TableCell>Reorder Level</TableCell>
                            <TableCell>Supplier Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInventory.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.item_name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.quantity_in_stock}</TableCell>
                                <TableCell>{item.reorder_level}</TableCell>
                                <TableCell>{item.supplier_name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(item)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Inventory Item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Quantity In Stock"
                        type="number"
                        value={editItem?.quantity_in_stock || ""}
                        onChange={(e) =>
                            setEditItem((prev) => ({ ...prev, quantity_in_stock: e.target.value }))
                        }
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Reorder Level"
                        type="number"
                        value={editItem?.reorder_level || ""}
                        onChange={(e) =>
                            setEditItem((prev) => ({ ...prev, reorder_level: e.target.value }))
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
