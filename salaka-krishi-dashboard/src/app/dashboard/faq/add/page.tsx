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
import { useMutation } from "@tanstack/react-query";
import { createFaq } from "api/faq";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import slugify from "react-slugify";
import { toast, ToastContainer } from "react-toastify";
import { CreateFaqSchema, FaqCategory } from "schema/faq";
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

    const createFaqMutation = useMutation({
        mutationFn: async (payload: CreateFaqSchema) => {
            const res = await createFaq(payload);
            return res?.data;
        },
    });

    const formik = useFormik({
        initialValues: {
            question: "",
            slug: "",
            answer: "",
            category: FaqCategory.SHIPPING,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            createFaqMutation.mutate(values, {
                onSuccess: () => {
                    toast.success("FAQ added successfully!");
                    resetForm();
                    setSubmitting(false);
                    setTimeout(() => {
                        router.push("/dashboard/faq");
                    }, 500);
                },
                onError: (error: any) => {
                    toast.error(
                        `Error adding FAQ: ${error?.response?.data?.message || error.message}`
                    );
                    setSubmitting(false);
                },
            });
        },
    });

    useEffect(() => {
        const generatedSlug = slugify(formik.values.question).toLowerCase();
        if (formik.values.slug !== generatedSlug) {
            formik.setFieldValue("slug", generatedSlug);
        }
    }, [formik.values.question]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <Grid container spacing={3}>

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
                                    bgcolor: "primary.lighter",
                                }}
                            >
                                <HelpOutlineIcon sx={{ color: "primary.main", fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700}>
                                    Add New FAQ
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Fill in the details below to add a new question
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


                <Grid item xs={12} lg={8}>
                    <MainCard title="FAQ Details">
                        <form onSubmit={formik.handleSubmit} id="add-faq-form">
                            <Grid container spacing={3}>

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


                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="slug">
                                            Slug{" "}
                                            <Typography component="span" variant="caption" color="text.disabled">
                                                (auto-generated)
                                            </Typography>
                                        </InputLabel>
                                        <TextField
                                            id="slug"
                                            name="slug"
                                            placeholder="faq-slug"
                                            value={formik.values.slug}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.slug && Boolean(formik.errors.slug)}
                                            helperText={formik.touched.slug && formik.errors.slug}
                                            fullWidth
                                            InputProps={{
                                                sx: {
                                                    fontFamily: "monospace",
                                                    fontSize: "0.875rem",
                                                    letterSpacing: "0.02em",
                                                    bgcolor: "action.hover",
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Grid>


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
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Chip
                                                            label={option}
                                                            size="small"
                                                            color={categoryColors[option] ?? "default"}
                                                            variant="combined"
                                                            sx={{ fontSize: "0.7rem" }}
                                                        />
                                                    </Stack>
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
                                            Add  Faq
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
