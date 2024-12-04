"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TextField, Button, MenuItem, Container, Typography } from "@mui/material"
import Box from "@mui/material/Box"

export default function RegisterGuest() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        street: "",
        city: "",
        state: "",
        zip_code: ""
    })

    const usStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                router.push('/guests')  // Redirect to main page on success
            } else {
                console.error("Failed to create user")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Register Guest
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="First Name" name="first_name" variant="outlined" onChange={handleChange} required />
                <TextField label="Last Name" name="last_name" variant="outlined" onChange={handleChange} required />
                <TextField label="Email" name="email" variant="outlined" type="email" onChange={handleChange} required />
                <TextField label="Phone Number" name="phone_number" variant="outlined" onChange={handleChange} />
                <TextField label="Street" name="street" variant="outlined" onChange={handleChange} />
                <TextField label="City" name="city" variant="outlined" onChange={handleChange} />
                
                <TextField
                    select
                    label="State"
                    name="state"
                    variant="outlined"
                    onChange={handleChange}
                    required
                >
                    {usStates.map((state) => (
                        <MenuItem key={state} value={state}>
                            {state}
                        </MenuItem>
                    ))}
                </TextField>
                
                <TextField label="ZIP Code" name="zip_code" variant="outlined" onChange={handleChange} />
                
                <Button variant="contained" color="primary" type="submit">
                    Create User
                </Button>
            </Box>
        </Container>
    )
}
