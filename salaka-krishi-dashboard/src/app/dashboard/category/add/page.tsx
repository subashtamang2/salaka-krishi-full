"use client";

import {
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { useEffect } from "react";
import slugify from "react-slugify";
import { toast, ToastContainer } from "react-toastify";
import { Category, CategoryStatus } from "schema/category";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { uploadFiles } from "api/upload";
import { createCategory } from "api/category";
import { useRouter } from "next/navigation";

const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    slug: yup.string().required("Slug is required").lowercase(),
    status: yup
        .mixed<CategoryStatus>()
        .oneOf(Object.values(CategoryStatus))
        .required("Status is required"),
});

export default function Page() {
    const router = useRouter();

    const createCategoryMutation = useMutation({
        mutationKey: ["create-category"],
        mutationFn: async (payload: Category) => {
            const res = await createCategory(payload);
            return res.data;
        },
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            slug: "",
            imageUrl: "",
            status: CategoryStatus.Active,
            file: null as File | null,
        },
        validationSchema,

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const { file, ...rest } = values;

            const processImage = async (file: File | null) => {
                if (!file) return undefined;

                const res = await uploadFiles(file);
                return res?.filename ?? undefined;
            };

            try {
                const imageUrl = await processImage(file);

                const payload: Category = {
                    ...rest,
                    imageUrl,
                };

                createCategoryMutation.mutate(payload, {
                    onSuccess: () => {
                        toast.success("Category added successfully!");
                        resetForm();
                        formik.setFieldValue("file", null);

                        setTimeout(() => {
                            router.push("/dashboard/category");
                        }, 800);
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message || "Error adding category!";
                        toast.error(message);
                        console.error(error);
                    },
                    onSettled: () => {
                        setSubmitting(false);
                    },
                });
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong!");
                setSubmitting(false);
            }
        },
    });

    // Auto slug generator
    useEffect(() => {
        const generatedSlug = slugify(formik.values.name || "").toLowerCase();

        if (formik.values.slug !== generatedSlug) {
            formik.setFieldValue("slug", generatedSlug);
        }
    }, [formik.values.name]);

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer />

                <Grid item lg={7}>
                    <MainCard title="Add Category" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3.5}>


                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Name</InputLabel>
                                        <TextField
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>


                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Slug</InputLabel>
                                        <TextField
                                            name="slug"
                                            value={formik.values.slug}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.slug && Boolean(formik.errors.slug)}
                                            helperText={formik.touched.slug && formik.errors.slug}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>


                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Upload Image</InputLabel>
                                        <UploadSingleFile
                                            setFieldValue={formik.setFieldValue}
                                            file={formik.values.file}
                                            error={formik.touched.file && Boolean(formik.errors.file)}
                                        />
                                    </Stack>
                                </Grid>


                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Status</InputLabel>
                                        <TextField
                                            select
                                            name="status"
                                            value={formik.values.status}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        >
                                            {Object.values(CategoryStatus).map((value) => (
                                                <MenuItem key={value} value={value}>
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>

                                    {formik.touched.status && formik.errors.status && (
                                        <FormHelperText error>
                                            {formik.errors.status}
                                        </FormHelperText>
                                    )}
                                </Grid>


                                <Grid item xs={12}>
                                    <Stack
                                        direction="row"
                                       justifyContent={"space-between"}
                                        gap={2}
                                    >
                                        <Button
                                            variant="outlined"
                                            type="reset"
                                            onClick={() => formik.resetForm()}
                                        >
                                           Reset
                                        </Button>

                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={formik.isSubmitting || !formik.dirty}
                                        >
                                            Add Category
                                        </Button>
                                    </Stack>
                                </Grid>

                            </Grid>
                        </form>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    );
}
