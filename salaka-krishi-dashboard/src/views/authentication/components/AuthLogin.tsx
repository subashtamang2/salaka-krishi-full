'use client';

import { useState, SyntheticEvent } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import { Formik } from 'formik';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { Eye, EyeSlash } from '@wandersonalwes/iconsax-react';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { login } from 'api/auth';
import { setAccessToken, setRefreshToken } from 'api/local-storage';

interface LoginProps {
    email: string;
    password: string;
}


export default function AuthLogin() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event: SyntheticEvent) => {
        event.preventDefault();
    };

    const mutate = useMutation({
        mutationFn: async (data: LoginProps) => {
            const res = await login(data);
            return res.data.data;
        }
    })

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string()
                        .required('Password is required')
                        .test('no-leading-trailing-whitespace', 'Password can not start or end with spaces', (value) => value === value.trim())
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setSubmitting(true);
                    mutate.mutate(values, {
                        onSuccess: (data) => {
                            const accessToken = data.access_token;
                            const refreshToken = data.refresh_token;

                            setAccessToken(accessToken);
                            setRefreshToken(refreshToken);

                            toast.success('Login successful!');
                            setSubmitting(false);
                            setStatus({ success: true });
                            setTimeout(() => {
                                router.push('/dashboard');
                            }, 500);
                        },
                        onError: (error: any) => {
                            const message = error?.response?.data?.message;
                            const errorMessage = Array.isArray(message) ? message[0] : (message || 'Login failed. Please try again.');
                            toast.error(errorMessage);
                            setSubmitting(false);
                            setStatus({ success: false });
                        }
                    })
                }}>
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="email-login">Email Address</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                </Stack>
                                {touched.email && errors.email && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    color="secondary"
                                                >
                                                    {showPassword ? <Eye /> : <EyeSlash />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                </Stack>
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid size={12}>
                                <AnimateButton>
                                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                        Login
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            <Grid size={12}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={() => router.push('/admin/forgot-password')}
                                    >
                                        Forgot Password?
                                    </Button>
                                </Stack>
                            </Grid>

                        </Grid>
                    </form>
                )}
            </Formik >
        </>
    );
}
