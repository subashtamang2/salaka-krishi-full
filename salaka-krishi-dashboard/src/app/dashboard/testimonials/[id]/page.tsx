"use client";
import {
    Button,
    FormHelperText,
    Grid,
    InputLabel,
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
import { useParams, useRouter } from "next/navigation";
import { ClientReviewInterface, ClientReviewSchema } from "schema/client-review";
import { getSingleClientReview, updateClientReview } from "api/client-reviews";
import { DataWrapper } from "schema/schema";
import Loading from "app/dashboard/loading";
import Error404 from "app/dashboard/error";


interface UploadFile extends File {
    preview?: string;
}

const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    imageUrl: yup.string().optional(),
    position: yup.string().optional(),
    review: yup.string().required("Review is required"),
});

export default function Page() {
    const router = useRouter();
    const { id: paramsId } = useParams<{ id: string }>();

    const { data: ClientReviewRes, isError, isLoading } = useQuery<DataWrapper<ClientReviewSchema>>({
        queryKey: ['edit-client-review', paramsId],
        enabled: !!paramsId,
        queryFn: async () => {
            const res = await getSingleClientReview(paramsId);
            return res.data;
        },
    });
    const ClientReview = ClientReviewRes?.data;
    const createClientReview = useMutation({
        mutationFn: async (payload: ClientReviewInterface) => {
            const res = await updateClientReview(paramsId!, payload);
            return res?.data;
        },
    });
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
    const initialFile: UploadFile | null = ClientReview?.imageUrl
        ? Object.assign({
            preview: `${imageBaseUrl}/${ClientReview.imageUrl}`,
        })
        : null;
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: ClientReview?.name ?? "",
            imageUrl: ClientReview?.imageUrl ?? "",
            position: ClientReview?.position ?? "",
            review: ClientReview?.review ?? "",
            file: initialFile,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, ...restValues } = values;


            const processImages = async (file: UploadFile | null) => {
                let imageUrl: string | null = values.imageUrl; // Default to existing image
                if (file && file instanceof File) {
                    const res = await uploadFiles(file);
                    imageUrl = res?.filename ?? values.imageUrl;
                }
                return {
                    imageUrl,
                };
            };

            processImages(file ?? null).then((finalValues) => {
                const { imageUrl } = finalValues;
                const data = {
                    ...restValues,
                    imageUrl,
                };

                createClientReview.mutate(data, {
                    onSuccess: (data) => {
                        toast.success("Client Review updated successfully!");
                        resetForm();
                        formik.setFieldValue("file", null);
                        setSubmitting(false);
                        setTimeout(() => {
                            router.push("/dashboard/testimonials");
                        }, 500);
                    },
                    onError: (error) => {
                        toast.error("Error adding client review!");
                        console.error("Error creating client review:", error);
                        setSubmitting(false);
                    },
                });
            });
        },
    });

    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Client Review not found" />

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={7}>
                    <MainCard title="Edit Client Review" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="add-form">
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
                                        <InputLabel>Position</InputLabel>
                                        <TextField
                                            id="position"
                                            name="position"
                                            placeholder="Position"
                                            value={formik.values.position}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.position && Boolean(formik.errors.position)}
                                            helperText={formik.touched.position && formik.errors.position}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Review</InputLabel>
                                        <TextField
                                            id="review"
                                            name="review"
                                            placeholder="Review"
                                            value={formik.values.review}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.review && Boolean(formik.errors.review)}
                                            helperText={formik.touched.review && formik.errors.review}
                                            multiline
                                            rows={4}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Person Image</InputLabel>
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
                                <Grid item xs={12}>
                                    <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                                        <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                                            Undo Changes
                                        </Button>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting || !formik.dirty}>
                                            Update Review
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
