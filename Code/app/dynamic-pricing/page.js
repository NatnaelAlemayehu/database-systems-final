"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

export default function DynamicPricing() {
    const [rates, setRates] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newRate, setNewRate] = useState({ threshold: "", increase_rate: "" });

    useEffect(() => {
        const fetchRates = async () => {
            const response = await fetch("/api/dynamic-pricing-rates");
            const data = await response.json();
            setRates(data);
        };
        fetchRates();
    }, []);

    const handleSave = async () => {
        try {
            await fetch("/api/dynamic-pricing-rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRate),
            });
            setRates((prev) => [...prev, newRate]);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error saving rate:", error);
        }
    };

    return (
        <div>
            <h1>Dynamic Pricing Rates</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                style={{ marginBottom: "20px" }}
            >
                Add New Rate
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Threshold</TableCell>
                            <TableCell>Increase Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rates.map((rate, index) => (
                            <TableRow key={index}>
                                <TableCell>{rate.threshold}</TableCell>
                                <TableCell>{rate.increase_rate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Rate</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Threshold"
                        type="number"
                        fullWidth
                        margin="dense"
                        onChange={(e) =>
                            setNewRate((prev) => ({ ...prev, threshold: parseFloat(e.target.value) }))
                        }
                    />
                    <TextField
                        label="Increase Rate"
                        type="number"
                        fullWidth
                        margin="dense"
                        onChange={(e) =>
                            setNewRate((prev) => ({ ...prev, increase_rate: parseFloat(e.target.value) }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
