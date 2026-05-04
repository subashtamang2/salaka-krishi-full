"use client";
import {
    Button,
    FormControlLabel,
    Grid,
    InputLabel,
    Stack,
    TextField,
    Checkbox
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { uploadFiles } from "api/upload";
import { getGalleryImageById, updateGalleryImage } from "api/gallery";
import { useParams, useRouter } from "next/navigation";
import { GalleryResponse, UpdateGalleryPayload } from "schema/gallery";
import { DataWrapper } from "schema/schema";
import Loading from "app/dashboard/loading";
import Error404 from "app/dashboard/error";

interface UploadFile extends File {
    preview?: string;
}

const validationSchema = yup.object({
    title: yup.string().optional(),
    altText: yup.string().optional(),
    isPublished: yup.boolean().required(),
});

export default function EditGalleryPage() {
    const router = useRouter();
    const { id: paramsId } = useParams<{ id: string }>();

    const { data: galleryRes, isError, isLoading } = useQuery<DataWrapper<GalleryResponse>>({
        queryKey: ['edit-gallery', paramsId],
        enabled: !!paramsId,
        queryFn: async () => {
            const res = await getGalleryImageById(paramsId);
            return res.data;
        },
    });

    const gallery = galleryRes?.data;
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

    const initialFile: UploadFile | null = gallery?.imageUrl
        ? Object.assign({
            preview: `${imageBaseUrl}/${gallery.imageUrl}`,
        })
        : null;

    const updateGalleryMutation = useMutation({
        mutationKey: ["update-gallery"],
        mutationFn: async (payload: UpdateGalleryPayload) => {
            const res = await updateGalleryImage(paramsId, payload);
            return res.data;
        },
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: gallery?.title || "",
            altText: gallery?.altText || "",
            imageUrl: gallery?.imageUrl || "",
            isPublished: gallery?.isPublished ?? true,
            file: initialFile,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);

            try {
                let imageUrl = values.imageUrl;
                if (values.file && values.file instanceof File) {
                    const res = await uploadFiles(values.file);
                    imageUrl = res?.filename || values.imageUrl;
                }

                const payload: UpdateGalleryPayload = {
                    title: values.title,
                    altText: values.altText,
                    imageUrl: imageUrl,
                    isPublished: values.isPublished,
                };

                updateGalleryMutation.mutate(payload, {
                    onSuccess: () => {
                        toast.success("Gallery image updated successfully!");
                        setTimeout(() => {
                            router.push("/dashboard/gallery");
                        }, 800);
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message || "Error updating image!";
                        toast.error(message);
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

    if (isLoading) return <Loading />
    if (isError || !gallery) return <Error404 title="Gallery image not found" />

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer />

                <Grid item lg={7}>
                    <MainCard title="Update Gallery Image" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3.5}>

                                {/* TITLE */}
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Title (Optional)</InputLabel>
                                        <TextField
                                            name="title"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                {/* ALT TEXT */}
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Alt Text (Optional, for SEO)</InputLabel>
                                        <TextField
                                            name="altText"
                                            value={formik.values.altText}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.altText && Boolean(formik.errors.altText)}
                                            helperText={formik.touched.altText && formik.errors.altText}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                {/* IMAGE */}
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

                                {/* IS PUBLISHED */}
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isPublished"
                                                checked={formik.values.isPublished}
                                                onChange={formik.handleChange}
                                            />
                                        }
                                        label="Published"
                                    />
                                </Grid>

                                {/* BUTTONS */}
                                <Grid item xs={12}>
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-end"
                                        gap={2}
                                    >
                                        <Button
                                            variant="outlined"
                                            type="reset"
                                            onClick={() => formik.resetForm()}
                                        >
                                            Undo Changes
                                        </Button>

                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={formik.isSubmitting || !formik.dirty}
                                        >
                                            Update Image
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
