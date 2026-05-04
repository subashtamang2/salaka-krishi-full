"use client";

import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
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
import { OfferBannerInterface, UpdateOfferBannerSchema } from "schema/offer-banner";
import { getSingleOfferBanner, updateOfferBanner } from "api/offer-banner";
import { getProducts, getFilteredProducts, getProductsByQuery } from "api/product";
import { DataWrapper } from "schema/schema";
import { ProductSchema } from "schema/product";
import Loading from "../../loading";
import Error404 from "../../error";

interface UploadFile extends File {
    preview?: string;
}

const BANNER_TAGS = ["BlackFriday", "BestSelling", "LimitedStock", "NewArrival"];

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
    startDate: yup.date().nullable(),
    endDate: yup.date().nullable(),
});

export default function EditOfferBannerPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const { data: bannerRes, isLoading: bannerLoading, isError: bannerError } = useQuery<DataWrapper<OfferBannerInterface>>({
        queryKey: ['offer-banner', id],
        queryFn: async () => {
            const rest = await getSingleOfferBanner(id);
            return rest.data;
        },
        enabled: !!id
    });

    const updateBannerMutate = useMutation({
        mutationFn: async (bannerData: UpdateOfferBannerSchema) => {
            return updateOfferBanner(id, bannerData);
        },
    });

    const banner = bannerRes?.data;
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
    
    // Preparation for image preview
    const initialFile: UploadFile | null = banner?.imageUrl
        ? Object.assign({
            preview: `${imageBaseUrl}/${banner.imageUrl}`,
        })
        : null;

    const formik = useFormik<UpdateOfferBannerSchema & { file?: UploadFile | null }>({
        enableReinitialize: true,
        initialValues: {
            title: banner?.title || "",
            slug: banner?.slug || "",
            subtitle: banner?.subtitle || "",
            description: banner?.description || "",
            tag: banner?.tag || "",
            imageUrl: banner?.imageUrl || "",
            productId: banner?.productId || "",
            startDate: banner?.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : "",
            endDate: banner?.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : "",
            isActive: banner?.isActive ?? true,
            file: initialFile || null,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
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
                let { imageUrl } = finalValues;
                
                if (!imageUrl && restValues.imageUrl) {
                    imageUrl = restValues.imageUrl;
                }

                if (!imageUrl) {
                    toast.error("Banner image is required");
                    setSubmitting(false);
                    return;
                }

                const data: UpdateOfferBannerSchema = {
                    ...restValues,
                    imageUrl,
                    tag: restValues.tag || undefined,
                    productId: restValues.productId || undefined,
                    startDate: restValues.startDate || undefined,
                    endDate: restValues.endDate || undefined,
                };

                updateBannerMutate.mutate(data, {
                    onSuccess: () => {
                        toast.success("Offer Banner updated successfully!");
                        setSubmitting(false);
                        setTimeout(() => {
                            router.push("/dashboard/offer-banner");
                        }, 500);
                    },
                    onError: (error) => {
                        toast.error("Error updating offer banner!");
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

    if (bannerLoading) return <Loading />;
    if (bannerError) return <Error404 title="Banner not found" />;

    return (
        <>
            <Grid container spacing={1}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                <Grid item lg={8} xs={12}>
                    <MainCard title="Edit Offer Banner" sx={{ mb: 3 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Title</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="title"
                                            name="title"
                                            placeholder="Banner Title"
                                            value={formik.values.title}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                formik.setFieldValue("slug", generateSlug(e.target.value));
                                            }}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Slug</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="slug"
                                            name="slug"
                                            placeholder="banner-slug"
                                            value={formik.values.slug}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.slug && Boolean(formik.errors.slug)}
                                            helperText={formik.touched.slug && formik.errors.slug}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel>Subtitle</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="subtitle"
                                            name="subtitle"
                                            placeholder="Banner Subtitle"
                                            value={formik.values.subtitle}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel>Description</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="description"
                                            name="description"
                                            placeholder="Banner Description"
                                            multiline
                                            rows={3}
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Tag</InputLabel>
                                        <FormControl fullWidth>
                                            <Select
                                                id="tag"
                                                name="tag"
                                                displayEmpty
                                                value={formik.values.tag}
                                                onChange={formik.handleChange}
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                {BANNER_TAGS.map((tag) => (
                                                    <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Associated Product</InputLabel>
                                        <Autocomplete
                                            options={products}
                                            getOptionLabel={(option) => option.name || ""}
                                            value={products.find(p => p.id === formik.values.productId) || null}
                                            onChange={(_, val) => {
                                                formik.setFieldValue("productId", val?.id || "");
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder="Select Product" />
                                            )}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>Start Date</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.startDate}
                                            onChange={formik.handleChange}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel>End Date</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.endDate}
                                            onChange={formik.handleChange}
                                        />
                                    </Stack>
                                </Grid>


                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel>Banner Image</InputLabel>
                                        <UploadSingleFile
                                            setFieldValue={formik.setFieldValue}
                                            file={formik.values.file!}
                                            error={formik.touched.file && Boolean(formik.errors.file)}
                                        />
                                        {formik.touched.file && formik.errors.file && (
                                            <FormHelperText error>{formik.errors.file}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="isActive"
                                                name="isActive"
                                                checked={formik.values.isActive}
                                                onChange={formik.handleChange}
                                            />
                                        }
                                        label="Active"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => router.push("/dashboard/offer-banner")}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={formik.isSubmitting}
                                        >
                                            Update Banner
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
