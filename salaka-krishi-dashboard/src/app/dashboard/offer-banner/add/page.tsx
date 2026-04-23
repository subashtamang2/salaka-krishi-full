"use client";

import {
    Button,

    FormControl,

    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Autocomplete
} from "@mui/material";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import UploadSingleFile from "components/dropzone/SingleFile";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CalendarToday as Calendar } from "@mui/icons-material";
import { uploadFiles } from "api/upload";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CreateOfferBannerSchema } from "schema/offer-banner";
import { createOfferBanner } from "api/offer-banner";
import { getProducts, getFilteredProducts, getProductsByQuery } from "api/product";
import { DataWrapper } from "schema/schema";
import { ProductSchema } from "schema/product";

interface UploadFile extends File {
    preview?: string;
}

const BANNER_TAGS = ["BlackFriday", "BestSelling", "LimitedStock", "NewArrival"];

// Maps banner tags to backend PRODUCT_FILTER enum values
// BlackFriday uses the query endpoint (isBlackFriday flag) - no PRODUCT_FILTER enum key exists
const TAG_TO_FILTER_TYPE: Record<string, string | null> = {
    BlackFriday: null,           // handled via getProductsByQuery({ isBlackFriday: true })
    BestSelling: "best_selling",
    LimitedStock: "limited_stock",
    NewArrival: "new",
};

const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    slug: yup.string().required("Slug is required"),
    description: yup.string().optional(),
    tag: yup.string().oneOf(BANNER_TAGS, "Invalid tag").nullable(),
    startDate: yup.date().required("Start date is required").nullable(),
    endDate: yup
        .date()
        .min(yup.ref('startDate'), "End date cannot be before start date")
        .required("End date is required")
        .nullable(),
});

export default function Page() {
    const router = useRouter();

    const createBannerMutate = useMutation({
        mutationFn: async (bannerData: CreateOfferBannerSchema) => {
            return createOfferBanner(bannerData);
        },
    });

    const formik = useFormik<CreateOfferBannerSchema & { file?: UploadFile | null }>({
        initialValues: {
            title: "",
            slug: "",
            subtitle: "",
            description: "",
            tag: "",
            imageUrl: "",
            buttonLink: "",
            productId: "",
            startDate: null,
            endDate: null,
            isActive: true,
            file: null,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { file, ...restValues } = values;

            const processImages = async (imageFile: UploadFile | null) => {
                let imageUrl: string = "";
                if (imageFile && imageFile instanceof File) {
                    const res = await uploadFiles(imageFile);
                    imageUrl = res?.filename ?? "";
                }
                return { imageUrl };
            };

            processImages(file ?? null).then((finalValues) => {
                const { imageUrl } = finalValues;

                if (!imageUrl) {
                    toast.error("Banner image is required");
                    setSubmitting(false);
                    return;
                }

                const data: CreateOfferBannerSchema = {
                    ...restValues,
                    imageUrl,
                    tag: restValues.tag || undefined,
                    productId: restValues.productId || undefined,
                    startDate: restValues.startDate as string,
                    endDate: restValues.endDate as string,
                };

                createBannerMutate.mutate(data, {
                    onSuccess: () => {
                        toast.success("Offer Banner added successfully!");
                        resetForm();
                        setSubmitting(false);
                        setTimeout(() => {
                            router.push("/dashboard/offer-banner");
                        }, 500);
                    },
                    onError: (error) => {
                        toast.error("Error adding offer banner!");
                        console.error(error);
                        setSubmitting(false);
                    },
                });
            });
        },
    });

    const { data: productData } = useQuery<DataWrapper<any>>({
        queryKey: ['products', formik.values.tag],
        queryFn: async () => {
            const tag = formik.values.tag;

            if (tag) {
                // BlackFriday has no PRODUCT_FILTER enum — use query endpoint instead
                if (tag === "BlackFriday") {
                    const res = await getProductsByQuery({ isBlackFriday: true });
                    const data = res.data?.data;
                    const productsArray = data && typeof data === 'object' && 'products' in data
                        ? (data as any).products
                        : (Array.isArray(data) ? data : []);
                    return { message: res.data.message, data: productsArray };
                }

                const filterType = TAG_TO_FILTER_TYPE[tag];
                if (filterType) {
                    const res = await getFilteredProducts(filterType);
                    return {
                        message: res.data.message,
                        data: res.data.data || []
                    };
                }
            }

            const rest = await getProducts();
            return rest.data;
        }
    });

    const products = (productData?.data as ProductSchema[]) || [];

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    };

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} />
                <Grid item lg={8} xs={12}>
                    <MainCard title="Add Offer Banner" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3}>

                                {/* TITLE */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Title</InputLabel>
                                        <TextField
                                            name="title"
                                            value={formik.values.title}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                formik.setFieldValue("slug", generateSlug(e.target.value));
                                            }}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                {/* SLUG */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Slug</InputLabel>
                                        <TextField
                                            name="slug"
                                            value={formik.values.slug}
                                            onChange={formik.handleChange}
                                            error={formik.touched.slug && Boolean(formik.errors.slug)}
                                            helperText={formik.touched.slug && formik.errors.slug}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                {/* SUBTITLE */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Subtitle (Optional)</InputLabel>
                                        <TextField
                                            name="subtitle"
                                            value={formik.values.subtitle}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                {/* TAG */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Tag</InputLabel>
                                        <FormControl fullWidth>
                                            <Select
                                                name="tag"
                                                value={formik.values.tag}
                                                onChange={formik.handleChange}
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                {BANNER_TAGS.map(tag => (
                                                    <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Grid>

                                {/* ✅ UPDATED AUTOCOMPLETE */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Product</InputLabel>
                                        <Autocomplete
                                            options={products}
                                            getOptionLabel={(option) => option.name || ""}
                                            value={products.find(p => p.id === formik.values.productId) || null}
                                            onChange={(e, val) => {
                                                formik.setFieldValue("productId", val?.id || "");
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder="Select Product" />
                                            )}
                                        />
                                    </Stack>
                                </Grid>



                                {/* START DATE */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Start Date</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                value={formik.values.startDate
                                                    ? new Date(formik.values.startDate)
                                                    : null}
                                                onChange={(newValue) => {
                                                    formik.setFieldValue("startDate", newValue ? newValue.toISOString() : null);
                                                }}
                                                slots={{ openPickerIcon: Calendar }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                                                        helperText: formik.touched.startDate && formik.errors.startDate as string,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>

                                {/* END DATE */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>End Date</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                value={formik.values.endDate
                                                    ? new Date(formik.values.endDate)
                                                    : null}
                                                onChange={(newValue) => {
                                                    formik.setFieldValue("endDate", newValue ? newValue.toISOString() : null);
                                                }}
                                                minDateTime={formik.values.startDate ? new Date(formik.values.startDate) : undefined}
                                                slots={{ openPickerIcon: Calendar }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                                                        helperText: formik.touched.endDate && formik.errors.endDate as string,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>

                                {/* DESCRIPTION */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel>Description</InputLabel>
                                        <TextField
                                            name="description"
                                            multiline
                                            rows={3}
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>



                                {/* IMAGE */}
                                <Grid item xs={12}>
                                    <UploadSingleFile
                                        setFieldValue={formik.setFieldValue}
                                        file={formik.values.file!}
                                    />
                                </Grid>

                                {/* BUTTON LINK */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel>Button Link</InputLabel>
                                        <TextField
                                            name="buttonLink"
                                            placeholder="https://example.com"
                                            value={formik.values.buttonLink}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                {/* ACTION */}
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained">
                                        Add Banner
                                    </Button>
                                </Grid>

                            </Grid>
                        </form>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    );
}
