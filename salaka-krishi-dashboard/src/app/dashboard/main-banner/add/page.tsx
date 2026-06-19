"use client";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { uploadFiles } from "api/upload";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Checkbox } from "@mui/material";
import { CreateMainBannerPayload } from "schema/main-banner";
import { addMainBanner } from "api/main-banner";
import { getCategories } from "api/category";
import { CategoryResponse } from "schema/category";
import { DataWrapper } from "schema/schema";


interface UploadFile extends File {
    preview?: string;
}

const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    tagLine: yup.string().required("Tag line is required"),
    order: yup.number().required("Order is required").min(0, "Order cannot be negative"),
    categoryId: yup.string().required("Category is required"),
});

export default function Page() {
    const router = useRouter();

    const { data: categoryData } = useQuery<DataWrapper<CategoryResponse[]>>({
        queryKey: ['categories'],
        queryFn: async () => {
            const rest = await getCategories();
            return rest.data;
        }
    });
    const categories = categoryData?.data || [];

    const createBannerMutate = useMutation({
        mutationFn: async (bannerData: CreateMainBannerPayload) => {
            return addMainBanner(bannerData);
        },
    });
    type BannerFormValues = CreateMainBannerPayload & {
        file?: UploadFile | null;
    };
    const formik = useFormik<BannerFormValues>({
        initialValues: {
            title: "",
            tagLine: "",
            imageUrl: "",
            order: 0,
            categoryId: "",
            isActive: true,
            file: null,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, ...restValues } = values;


            const processImages = async (file: UploadFile | null) => {
                let imageUrl: string = "";
                if (file && file instanceof File) {
                    const res = await uploadFiles(file);
                    imageUrl = res?.filename ?? "";
                }

                return {
                    imageUrl
                };
            };

            processImages(file ?? null).then((finalValues) => {
                const { imageUrl } = finalValues;
                const data = {
                    ...restValues,
                    imageUrl,
                };
                createBannerMutate.mutate(data, {
                    onSuccess: (data) => {
                        toast.success("Banner added successfully!");
                        resetForm();
                        formik.setFieldValue("file", null);
                        setSubmitting(false);
                        setTimeout(() => {
                            router.push("/dashboard/main-banner");
                        }, 500);
                    },
                    onError: (error) => {
                        toast.error("Error adding banner!");
                        console.error("Error creating banner:", error);
                        setSubmitting(false);
                    },
                });
            });
        },
    });


    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={7}>
                    <MainCard title="Add Banner" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="add-form">
                            <Grid container spacing={3.5}>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Title</InputLabel>
                                        <TextField
                                            id="title"
                                            name="title"
                                            placeholder="Banner Title"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Tag Line</InputLabel>
                                        <TextField
                                            id="tagLine"
                                            name="tagLine"
                                            placeholder="Banner Tag Line"
                                            value={formik.values.tagLine}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.tagLine && Boolean(formik.errors.tagLine)}
                                            helperText={formik.touched.tagLine && formik.errors.tagLine}
                                            multiline
                                            rows={2}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Order</InputLabel>
                                        <TextField
                                            id="order"
                                            name="order"
                                            type="number"
                                            placeholder="Display Order"
                                            value={formik.values.order}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.order && Boolean(formik.errors.order)}
                                            helperText={formik.touched.order && formik.errors.order}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Category</InputLabel>
                                        <FormControl fullWidth error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}>
                                            <Select
                                                id="categoryId"
                                                name="categoryId"
                                                displayEmpty
                                                value={formik.values.categoryId}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Category
                                                </MenuItem>
                                                {categories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formik.touched.categoryId && formik.errors.categoryId && (
                                                <FormHelperText>{formik.errors.categoryId}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Banner Image</InputLabel>
                                        <UploadSingleFile
                                            setFieldValue={formik.setFieldValue}
                                            file={formik.values.file!}
                                            error={formik.touched.file && Boolean(formik.errors.file)}
                                        />
                                    </Stack>
                                    {formik.touched.file && formik.errors.file && (
                                        <FormHelperText error id="helper-text-country">
                                            {formik.errors.file}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={3} sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                    <Stack sx={{ gap: 1, }}>
                                        <FormControlLabel
                                            control={<Checkbox
                                                size="small"
                                                name="isActive" checked={formik.values.isActive}
                                                onChange={formik.handleChange} />}
                                            label="Active" />
                                    </Stack>
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
                                            Add  Banner
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
