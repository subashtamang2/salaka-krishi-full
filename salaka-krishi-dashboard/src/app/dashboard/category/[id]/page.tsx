"use client";
import { Autocomplete, Button, FormHelperText, Grid, InputLabel, Stack, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { CategoryResponse, CategoryStatus, CategoryUpdate } from "schema/category";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { uploadFiles } from "api/upload";
import { getCategoryById, updateCategory } from "api/category";
import { useParams, useRouter } from "next/navigation";
import { DataWrapper } from "schema/schema";
import Loading from "app/dashboard/loading";
import Error404 from "app/dashboard/error";



interface UploadFile extends File {
    preview?: string;
}



const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    slug: yup.string().required("Slug is required").lowercase(),
    shopId: yup.string(),
    status: yup.mixed<CategoryStatus>().oneOf(Object.values(CategoryStatus)).required("Status is required"),
});

export default function Page() {
    const router = useRouter();
    const { id: paramsId } = useParams<{ id: string }>();



    const updateCategoryMutation = useMutation({
        mutationKey: ["update-category"],
        mutationFn: async (payload: CategoryUpdate) => {
            const res = await updateCategory(paramsId, payload);
            return res.data;
        },
    });

    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
    const { data: categoryRes, isError: isErrorCategory, isLoading: isLoadingCategory } = useQuery<DataWrapper<CategoryResponse>>({
        queryKey: ['edit-category', paramsId],
        enabled: !!paramsId,
        queryFn: async () => {
            const res = await getCategoryById(paramsId);
            return res.data;
        },
    });
    const category = categoryRes?.data;
    const initialFile: UploadFile | null = category?.imageUrl
        ? Object.assign({
            preview: `${imageBaseUrl}/${category.imageUrl}`,
        })
        : null;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: category?.name || "",
            slug: category?.slug || "",
            imageUrl: category?.imageUrl || "",
            status: category?.status || CategoryStatus.Active,
            file: initialFile,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, slug: _, ...rest } = values;

            const processImage = async (file: File | null) => {
                let imageUrl: string | null = null;
                if (file && file instanceof File) {
                    const res = await uploadFiles(file);
                    imageUrl = res?.filename ?? null;
                }
                return imageUrl;
            }
            processImage(file ?? null).then(async (imageUrl) => {
                const payload = {
                    ...rest,
                    imageUrl: imageUrl ?? undefined,
                };
                updateCategoryMutation.mutate(payload, {
                    onSuccess: (data) => {
                        toast.success("Category updated successfully!");
                        resetForm();
                        formik.setFieldValue("file", null);
                        setSubmitting(false);

                        setTimeout(() => {
                            router.push("/dashboard/category");
                        }, 800);
                    },
                    onError: (error) => {
                        toast.error("Error updating category!");
                        console.error("Error updating category:", error);
                        setSubmitting(false);
                    },
                });
            });
        },
    });

    if (isLoadingCategory || isLoadingCategory) return <Loading />
    if (isErrorCategory) return <Error404 title="Category not found" />




    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={7}>
                    <MainCard title="Update Category" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="update-form">
                            <Grid container spacing={3.5}>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Name</InputLabel>
                                        <TextField
                                            id="name"
                                            name="name"
                                            placeholder="Product Name"
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
                                            id="slug"
                                            name="slug"
                                            disabled
                                            placeholder="Product Slug"
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
                                        <InputLabel>Upload image</InputLabel>
                                        <UploadSingleFile
                                            setFieldValue={formik.setFieldValue}
                                            file={formik.values.file!}
                                            error={formik.touched.file && Boolean(formik.errors.file)}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Autocomplete
                                            onBlur={formik.handleBlur}
                                            id="status"
                                            value={formik.values.status}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue("status", newValue);
                                            }}
                                            options={Object.entries(CategoryStatus).map(([key, value]) => value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select stats"
                                                    sx={{ "& .MuiAutocomplete-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    {formik.touched.status && formik.errors.status && (
                                        <FormHelperText error id="helper-text-country">
                                            {formik.errors.status}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                                        <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                                            Undo Changes
                                        </Button>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting || !formik.dirty}>
                                            Update Category
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
