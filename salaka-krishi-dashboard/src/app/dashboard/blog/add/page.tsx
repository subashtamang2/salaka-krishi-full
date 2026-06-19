"use client";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Stack,
    TextField
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBlog } from "api/blog";
import { uploadFiles } from "api/upload";
import { getCategories } from "api/category";
import AutocompleteCard from "components/Autocomplete";
import MainCard from "components/MainCard";
import dynamic from 'next/dynamic';
const ReactQuillDemo = dynamic(() => import('components/ReactQuill'), { ssr: false });
import UploadSingleFile from "components/dropzone/SingleFile";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import slugify from "react-slugify";
import { toast, ToastContainer } from "react-toastify";
import { CreateBlogPayload } from "schema/blog";
import * as yup from "yup";


const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    slug: yup.string().required("Slug is required").lowercase(),
    shortDesc: yup.string().required("Short description is required"),
    imageUrl: yup.array().of(yup.string().url("Each image URL must be a valid URL")).min(1, "At least one image URL is required"),
    content: yup.string().required("content is required"),
    isPublished: yup.boolean(),
    keywords: yup.array().of(yup.string().trim().required("Keyword cannot be empty")).min(1, "At least one keyword is required"),
    categoryId: yup.string().required("Category is required"),
});

export default function Page() {
    const router = useRouter();

    const createBlogMutation = useMutation({
        mutationFn: async (payload: CreateBlogPayload) => {
            const res = await createBlog(payload);
            return res.data;
        },
    });

    const { data: categoriesRes } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await getCategories();
            return res.data;
        },
    });
    const categories = categoriesRes?.data || categoriesRes || [];

    const formik = useFormik({
        initialValues: {
            title: "",
            slug: "",
            shortDesc: "",
            imageUrl: "",
            content: "",
            isPublished: false,
            keywords: [],
            file: null,
            categoryId: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, ...rest } = values;

            let imageUrl: string = "";
            if (file) {
                const res = await uploadFiles(file);
                imageUrl = res?.filename || "";
            }
            const payload = {
                ...rest,
                imageUrl,
            };
            createBlogMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Blog added successfully!");
                    resetForm();
                    formik.setFieldValue("file", null);
                    setSubmitting(false);
                    setTimeout(() => {
                        router.push("/dashboard/blog");
                    }, 500);
                },
                onError: (error: any) => {
                    toast.error(`Error adding blog: ${error?.response?.data?.message || error.message}`);
                    console.error("Error creating blog:", error);
                    setSubmitting(false);
                }
            });
        },
    });

    useEffect(() => {
        const generatedSlug = slugify(formik.values.title).toLowerCase();

        if (formik.values.slug !== generatedSlug) {
            formik.setFieldValue("slug", generatedSlug);
        }
    }, [formik.values.title]);

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={7}>
                    <MainCard title="Add Blog" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="add-form">
                            <Grid container spacing={3.5}>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Title</InputLabel>
                                        <TextField
                                            id="title"
                                            name="title"
                                            placeholder="Blog Title"
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
                                        <InputLabel>Slug</InputLabel>
                                        <TextField
                                            id="slug"
                                            name="slug"
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
                                        <InputLabel>Image Url</InputLabel>
                                        <UploadSingleFile
                                            setFieldValue={formik.setFieldValue}
                                            file={formik.values.file!}
                                            error={formik.touched.file && Boolean(formik.errors.file)}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Short Description </InputLabel>
                                        <TextField
                                            id="shortDesc"
                                            name="shortDesc"
                                            placeholder="Short Description "
                                            value={formik.values.shortDesc}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.shortDesc && Boolean(formik.errors.shortDesc)}
                                            helperText={formik.touched.shortDesc && formik.errors.shortDesc}
                                            multiline
                                            rows={5}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Blog Content</InputLabel>
                                        <ReactQuillDemo value={formik.values.content} formik={formik} fieldName="content" />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <FormControlLabel sx={{ width: "fit-content" }}
                                            control={<Checkbox
                                                size="small"
                                                name="isPublished" checked={formik.values.isPublished}
                                                onChange={formik.handleChange} />}
                                            label="Publish Blog" />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Keywords</InputLabel>
                                        <AutocompleteCard keywords={[]} formik={formik} />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Category</InputLabel>
                                        <TextField
                                            select
                                            id="categoryId"
                                            name="categoryId"
                                            value={formik.values.categoryId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                                            helperText={formik.touched.categoryId && formik.errors.categoryId}
                                            fullWidth
                                        >
                                            <MenuItem value="" disabled>Select Category</MenuItem>
                                            {categories.map((cat: any) => (
                                                <MenuItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
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
                                            Add  Blog
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
