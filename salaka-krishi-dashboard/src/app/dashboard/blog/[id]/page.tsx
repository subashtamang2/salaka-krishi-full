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
import { getBlogById, updateBlog } from "api/blog";
import { getCategories } from "api/category";
import { uploadFiles } from "api/upload";
import Error404 from "app/dashboard/error";
import Loading from "app/dashboard/loading";
import AutocompleteCard from "components/Autocomplete";
import MainCard from "components/MainCard";
import dynamic from 'next/dynamic';
const ReactQuillDemo = dynamic(() => import('components/ReactQuill'), { ssr: false });
import UploadSingleFile from "components/dropzone/SingleFile";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { BlogInterface, BlogUpdatePayload } from "schema/blog";
import { DataWrapper } from "schema/schema";
import * as yup from "yup";


const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    slug: yup.string().required("Slug is required").lowercase(),
    shortDesc: yup.string().required("Short description is required"),
    imageUrl: yup.string().nullable(),
    content: yup.string().required("content is required"),
    isPublished: yup.boolean(),
    keywords: yup.array().of(yup.string().trim().required("Keyword cannot be empty")).min(1, "At least one keyword is required"),
    categoryId: yup.string().required("Category is required"),
});

interface UploadFile extends File {
    preview?: string;
}
export default function Page() {
    const router = useRouter();
    const { id: paramsId } = useParams<{ id: string }>();

    const updateBlogMutation = useMutation({
        mutationFn: async (payload: BlogUpdatePayload) => {
            const res = await updateBlog(paramsId, payload);
            return res.data;
        },
    });
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
    const { data: blogRes, isError, isLoading } = useQuery<DataWrapper<BlogInterface>>({
        queryKey: ['edit-blog', paramsId],
        enabled: !!paramsId,
        queryFn: async () => {
            const res = await getBlogById(paramsId);
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
    const blog = blogRes?.data;
    const initialFile: UploadFile | null = blog?.imageUrl
        ? Object.assign({
            preview: `${imageBaseUrl}/${blog.imageUrl}`,
        })
        : null;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: blog?.title || "",
            slug: blog?.slug || "",
            shortDesc: blog?.shortDesc || "",
            imageUrl: blog?.imageUrl || "",
            content: blog?.content || "",
            isPublished: blog?.isPublished || false,
            keywords: blog?.keywords || [],
            categoryId: blog?.categoryId || "",
            file: initialFile,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, slug: _, ...rest } = values;

            let imageUrl: string | null = null;
            if (file && file instanceof File) {
                const res = await uploadFiles(file);
                imageUrl = res?.filename;
            }
            const payload = {
                ...rest,
                imageUrl: imageUrl || undefined,
            };
            updateBlogMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Blog updated successfully!");
                    resetForm();
                    formik.setFieldValue("file", null);
                    setSubmitting(false);
                    setTimeout(() => {
                        router.push("/dashboard/blog");
                    }, 500);
                },
                onError: (error: any) => {
                    toast.error(`Error updating blog: ${error?.response?.data?.message || error.message}`);
                    console.error("Error updating blog:", error);
                    setSubmitting(false);
                }
            });
        },
    });

    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Blog not found" />

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={7}>
                    <MainCard title="Update Blog" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="update-form">
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
                                    <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                                        <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                                            Undo Changes
                                        </Button>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting || !formik.dirty}>
                                            Update Blog
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
