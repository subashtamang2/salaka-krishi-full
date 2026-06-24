"use client";
import {
    Autocomplete,
    Button,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    Stack,
    TextField
} from "@mui/material";
import MainCard from "components/MainCard";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CalendarToday as Calendar } from "@mui/icons-material";
import { CreateProductSchema, ProductAvailability, ProductStatus } from "schema/product";
import { useEffect } from "react";
import slugify from "react-slugify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoryResponse } from "schema/category";
import { getCategories } from "api/category";
import MultiFileUpload from "components/dropzone/MultiFile";
import { Checkbox } from "@mui/material";
import AutocompleteCard from "components/Autocomplete";
import { uploadFiles } from "api/upload";
import { createProduct } from "api/product";
import { useRouter } from "next/navigation";


const validationSchema = yup.object({
    name: yup.string()
        .required("Name is required"),
    slug: yup.string()
        .lowercase()
        .required("Slug is required"),
    description: yup.string()
        .required("Description is required"),
    price: yup.number()
        .typeError("Price must be a number")
        // .positive("price must be positive")
        .min(0, "Price cannot be negative")
        .required("Price is required"),
    files: yup.array()
        .min(1, "At least one image is required"),
    rating: yup.number()
        .typeError("Rating must be a number")
        .min(0, "Rating cannot be negative")
        .max(5, "Rating cannot exceed 5"),
    availability: yup.string()
        .oneOf(Object.values(ProductAvailability), "Invalid availability status")
        .required("Availability is required"),
    isBlackFriday: yup.boolean()
        .optional(),
    isFeatured: yup.boolean()
        .optional(),

    status: yup.string()
        .oneOf(Object.values(ProductStatus), "Invalid product status")
        .required("Status is required"),
    stock: yup.number()
        .typeError("Sold must be a number")
        .integer("Sold must be an integer")
        .min(0, "Sold cannot be negative")
        .required("Sold count is required"),
    sold: yup.number()
        .typeError("Sold must be a number")
        .integer("Sold must be an integer")
        .min(0, "Sold cannot be negative")
        .required("Sold count is required"),
    estimatedDeliveryMinDays: yup.number()
        .typeError("Min days must be a number")
        .integer("Must be an integer")
        .min(0, "Cannot be negative")
        .required("Min delivery days is required"),
    estimatedDeliveryMaxDays: yup.number()
        .typeError("Max days must be a number")
        .integer("Must be an integer")
        .min(yup.ref('estimatedDeliveryMinDays'), "Max days must be greater than or equal to min days")
        .required("Max delivery days is required"),
    discountPercentage: yup.number()
        .typeError("Discount must be a number")
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100%")
        .optional(),
    discountStartDate: yup.date()
        .nullable()
        .optional(),
    discountEndDate: yup.date()
        .nullable()
        .optional(),
    tags: yup.array()
        .of(yup.string()
            .trim()
            .required("Tags cannot be empty"))
        .min(1, "At least one tag is required"),
    categoryId: yup.string()
        .uuid("Invalid category ID")
        .required("Category is required"),
});

export default function Page() {
    const router = useRouter();


    const { data: categoryList, isLoading: isCategoryLoading, error: categoryError } = useQuery<CategoryResponse[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await getCategories();
                return res?.data?.data || [];
            } catch (err) {
                return [];
            }
        },
    });
    const createProductMutation = useMutation({
        mutationFn: async (payload: CreateProductSchema) => {
            const res = await createProduct(payload);
            return res.data;
        },
    });
    const formik = useFormik({
        initialValues: {
            name: "",
            slug: "",
            description: "",
            price: 0.00,
            imageUrls: [],
            rating: 0,
            availability: ProductAvailability.IN_STOCK,
            isBlackFriday: false,
            isFeatured: false,

            stock: 0,
            sold: 0,
            estimatedDeliveryMinDays: 2,
            estimatedDeliveryMaxDays: 3,
            discountPercentage: 0,
            discountStartDate: null,
            discountEndDate: null,
            tags: [],
            categoryId: "",
            status: ProductStatus.ACTIVE,
            files: [],
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const {
                files,
                price,
                rating,
                sold,
                stock,
                discountPercentage,
                discountStartDate,
                discountEndDate,
                imageUrls: _,
                ...rest
            } = values;

            const uploadedImages = await uploadFiles(files, true);
            const productImages = uploadedImages?.map((file: any) => file?.filename) ?? [];

            const payload: CreateProductSchema = {
                ...rest,
                price: Number(price),
                rating: Number(rating),
                sold: Number(sold),
                stock: Number(stock),
                estimatedDeliveryMinDays: Number(rest.estimatedDeliveryMinDays),
                estimatedDeliveryMaxDays: Number(rest.estimatedDeliveryMaxDays),
                ...(discountPercentage > 0 ? { discountPercentage: Number(discountPercentage) } : {}),
                ...(discountStartDate ? { discountStartDate } : {}),
                ...(discountEndDate ? { discountEndDate } : {}),
                imageUrls: productImages,
            };
            createProductMutation.mutate(payload, {
                onSuccess: (data) => {
                    toast.success("Product added successfully!");
                    resetForm();
                    formik.setFieldValue("files", []);
                    setSubmitting(false);
                    setTimeout(() => {
                        router.push("/dashboard/product");
                    }, 500);
                },
                onError: (error: any) => {
                    toast.error(`Error adding product: ${error?.response?.data?.message || error.message}`);
                    console.error("Error creating product:", error);
                    setSubmitting(false);
                },
            });

        },
    });

    useEffect(() => {
        const generatedSlug = slugify(formik.values.name).toLowerCase();

        if (formik.values.slug !== generatedSlug) {
            formik.setFieldValue("slug", generatedSlug);
        }
    }, [formik.values.name]);

    if (isCategoryLoading) {
        return <div>Loading...</div>;
    }

    if (categoryError) {
        return <div>Error loading data.</div>;
    }

    const categoryOptions = categoryList?.map(({ name, id }) => ({ name, id })) ?? [];

    return (
        <>
            <Grid container spacing={1}>
                <Grid item lg={10}>
                    <MainCard title="Add New Product" sx={{ mb: 3 }}>
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
                                        <InputLabel>Slug</InputLabel>
                                        <TextField
                                            id="slug"
                                            name="slug"
                                            placeholder="Product Slug"
                                            value={formik.values.slug}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.slug && Boolean(formik.errors.slug)}
                                            helperText={formik.touched.slug && formik.errors.slug}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Select Category</InputLabel>
                                        <Autocomplete
                                            onBlur={formik.handleBlur}
                                            id="categoryId"
                                            value={categoryOptions?.find(option => option.id === formik.values.categoryId) || null}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue("categoryId", newValue ? newValue.id : "");
                                            }}
                                            options={categoryOptions || []}
                                            getOptionLabel={(option) => option.name}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select category"
                                                    sx={{ "& .MuiAutocomplete-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    {formik.touched.categoryId && formik.errors.categoryId && (
                                        <FormHelperText error id="helper-text-country">
                                            {formik.errors.categoryId}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Product Price</InputLabel>
                                        <TextField
                                            id="price"
                                            name="price"
                                            placeholder="Product Price"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.price && Boolean(formik.errors.price)}
                                            helperText={formik.touched.price && formik.errors.price}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Sold Quantity</InputLabel>
                                        <TextField
                                            id="sold"
                                            name="sold"
                                            placeholder="Sold Quantity"
                                            value={formik.values.sold}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.sold && Boolean(formik.errors.sold)}
                                            helperText={formik.touched.sold && formik.errors.sold}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Stock Quantity</InputLabel>
                                        <TextField
                                            id="stock"
                                            name="stock"
                                            placeholder="Stock Quantity"
                                            value={formik.values.stock}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                                            helperText={formik.touched.stock && formik.errors.stock}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Min Delivery Days</InputLabel>
                                        <TextField
                                            id="estimatedDeliveryMinDays"
                                            name="estimatedDeliveryMinDays"
                                            placeholder="Min Delivery Days"
                                            type="number"
                                            value={formik.values.estimatedDeliveryMinDays}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.estimatedDeliveryMinDays && Boolean(formik.errors.estimatedDeliveryMinDays)}
                                            helperText={formik.touched.estimatedDeliveryMinDays && formik.errors.estimatedDeliveryMinDays}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Max Delivery Days</InputLabel>
                                        <TextField
                                            id="estimatedDeliveryMaxDays"
                                            name="estimatedDeliveryMaxDays"
                                            placeholder="Max Delivery Days"
                                            type="number"
                                            value={formik.values.estimatedDeliveryMaxDays}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.estimatedDeliveryMaxDays && Boolean(formik.errors.estimatedDeliveryMaxDays)}
                                            helperText={formik.touched.estimatedDeliveryMaxDays && formik.errors.estimatedDeliveryMaxDays}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Product Availability</InputLabel>
                                        <Autocomplete
                                            onBlur={formik.handleBlur}
                                            id="availability"
                                            value={formik.values.availability}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue("availability", newValue);
                                            }}
                                            options={Object.entries(ProductAvailability).map(([key, value]) => value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select product availability"
                                                    sx={{ "& .MuiAutocomplete-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Rating</InputLabel>
                                        <TextField
                                            id="rating"
                                            name="rating"
                                            placeholder="Rating"
                                            value={formik.values.rating}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                                            helperText={formik.touched.rating && formik.errors.rating}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Discount Percentage</InputLabel>
                                        <TextField
                                            id="discountPercentage"
                                            name="discountPercentage"
                                            placeholder="Discount Percentage"
                                            value={formik.values.discountPercentage}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                                            helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Discount Start Date</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                value={formik.values.discountStartDate
                                                    ? new Date(formik.values.discountStartDate)
                                                    : null}
                                                onChange={(newValue) => {
                                                    formik.setFieldValue("discountStartDate", newValue ? newValue.toISOString() : null);
                                                }}
                                                minDateTime={new Date()}
                                                slots={{ openPickerIcon: Calendar }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: formik.touched.discountStartDate && Boolean(formik.errors.discountStartDate),
                                                        helperText: formik.touched.discountStartDate && formik.errors.discountStartDate,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Discount End Date</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                value={formik.values.discountEndDate
                                                    ? new Date(formik.values.discountEndDate)
                                                    : null}
                                                onChange={(newValue) => {
                                                    formik.setFieldValue("discountEndDate", newValue ? newValue.toISOString() : null);
                                                }}
                                                minDateTime={new Date(formik.values.discountStartDate || Date.now())}
                                                slots={{ openPickerIcon: Calendar }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: formik.touched.discountEndDate && Boolean(formik.errors.discountEndDate),
                                                        helperText: formik.touched.discountEndDate && formik.errors.discountEndDate,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            size="small"
                                            name="isFeatured" checked={formik.values.isFeatured}
                                            onChange={formik.handleChange} />}
                                        label="Featured Product" />
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            size="small"
                                            name="isBlackFriday" checked={formik.values.isBlackFriday}
                                            onChange={formik.handleChange} />}
                                        label="Black Friday Product" />
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Upload Product Images</InputLabel>
                                        <MultiFileUpload
                                            error={formik.touched.files && Boolean(formik.errors.files)}
                                            files={formik.values.files}
                                            showList={true}
                                            setFieldValue={formik.setFieldValue}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Product Description</InputLabel>
                                        <TextField
                                            id="description"
                                            name="description"
                                            placeholder="Product Description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                            multiline
                                            rows={4}
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Products Tags</InputLabel>
                                        <AutocompleteCard
                                            keywords={[]}
                                            formik={formik}
                                            fieldName="tags"
                                            placeholder="Enter Product Tags" />
                                    </Stack>
                                    {formik.touched.tags && formik.errors.tags && (
                                        <FormHelperText error id="helper-text-country">
                                            {formik.errors.tags}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack sx={{ gap: 1 }}>
                                        <InputLabel>Product Status</InputLabel>
                                        <Autocomplete
                                            onBlur={formik.handleBlur}
                                            id="status"
                                            value={formik.values.status}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue("status", newValue);
                                            }}
                                            options={Object.entries(ProductStatus).map(([key, value]) => value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select product status"
                                                    sx={{ "& .MuiAutocomplete-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } }}
                                                />
                                            )}
                                        />
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
                                            Add  Product
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
