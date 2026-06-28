'use client';

import { useSearchParams ,useRouter} from 'next/navigation';
import { useState } from 'react';
import { Button, TextField, Stack, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { resetPassword } from 'api/reset-password';


export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!password) {
            toast.error('Password required');
            return;
        }

        if (!token) {
            toast.error('Invalid or missing token');
            return;
        }

        try {
            setLoading(true);

            const res = await resetPassword(token, password);

            toast.success(res.data.message || 'Password reset successful');
            setPassword('');
            setTimeout(() => {
                router.push("/");
            },1000);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || 'Reset failed'
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
                    Reset Password
                </Typography>

                <TextField
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    onClick={handleReset}
                    disabled={loading}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </Stack>
        </Paper>
    );
}
