"use client";

import {
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    Stack,
    TextField
} from "@mui/material";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { DataWrapper } from "schema/schema";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "api/upload";
import { SettingInterface, SettingSchema } from "schema/setting";
import Loading from "app/dashboard/loading";
import AutocompleteCard from "./Autocomplete";
import { addSiteInfo, getSiteInfo } from "api/setting";




const validationSchema = yup.object({
    name: yup.string().required("First name is required"),
    keywords: yup.array().of(yup.string()).required("Keywords are required"),
    description: yup.string().required("Description is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    address: yup.string().optional(),
});


interface UploadFile extends File {
    preview?: string;
}

export default function SiteInfo() {
    const queryClient = useQueryClient();
    const updateUserMutation = useMutation({
        mutationFn: async (payload: SettingInterface) => {
            const res = await addSiteInfo(payload);
            return res?.data;
        },
    });

    const { data: siteDetails, isLoading } = useQuery<DataWrapper<SettingSchema>>({
        queryKey: ['site-info'],
        queryFn: async () => {
            const rest = await getSiteInfo();
            return rest.data;
        }
    });
    const siteInfo = siteDetails?.data;
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
    const initialFile: UploadFile | null = siteInfo?.logoUrl
        ? Object.assign({
            preview: `${imageBaseUrl}/${siteInfo.logoUrl}`,
        })
        : null;
    const formik = useFormik<SettingInterface & { file: UploadFile | null }>({
        enableReinitialize: true,
        initialValues: {
            name: siteInfo?.name || "",
            logoUrl: siteInfo?.logoUrl || "",
            keywords: siteInfo?.keywords || [],
            description: siteInfo?.description || "",
            email: siteInfo?.email || "",
            phone: siteInfo?.phone || "",
            address: siteInfo?.address || "",
            file: initialFile || null,
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, ...restValues } = values;


            const processImages = async (file: UploadFile | null) => {
                let logoUrl: string | null = null;
                if (file && file instanceof File) {
                    const res = await uploadFiles(file);
                    logoUrl = res?.filename ?? null;
                }
                return {
                    logoUrl,
                };
            };

            processImages(file ?? null).then((finalValues) => {
                const { logoUrl } = finalValues;
                const data = {
                    ...restValues,
                    ...(logoUrl ? { logoUrl } : {}),
                };

                updateUserMutation.mutate(data, {
                    onSuccess: (data) => {
                        toast.success("Site info updated successfully!");
                        queryClient.invalidateQueries({ queryKey: ['site-info'] });
                        setSubmitting(false);
                    },
                    onError: (error) => {
                        toast.error("Error updating site info!");
                        console.error("Error updating site info:", error);
                        setSubmitting(false);
                    },
                });
            });
        }
    });
    if (isLoading) return <Loading />

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={12}>
                    <MainCard title="Site Info" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="add-site-info-form">
                            <Grid container spacing={3.5}>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Logo</InputLabel>
                                        <UploadSingleFile
                                            setFieldValue={formik.setFieldValue}
                                            file={formik.values.file!}
                                            error={formik.touched.file && Boolean(formik.errors.file)}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Name</InputLabel>
                                        <TextField
                                            id="name"
                                            name="name"
                                            placeholder="Enter Website Name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Description</InputLabel>
                                        <TextField
                                            id="description"
                                            name="description"
                                            placeholder="Enter Description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                            fullWidth
                                            multiline
                                            rows={5}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Email</InputLabel>
                                        <TextField
                                            id="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Phone</InputLabel>
                                        <TextField
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter Phone Number"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                                            helperText={formik.touched.phone && formik.errors.phone}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Address</InputLabel>
                                        <TextField
                                            id="address"
                                            name="address"
                                            placeholder="Enter Address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.address && Boolean(formik.errors.address)}
                                            helperText={formik.touched.address && formik.errors.address}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Website keywords</InputLabel>
                                        <AutocompleteCard
                                            keywords={[]}
                                            formik={formik}
                                            fieldName="keywords"
                                            placeholder="Enter website keywords (Press enter to add)" />
                                    </Stack>
                                    {formik.touched.keywords && formik.errors.keywords && (
                                        <FormHelperText error id="helper-text-country">
                                            {formik.errors.keywords}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                                        <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                                            Undo Changes
                                        </Button>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting && !formik.dirty}>
                                            Update Site Info
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
