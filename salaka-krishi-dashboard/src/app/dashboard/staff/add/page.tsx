"use client";

import {
    Autocomplete,
    Button,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField
} from "@mui/material";
import { Eye, EyeSlash } from "@wandersonalwes/iconsax-react";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { SyntheticEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {UserInterface, UserInterfaceForm, UserRole } from "schema/schema";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { userStore } from "store/userStore";
import { useMutation } from "@tanstack/react-query";
import { uploadFiles } from "api/upload";
import { createUser } from "api/staff";
import { useRouter } from "next/navigation";
import { useEffect } from "react";




const validationSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().optional(),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password should be at least 6 characters").required("Password is required"),
    role: yup.mixed<UserRole>().required("Role is required")
});


interface UploadFile extends File {
    preview?: string;
}

export default function page() {
    const router = useRouter();
    const user = userStore((state) => state.user);

    useEffect(() => {
        if (user && user.role !== UserRole.SuperAdmin) {
            router.push("/dashboard/staff");
        }
    }, [user, router]);

    if (user && user.role !== UserRole.SuperAdmin) {
        return null;
    }

    const updateUserMutation = useMutation({
        mutationFn: async (payload: UserInterface) => {
            const res = await createUser(payload);
            return res?.data;
        },
    });


    const formik = useFormik<UserInterfaceForm>({
        initialValues: {
            profileUrl: null,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: UserRole.Admin,
            file: null,
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, ...restValues } = values;


            const processImages = async (file: UploadFile | null) => {
                let imageUrl: string | null = null;
                if (file && file instanceof File) {
                    const res = await uploadFiles(file);
                    imageUrl = res?.filename ?? null;
                }
                return {
                    imageUrl,
                };
            };

            processImages(file ?? null).then((finalValues) => {
                const { imageUrl } = finalValues;
                const data = {
                    ...restValues,
                    profileUrl: imageUrl,
                };

                updateUserMutation.mutate(data, {
                    onSuccess: () => {
                        toast.success("User added successfully!");
                        resetForm();
                        formik.setFieldValue("file", null);
                        setSubmitting(false);
                    },
                    onError: (error) => {
                        toast.error("Error adding user!");
                        console.error("Error adding user:", error);
                        setSubmitting(false);
                    },
                });
            });
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: SyntheticEvent) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={7}>
                    <MainCard title="Add Users" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="add-user-form">
                            <Grid container spacing={3.5}>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Profile Image</InputLabel>
                                        <UploadSingleFile
                                            setFieldValue={formik.setFieldValue}
                                            file={formik.values.file!}
                                            error={formik.touched.file && Boolean(formik.errors.file)}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>First Name</InputLabel>
                                        <TextField
                                            id="firstName"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formik.values.firstName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                            helperText={formik.touched.firstName && formik.errors.firstName}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Last Name</InputLabel>
                                        <TextField
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formik.values.lastName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                            helperText={formik.touched.lastName && formik.errors.lastName}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Email</InputLabel>
                                        <TextField
                                            id="email"
                                            name="email"
                                            disabled={user?.role === UserRole.Admin ? true : false}
                                            placeholder="Enter YourEmail"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Your Role</InputLabel>
                                        <Autocomplete<UserRole>
                                            onBlur={formik.handleBlur}
                                            id="role"
                                            disabled={user?.role === UserRole.Admin ? true : false}
                                            value={formik.values.role}
                                            onChange={(_, newValue) => {
                                                formik.setFieldValue("role", newValue);
                                            }}
                                            options={Object.entries(UserRole).map(([_, value]) => value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select role"
                                                    sx={{ "& .MuiAutocomplete-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    {formik.touched.role && formik.errors.role && (
                                        <FormHelperText error id="helper-text-country">
                                            {formik.errors.role}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel htmlFor="password-login">Password</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(formik.touched.password && formik.errors.password)}
                                            id="-password-login"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formik.values.password}
                                            name="password"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        color="secondary">
                                                        {showPassword ? <Eye /> : <EyeSlash />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="Enter password"
                                        />
                                    </Stack>
                                    {formik.touched.password && formik.errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {formik.errors.password}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                                        <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                                            Undo Changes
                                        </Button>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting && !formik.dirty && user?.role !== UserRole.Admin}>
                                            Add User
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    )
}
