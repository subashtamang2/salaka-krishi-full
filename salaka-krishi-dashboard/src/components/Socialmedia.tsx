"use client";

import {
    Button,
    Grid,
    InputLabel,
    Stack,
    TextField
} from "@mui/material";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { DataWrapper, } from "schema/schema";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SocialmediaInterface } from "schema/setting";
import Loading from "app/dashboard/loading";
import { addSocialmedia, getSocialmedia } from "api/setting";



const validationSchema = yup.object({
    socialMediaLinks: yup.object({
        facebook: yup.string().url("Invalid Facebook URL").nullable(),
        instagram: yup.string().url("Invalid Instagram URL").nullable(),
        twitter: yup.string().url("Invalid Twitter URL").nullable(),
        youtube: yup.string().url("Invalid YouTube URL").nullable(),
        linkedin: yup.string().url("Invalid LinkedIn URL").nullable(),
        pinterest: yup.string().url("Invalid Pinterest URL").nullable(),
    }),
});


export default function Socialmedia() {
    const queryClient = useQueryClient();
    const updateUserMutation = useMutation({
        mutationFn: async (payload: SocialmediaInterface) => {
            const res = await addSocialmedia(payload);
            return res?.data;
        },
    });

    const { data: socialmediaRes, isLoading } = useQuery<DataWrapper<SocialmediaInterface>>({
        queryKey: ['site-socialmedia'],
        queryFn: async () => {
            const rest = await getSocialmedia();
            return rest.data;
        }
    });
    const socialmedia = socialmediaRes?.data?.socialMediaLinks;
    const formik = useFormik<SocialmediaInterface>({
        enableReinitialize: true,
        initialValues: {
            socialMediaLinks: {
                facebook: socialmedia?.facebook || "",
                instagram: socialmedia?.instagram || "",
                twitter: socialmedia?.twitter || "",
                youtube: socialmedia?.youtube || "",
                linkedin: socialmedia?.linkedin || "",
                pinterest: socialmedia?.pinterest || "",
            }
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            
            // Transform empty strings to null to avoid backend @IsUrl validation errors
            const payload: SocialmediaInterface = {
                socialMediaLinks: Object.entries(values.socialMediaLinks).reduce((acc, [key, value]) => {
                    acc[key as keyof typeof values.socialMediaLinks] = value === "" ? null : value;
                    return acc;
                }, {} as SocialmediaInterface["socialMediaLinks"])
            };

            console.log("payload", payload);

            updateUserMutation.mutate(payload, {
                onSuccess: (data) => {
                    toast.success("Site social media updated successfully!");
                    resetForm();
                    queryClient.invalidateQueries({ queryKey: ['site-socialmedia'] });
                    formik.setFieldValue("file", null);
                    setSubmitting(false);
                },
                onError: (error) => {
                    toast.error("Error updating social media!");
                    console.error("Error updating social media:", error);
                    setSubmitting(false);
                },
            });
        }
    });
    if (isLoading) return <Loading />

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={12}>
                    <MainCard title="Socialmedia" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="add-site-info-form">
                            <Grid container spacing={3.5}>
                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Facebook </InputLabel>
                                        <TextField
                                            id="socialMediaLinks.facebook"
                                            name="socialMediaLinks.facebook"
                                            placeholder="Enter Facebook Url"
                                            value={formik.values.socialMediaLinks.facebook}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik?.touched?.socialMediaLinks?.facebook && Boolean(formik.errors.socialMediaLinks?.facebook)}
                                            helperText={formik?.touched?.socialMediaLinks?.facebook && formik.errors.socialMediaLinks?.facebook}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Instagram </InputLabel>
                                        <TextField
                                            id="socialMediaLinks.instagram"
                                            name="socialMediaLinks.instagram"
                                            placeholder="Enter Instagram Url"
                                            value={formik.values.socialMediaLinks.instagram}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik?.touched?.socialMediaLinks?.instagram && Boolean(formik.errors.socialMediaLinks?.instagram)}
                                            helperText={formik?.touched?.socialMediaLinks?.instagram && formik.errors.socialMediaLinks?.instagram}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Twitter </InputLabel>
                                        <TextField
                                            id="socialMediaLinks.twitter"
                                            name="socialMediaLinks.twitter"
                                            placeholder="Enter Twitter Url"
                                            value={formik.values.socialMediaLinks.twitter}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik?.touched?.socialMediaLinks?.twitter && Boolean(formik.errors.socialMediaLinks?.twitter)}
                                            helperText={formik?.touched?.socialMediaLinks?.twitter && formik.errors.socialMediaLinks?.twitter}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>LinkedIn </InputLabel>
                                        <TextField
                                            id="socialMediaLinks.linkedin"
                                            name="socialMediaLinks.linkedin"
                                            placeholder="Enter LinkedIn Url"
                                            value={formik.values.socialMediaLinks.linkedin}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik?.touched?.socialMediaLinks?.linkedin && Boolean(formik.errors.socialMediaLinks?.linkedin)}
                                            helperText={formik?.touched?.socialMediaLinks?.linkedin && formik.errors.socialMediaLinks?.linkedin}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>YouTube </InputLabel>
                                        <TextField
                                            id="socialMediaLinks.youtube"
                                            name="socialMediaLinks.youtube"
                                            placeholder="Enter YouTube Url"
                                            value={formik.values.socialMediaLinks.youtube}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik?.touched?.socialMediaLinks?.youtube && Boolean(formik.errors.socialMediaLinks?.youtube)}
                                            helperText={formik?.touched?.socialMediaLinks?.youtube && formik.errors.socialMediaLinks?.youtube}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item sm={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Pinterest </InputLabel>
                                        <TextField
                                            id="socialMediaLinks.pinterest"
                                            name="socialMediaLinks.pinterest"
                                            placeholder="Enter Pinterest Url"
                                            value={formik.values.socialMediaLinks.pinterest}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik?.touched?.socialMediaLinks?.pinterest && Boolean(formik.errors.socialMediaLinks?.pinterest)}
                                            helperText={formik?.touched?.socialMediaLinks?.pinterest && formik.errors.socialMediaLinks?.pinterest}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                                        <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                                            Undo Changes
                                        </Button>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting && !formik.dirty}>
                                            Update Info
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
