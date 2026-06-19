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
import { useMutation } from "@tanstack/react-query";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { uploadFiles } from "api/upload";
import { createGalleryImage } from "api/gallery";
import { useRouter } from "next/navigation";
import { CreateGalleryPayload } from "schema/gallery";

const validationSchema = yup.object({
    title: yup.string().optional(),
    altText: yup.string().optional(),
    isPublished: yup.boolean().required(),
    file: yup.mixed().required("Image is required"),
});

export default function AddGalleryPage() {
    const router = useRouter();

    const createGalleryMutation = useMutation({
        mutationKey: ["create-gallery"],
        mutationFn: async (payload: CreateGalleryPayload) => {
            const res = await createGalleryImage(payload);
            return res.data;
        },
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            altText: "",
            imageUrl: "",
            isPublished: true,
            file: null as File | null,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            try {
                let imageUrl = "";
                if (values.file) {
                    const res = await uploadFiles(values.file);
                    imageUrl = res?.filename || "";
                }

                const payload: CreateGalleryPayload = {
                    title: values.title,
                    altText: values.altText,
                    imageUrl: imageUrl,
                    isPublished: values.isPublished,
                };

                createGalleryMutation.mutate(payload, {
                    onSuccess: () => {
                        toast.success("Image added to gallery successfully!");
                        resetForm();
                        formik.setFieldValue("file", null);

                        setTimeout(() => {
                            router.push("/dashboard/gallery");
                        }, 800);
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message || "Error adding image!";
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

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer />

                <Grid item lg={7}>
                    <MainCard title="Add Gallery Image" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3.5}>

                              
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
                                            Add  Gallery
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
