"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Stack,
    Typography,
    Avatar,
    IconButton,
    Tooltip,
    Box,
    TextField,
    MenuItem,
    InputAdornment,
    Grid,
} from "@mui/material";
import { Edit, Trash, SearchNormal1 } from "@wandersonalwes/iconsax-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductsByQuery, deleteProduct } from "api/product";
import { getCategories } from "api/category";
import MainCard from "components/MainCard";
import Loading from "../loading";
import Error404 from "../error";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useConfirm } from "components/ConfirmDialog";

function getAvailabilityColor(status: string): "success" | "error" | "warning" | "default" {
    switch (status) {
        case "InStock": return "success";
        case "OutOfStock": return "error";
        case "PreOrder": return "warning";
        default: return "default";
    }
}

function getStatusColor(status: string): "success" | "error" | "default" {
    switch (status) {
        case "Active": return "success";
        case "Inactive": return "error";
        default: return "default";
    }
}

export default function ProductsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Filter state
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const handleSearchChange = (value: string) => {
        setSearch(value);
        clearTimeout((window as any).__productSearchTimeout);
        (window as any).__productSearchTimeout = setTimeout(() => {
            setDebouncedSearch(value);
            setPage(0);
        }, 400);
    };

    // Build query params
    const queryParams: any = {
        page: page + 1,
        limit: rowsPerPage,
    };
    if (debouncedSearch) queryParams.search = debouncedSearch;
    if (categoryFilter) queryParams.categories = categoryFilter;
    if (statusFilter) queryParams.status = statusFilter;
    if (availabilityFilter) queryParams.availability = availabilityFilter;

    // Fetch products
    const { data: productsRes, isLoading, isError } = useQuery({
        queryKey: ["products", queryParams],
        queryFn: async () => {
            const res = await getProductsByQuery(queryParams);
            return res.data;
        },
    });

    // Fetch categories for filter dropdown
    const { data: categoriesRes } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await getCategories();
            return res.data;
        },
    });

    const confirm = useConfirm();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteProduct(id);
            return res.data;
        },
    });

    const handleDelete = async (id: string, name: string) => {
        const ok = await confirm({
            title: "Delete Product",
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            confirmText: "Delete",
            variant: "danger",
        });
        if (!ok) return;

        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                toast.success("Product deleted successfully");
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Failed to delete product";
                toast.error(message);
            },
        });
    };

    if (isLoading) return <Loading />;
    if (isError) return <Error404 title="Products not found" />;

    const responseData = productsRes?.data || productsRes || {};
    const products = responseData?.products || responseData || [];
    const totalCount = responseData?.totalCount ?? products.length ?? 0;
    const categories = categoriesRes?.data || categoriesRes || [];

    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads`;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <MainCard title="Products" content={false}>
                {/* Filters */}
                <Box sx={{ p: 2, pb: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchNormal1 size={18} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Category"
                                value={categoryFilter}
                                onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map((cat: any) => (
                                    <MenuItem key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6} sm={2.5} md={3}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                            >
                                <MenuItem value="">All Status</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6} sm={2.5} md={3}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Availability"
                                value={availabilityFilter}
                                onChange={(e) => { setAvailabilityFilter(e.target.value); setPage(0); }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="InStock">In Stock</MenuItem>
                                <MenuItem value="OutOfStock">Out of Stock</MenuItem>
                                <MenuItem value="PreOrder">Pre Order</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Box>

                {/* Table */}
                <TableContainer>
                    <Table sx={{ minWidth: 1000 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>SN</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="center">Stock</TableCell>
                                <TableCell align="center">Sold</TableCell>
                                <TableCell align="center">Availability</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        <Typography variant="body2" color="text.secondary" py={4}>
                                            No products found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {products.map((product: any, index: number) => {
                                const imgSrc = product.imageUrls?.[0]
                                    ? product.imageUrls[0].startsWith("http")
                                        ? product.imageUrls[0]
                                        : `${baseUrl}/${product.imageUrls[0]}`
                                    : undefined;

                                return (
                                    <TableRow hover key={product.id}>
                                        <TableCell>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={imgSrc}
                                                variant="rounded"
                                                sx={{ width: 48, height: 48 }}
                                            >
                                                {product.name?.[0]}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Stack>
                                                <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                                                    {product.name}
                                                </Typography>
                                                {product.discountPercentage ? (
                                                    <Typography variant="caption" color="success.main" fontWeight={600}>
                                                        {product.discountPercentage}% OFF
                                                    </Typography>
                                                ) : null}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.category?.name || "—"}
                                                size="small"
                                                variant="combined"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight={600}>
                                                Rs. {product.price?.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={product.stock}
                                                size="small"
                                                variant="combined"
                                                color={product.stock <= 5 ? "error" : product.stock <= 20 ? "warning" : "success"}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {product.sold}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={product.availability}
                                                size="small"
                                                variant="combined"
                                                color={getAvailabilityColor(product.availability)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={product.status}
                                                size="small"
                                                variant="combined"
                                                color={getStatusColor(product.status)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" justifyContent="center" spacing={0.5}>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => router.push(`/dashboard/product/${product.id}`)}
                                                    >
                                                        <Edit size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        <Trash size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box sx={{ px: 2 }}>
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </Box>
            </MainCard>
        </>
    );
}
