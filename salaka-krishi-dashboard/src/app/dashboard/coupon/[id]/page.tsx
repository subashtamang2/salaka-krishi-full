"use client";
import {
    Autocomplete,
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
import * as yup from "yup";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CalendarToday as Calendar } from "@mui/icons-material";
import { CouponSchema, CouponType, CreateCoupon } from "schema/coupon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCouponById, updateCoupon } from "api/coupon";
import { useParams, useRouter } from "next/navigation";
import { DataWrapper } from "schema/schema";
import Loading from "app/dashboard/loading";
import Error404 from "app/dashboard/error";



const validationSchema = yup.object({
    code: yup.string()
        .required("code is Required")
        .matches(/^[A-Z0-9_-]+$/, "Use only uppercase letters, numbers, - or _")
        .max(20, "Max 20 characters"),
    discount: yup.number()
        .typeError("Discount must be a number")
        .positive("Must be greater than 0")
        .required("Discount is required"),
    expiryDate: yup.date()
        .typeError("Invalid date")
        .required("Expiry date is required"),
    startDate: yup.date()
        .typeError("Invalid date")
        .required("Start date is required"),
    minPurchaseAmount: yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .required("Minimum purchase amount is required"),
    maxDiscountAmount: yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .required("Max discount amount is required"),
    maxUsageLimit: yup.number()
        .typeError("Must be a number")
        .integer("Must be an integer").min(1, "At least 1 usage required").required("Max usage limit is required"),
    type: yup.string()
        .oneOf(Object.values(CouponType), "Type must be 'Percentage' or 'FixedAmount'")
        .required("Type is required"),
});

export default function Page() {
    const router = useRouter();
    const { id: paramsId } = useParams<{ id: string }>();

    const couponMutation = useMutation({
        mutationKey: ['update-coupon'],
        mutationFn: async (couponData: CreateCoupon) => {
            const res = await updateCoupon(paramsId, couponData);
            return res.data;
        },
    });

    const { data: couponRes, isError, isLoading } = useQuery<DataWrapper<CouponSchema>>({
        queryKey: ['edit-coupon', paramsId],
        enabled: !!paramsId,
        queryFn: async () => {
            const res = await getCouponById(paramsId);
            return res.data;
        },
    });
    const coupon = couponRes?.data;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            code: coupon?.code || "",
            type: coupon?.type || CouponType.Percentage,
            discount: coupon?.discount || 0,
            startDate: coupon?.startDate || null,
            expiryDate: coupon?.expiryDate || null,
            minPurchaseAmount: coupon?.minPurchaseAmount || "",
            maxDiscountAmount: coupon?.maxDiscountAmount || "",
            maxUsageLimit: coupon?.maxUsageLimit || "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { discount, minPurchaseAmount, maxDiscountAmount, maxUsageLimit, ...rest } = values;


            const payload = {
                ...rest,
                discount: Number(discount),
                minPurchaseAmount: Number(minPurchaseAmount),
                maxDiscountAmount: Number(maxDiscountAmount),
                maxUsageLimit: Number(maxUsageLimit)
            };
            couponMutation.mutate(payload, {
                onSuccess: (data) => {
                    toast.success("Coupon updated successfully");
                    resetForm();
                    setSubmitting(false);
                    setTimeout(() => {
                        router.push("/dashboard/coupon");
                    }, 800);
                },
                onError: (error) => {
                    toast.error("Error updating coupon");
                    console.error("Error updating coupon:", error);
                    setSubmitting(false);
                },
            });
        },
    });
    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Coupon not found" />

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={7}>
                    <MainCard title="Update Coupon" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit} id="update-form">
                            <Grid container spacing={3.5}>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Code</InputLabel>
                                        <TextField
                                            id="code"
                                            name="code"
                                            placeholder="COUPON2025"
                                            value={formik.values.code}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.code && Boolean(formik.errors.code)}
                                            helperText={formik.touched.code && formik.errors.code}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Type</InputLabel>
                                        <Autocomplete
                                            onBlur={formik.handleBlur}
                                            id="type"
                                            value={formik.values.type}
                                            options={Object.entries(CouponType).map(([key, value]) => value)}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue("type", newValue || "");
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select Type"
                                                    sx={{ "& .MuiAutocomplete-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } }}
                                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                                    helperText={formik.touched.type && formik.errors.type}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    {formik.touched.type && formik.errors.type && (
                                        <FormHelperText error id="helper-text-country">
                                            {formik.errors.type}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Discount</InputLabel>
                                        <TextField
                                            id="discount"
                                            name="discount"
                                            placeholder="Discount"
                                            value={formik.values.discount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.discount && Boolean(formik.errors.discount)}
                                            helperText={formik.touched.discount && formik.errors.discount}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Start Date</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                value={formik.values.startDate
                                                    ? new Date(formik.values.startDate)
                                                    : null}
                                                onChange={(newValue) => {
                                                    formik.setFieldValue("startDate", newValue);
                                                }}
                                                minDateTime={new Date(formik.values?.startDate || Date.now())}
                                                slots={{ openPickerIcon: Calendar }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                                                        helperText: formik.touched.startDate && formik.errors.startDate,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Expiry Date</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                value={formik.values.expiryDate
                                                    ? new Date(formik.values.expiryDate)
                                                    : null}
                                                onChange={(newValue) => {
                                                    formik.setFieldValue("expiryDate", newValue);
                                                }}
                                                minDateTime={new Date(formik.values?.startDate || Date.now())}
                                                slots={{ openPickerIcon: Calendar }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: formik.touched.expiryDate && Boolean(formik.errors.expiryDate),
                                                        helperText: formik.touched.expiryDate && formik.errors.expiryDate,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Min Purchase Amount</InputLabel>
                                        <TextField
                                            id="minPurchaseAmount"
                                            name="minPurchaseAmount"
                                            placeholder="Min Purchase Amount"
                                            value={formik.values.minPurchaseAmount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.minPurchaseAmount && Boolean(formik.errors.minPurchaseAmount)}
                                            helperText={formik.touched.minPurchaseAmount && formik.errors.minPurchaseAmount}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Max Discount Amount</InputLabel>
                                        <TextField
                                            id="maxDiscountAmount"
                                            name="maxDiscountAmount"
                                            placeholder="Max Discount Amount"
                                            value={formik.values.maxDiscountAmount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.maxDiscountAmount && Boolean(formik.errors.maxDiscountAmount)}
                                            helperText={formik.touched.maxDiscountAmount && formik.errors.maxDiscountAmount}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Max Usage Limit</InputLabel>
                                        <TextField
                                            id="maxUsageLimit"
                                            name="maxUsageLimit"
                                            placeholder="Max UsageLimit"
                                            value={formik.values.maxUsageLimit}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.maxUsageLimit && Boolean(formik.errors.maxUsageLimit)}
                                            helperText={formik.touched.maxUsageLimit && formik.errors.maxUsageLimit}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "flex-end" }}>
                                        <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                                            Undo Changes
                                        </Button>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting || !formik.dirty}>
                                            Update Coupon
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
