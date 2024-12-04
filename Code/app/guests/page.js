"use client"

import { useEffect, useState } from "react"
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete } from "@mui/material"
import Link from 'next/link'
import { Button } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from 'next/navigation'

export default function Guests() {

    const router = useRouter()
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [search, setSearch] = useState("")
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        street: "",
        city: "",
        state: "",
        zip_code: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch('/api/users')
                const response = await data.json()
                setUsers(response)
                setFilteredUsers(response)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleSearchChange = (e) => {
        const { name, value } = e.target
        setFilterOptions((prev) => ({ ...prev, [name]: value }))
    }

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedUser(null);
    };

    const applyFilters = () => {
        setFilteredUsers(users.filter(user =>
            (user.first_name.toLowerCase().includes(filterOptions.first_name.toLowerCase())) &&
            (user.last_name.toLowerCase().includes(filterOptions.last_name.toLowerCase())) &&
            (user.email.toLowerCase().includes(filterOptions.email.toLowerCase())) &&
            (user.phone_number.toLowerCase().includes(filterOptions.phone_number.toLowerCase())) &&
            (user.street.toLowerCase().includes(filterOptions.street.toLowerCase())) &&
            (user.city.toLowerCase().includes(filterOptions.city.toLowerCase())) &&
            (user.state.toLowerCase().includes(filterOptions.state.toLowerCase())) &&
            (user.zip_code.toLowerCase().includes(filterOptions.zip_code.toLowerCase()))
        ))
    }

    const handleConfirmEdit = async () => {
        try {
            await fetch(`/api/users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),
            });
            // Update the list of users with the edited data
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user))
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user))
            );
            handleCloseEditDialog();
        } catch (error) {
            console.log(error);
        }
    };

    const handleMakeReservationClick = (user) => {
        router.push(`/reservations/new/${user.id}`);
    };


    useEffect(() => {
        applyFilters()
    }, [filterOptions])

    return (
        <div>
            <h1>Guests</h1>
            <div>
                <Link href="/guests/register" passHref>
                    <Button variant="contained" color="primary">
                        Register Guest
                    </Button>
                </Link>
            </div>
            <div
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexWrap: "wrap", // Allow wrapping to the next line
                    gap: "10px",
                }}
            >
                <TextField
                    label="First Name"
                    name="first_name"
                    variant="outlined"
                    onChange={handleSearchChange}
                    sx={{ flex: "1 1 200px" }} // Allow flexible width
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    variant="outlined"
                    onChange={handleSearchChange}
                    sx={{ flex: "1 1 200px" }}
                />
                <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    onChange={handleSearchChange}
                    sx={{ flex: "1 1 300px" }}
                />
                <TextField
                    label="Phone"
                    name="phone_number"
                    variant="outlined"
                    onChange={handleSearchChange}
                    sx={{ flex: "1 1 200px" }}
                />
                <Autocomplete
                    options={[...new Set(users.map((user) => user.street))]}
                    onInputChange={(e, value) =>
                        handleSearchChange({ target: { name: "street", value } })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Street" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 250px",
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
                    options={[...new Set(users.map((user) => user.city))]}
                    onInputChange={(e, value) =>
                        handleSearchChange({ target: { name: "city", value } })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="City" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 250px",
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
                    options={[...new Set(users.map((user) => user.state))]}
                    onInputChange={(e, value) =>
                        handleSearchChange({ target: { name: "state", value } })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="State" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 150px",
                        '& .MuiAutocomplete-popper': {
                            maxWidth: "none",
                            width: "auto",
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: "nowrap",
                        },
                    }}
                />
                {/* <Autocomplete
                    options={[...new Set(users.map((user) => user.zip_code))]}
                    onInputChange={(e, value) =>
                        handleSearchChange({ target: { name: "zip_code", value } })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="ZIP Code" variant="outlined" />
                    )}
                    sx={{
                        flex: "1 1 200px",
                        '& .MuiAutocomplete-popper': {
                            maxWidth: "none",
                            width: "auto",
                        },
                        '& .MuiAutocomplete-option': {
                            whiteSpace: "nowrap",
                        },
                    }}
                /> */}
            </div>


            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Street</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>State</TableCell>
                            {/* <TableCell>ZIP</TableCell> */}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.first_name}</TableCell>
                                <TableCell>{user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone_number}</TableCell>
                                <TableCell>{user.street}</TableCell>
                                <TableCell>{user.city}</TableCell>
                                <TableCell>{user.state}</TableCell>
                                {/* <TableCell>{user.zip_code}</TableCell> */}
                                <TableCell>
                                    <EditIcon
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleEditClick(user)}
                                    />
                                    <EventIcon
                                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                                        onClick={() => handleMakeReservationClick(user)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Guest</DialogTitle>
                <DialogContent>
                    <TextField
                        label="First Name"
                        value={selectedUser?.first_name || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Last Name"
                        value={selectedUser?.last_name || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Email"
                        value={selectedUser?.email || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Phone Number"
                        value={selectedUser?.phone_number || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, phone_number: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Street"
                        value={selectedUser?.street || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, street: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="City"
                        value={selectedUser?.city || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, city: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="State"
                        value={selectedUser?.state || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, state: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="ZIP Code"
                        value={selectedUser?.zip_code || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, zip_code: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancel</Button>
                    <Button onClick={handleConfirmEdit} color="primary">Confirm Edit</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
