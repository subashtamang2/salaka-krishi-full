"use client";

import { Button, Grid, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTermsAndConditions, termsAndConditions } from "api/static-page";
import dynamic from "next/dynamic";
const ReactQuillDemo = dynamic(() => import("components/ReactQuill"), { ssr: false });
import { useFormik } from "formik"
import { toast, ToastContainer } from "react-toastify";
import { DataWrapper, staticPageContent } from "schema/schema";

export default function page() {

    const mutation = useMutation({
        mutationFn: async (content: string) => {
            const res = await termsAndConditions(content);
            return res.data;
        }
    });
    const { data } = useQuery<DataWrapper<staticPageContent>>({
        queryKey: ['terms-and-conditions'],
        queryFn: async () => {
            const res = await getTermsAndConditions();
            return res.data;
        },
    });
    const queryClient = useQueryClient();
    const content = data?.data?.content || "";
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            content: content || ''
        },
        onSubmit: (values, { setSubmitting, resetForm }) => {
            console.log("EDITOR CONTENT:", values.content);
            setSubmitting(true);
            mutation.mutate(values.content, {
                onSuccess: (data) => {
                    resetForm();
                    queryClient.invalidateQueries({ queryKey: ['terms-and-conditions'] });
                    setSubmitting(false);
                    toast.success("Terms & Condition updated successfully");
                },
                onError: (error) => {
                    setSubmitting(false);
                    toast.error("Something went wrong!");
                }
            });
        }
    })
    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={12}>
                    <Typography variant="h1" mb={2} component="h2">
                        Terms & Condition
                    </Typography>
                    <form onSubmit={formik.handleSubmit} id="add-form">
                        <Grid container spacing={3.5}>
                            <Grid item xs={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <ReactQuillDemo value={formik.values.content} formik={formik} fieldName="content" editorMinHeight={700} />
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
                                        Add  Terms and Condition
                                    </Button>
                                </Stack>
                            </Grid>

                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}
