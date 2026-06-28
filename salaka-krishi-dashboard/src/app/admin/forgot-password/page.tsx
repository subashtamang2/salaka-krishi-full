'use client';

import { useState } from 'react';
import { Button, TextField, Stack, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { forgotPassword } from 'api/forget-password';


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        console.log("🔥 BUTTON CLICKED");

        if (!email) {
            toast.error('Email required');
            return;
        }

        try {
            setLoading(true);

            const res = await forgotPassword(email);

            toast.success(res.data.message || 'Reset link sent to email');
            setEmail('');
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                width: 380,
                margin: 'auto',
                mt: 10,
                p: 4,
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Typography variant="h5" fontWeight="bold">
                    Forgot Password
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Enter your email and we will send reset link.
                </Typography>

                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </Stack>
        </Paper>
    );
}
