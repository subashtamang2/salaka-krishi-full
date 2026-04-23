"use client";
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    FormHelperText,
    Grid,
    InputLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSingleFaq, updateFaq } from "api/faq";
import Error404 from "app/dashboard/error";
import Loading from "app/dashboard/loading";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { FaqCategory, FaqSchema, UpdateFaqSchema } from "schema/faq";
import { DataWrapper } from "schema/schema";
import * as yup from "yup";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const validationSchema = yup.object({
    question: yup.string().required("Question is required"),
    slug: yup.string().required("Slug is required").lowercase(),
    answer: yup.string().required("Answer is required"),
    category: yup
        .string()
        .oneOf(Object.values(FaqCategory), "Invalid category")
        .required("Category is required"),
});

const categoryColors: Record<
    string,
    "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
    Shipping: "success",
    Order: "primary",
    Returns: "error",
    Products: "secondary",
};

export default function Page() {
    const router = useRouter();
    const { id: paramsId } = useParams<{ id: string }>();

    const { data: faqRes, isError, isLoading } = useQuery<DataWrapper<FaqSchema>>({
        queryKey: ["edit-faq", paramsId],
        enabled: !!paramsId,
        queryFn: async () => {
            const res = await getSingleFaq(paramsId);
            return res.data;
        },
    });

    const Faq = faqRes?.data;

    const UpdateFaqMutation = useMutation({
        mutationFn: async (payload: UpdateFaqSchema) => {
            const res = await updateFaq(paramsId!, payload);
            return res?.data;
        },
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            question: Faq?.question || "",
            slug: Faq?.slug || "",
            answer: Faq?.answer || "",
            category: Faq?.category || FaqCategory.SHIPPING,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const { slug: _, ...rest } = values;
            UpdateFaqMutation.mutate(rest, {
                onSuccess: () => {
                    toast.success("FAQ updated successfully!");
                    setSubmitting(false);
                    setTimeout(() => {
                        router.push("/dashboard/faq");
                    }, 500);
                },
                onError: (error: any) => {
                    toast.error(
                        `Error updating FAQ: ${error?.response?.data?.message || error.message}`
                    );
                    setSubmitting(false);
                },
            });
        },
    });

    if (isLoading) return <Loading />;
    if (isError) return <Error404 title="FAQ not found" />;

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <Grid container spacing={3}>
                {/* Page Header */}
                <Grid item xs={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "warning.lighter",
                                }}
                            >
                                <HelpOutlineIcon sx={{ color: "warning.main", fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700}>
                                    Edit FAQ
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Update the question and answer below
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push("/dashboard/faq")}
                            sx={{ borderRadius: 2, textTransform: "none" }}
                        >
                            Back to FAQs
                        </Button>
                    </Stack>
                </Grid>

                {/* Form */}
                <Grid item xs={12} lg={8}>
                    <MainCard title="Edit FAQ Details">
                        <form onSubmit={formik.handleSubmit} id="edit-faq-form">
                            <Grid container spacing={3}>
                                {/* Question */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="question" required>
                                            Question
                                        </InputLabel>
                                        <TextField
                                            id="question"
                                            name="question"
                                            placeholder="e.g. How do I track my order?"
                                            value={formik.values.question}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.question && Boolean(formik.errors.question)}
                                            helperText={formik.touched.question && formik.errors.question}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                {/* Slug (disabled on edit) */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="slug">
                                            Slug{" "}
                                            <Typography component="span" variant="caption" color="text.disabled">
                                                (cannot be changed)
                                            </Typography>
                                        </InputLabel>
                                        <TextField
                                            id="slug"
                                            name="slug"
                                            value={formik.values.slug}
                                            disabled
                                            fullWidth
                                            InputProps={{
                                                sx: {
                                                    fontFamily: "monospace",
                                                    fontSize: "0.875rem",
                                                    letterSpacing: "0.02em",
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Grid>

                                {/* Category */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="category" required>
                                            Category
                                        </InputLabel>
                                        <Autocomplete
                                            id="category"
                                            value={formik.values.category}
                                            onChange={(_, newValue) => {
                                                formik.setFieldValue("category", newValue);
                                            }}
                                            onBlur={formik.handleBlur}
                                            options={Object.values(FaqCategory)}
                                            renderOption={(props, option) => (
                                                <Box component="li" {...props}>
                                                    <Chip
                                                        label={option}
                                                        size="small"
                                                        color={categoryColors[option] ?? "default"}
                                                        variant="combined"
                                                        sx={{ fontSize: "0.7rem" }}
                                                    />
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select a category"
                                                    error={formik.touched.category && Boolean(formik.errors.category)}
                                                />
                                            )}
                                        />
                                        {formik.touched.category && formik.errors.category && (
                                            <FormHelperText error>{formik.errors.category}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {/* Category preview */}
                                {formik.values.category && (
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel>Preview</InputLabel>
                                            <Box
                                                sx={{
                                                    height: 56,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 2,
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    borderRadius: 1.5,
                                                    bgcolor: "action.hover",
                                                }}
                                            >
                                                <Chip
                                                    label={formik.values.category}
                                                    color={categoryColors[formik.values.category] ?? "default"}
                                                    variant="combined"
                                                    sx={{ fontWeight: 700 }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Grid>
                                )}

                                {/* Answer */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="answer" required>
                                            Answer
                                        </InputLabel>
                                        <TextField
                                            id="answer"
                                            name="answer"
                                            placeholder="Provide a clear and helpful answer…"
                                            value={formik.values.answer}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.answer && Boolean(formik.errors.answer)}
                                            helperText={formik.touched.answer && formik.errors.answer}
                                            multiline
                                            rows={6}
                                            fullWidth
                                        />
                                        <Typography variant="caption" color="text.disabled" textAlign="right">
                                            {formik.values.answer.length} characters
                                        </Typography>
                                    </Stack>
                                </Grid>

                                {/* Actions */}
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => formik.resetForm()}
                                            disabled={!formik.dirty}
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                        >
                                            Undo Changes
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            type="submit"
                                            disabled={formik.isSubmitting || !formik.dirty}
                                            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                                        >
                                            {formik.isSubmitting ? "Saving…" : "Update FAQ"}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </MainCard>
                </Grid>

                {/* Info Sidebar */}
                <Grid item xs={12} lg={4}>
                    <MainCard title="Current FAQ Info">
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="caption" color="text.disabled" fontWeight={600}>
                                    ORIGINAL QUESTION
                                </Typography>
                                <Typography variant="body2" mt={0.5} fontWeight={500}>
                                    {Faq?.question || "—"}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.disabled" fontWeight={600}>
                                    CATEGORY
                                </Typography>
                                <Box mt={0.5}>
                                    {Faq?.category ? (
                                        <Chip
                                            label={Faq.category}
                                            color={categoryColors[Faq.category] ?? "default"}
                                            size="small"
                                            variant="combined"
                                        />
                                    ) : (
                                        <Typography variant="body2">—</Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.disabled" fontWeight={600}>
                                    SLUG
                                </Typography>
                                <Typography
                                    variant="body2"
                                    mt={0.5}
                                    sx={{ fontFamily: "monospace", color: "text.secondary" }}
                                >
                                    {Faq?.slug || "—"}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.disabled" fontWeight={600}>
                                    LAST UPDATED
                                </Typography>
                                <Typography variant="body2" mt={0.5}>
                                    {Faq?.updatedAt
                                        ? new Date(Faq.updatedAt).toLocaleString()
                                        : "—"}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.disabled" fontWeight={600}>
                                    CREATED AT
                                </Typography>
                                <Typography variant="body2" mt={0.5}>
                                    {Faq?.createdAt
                                        ? new Date(Faq.createdAt).toLocaleString()
                                        : "—"}
                                </Typography>
                            </Box>
                        </Stack>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    );
}
