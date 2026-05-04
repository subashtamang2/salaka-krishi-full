"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Avatar,
    Tooltip,
    Chip,
    Box
} from "@mui/material";
import {
    Edit,
    Trash,
    DocumentText,
} from "@wandersonalwes/iconsax-react";
import { DataWrapper } from "schema/schema";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "components/Loader";
import Error404 from "../error";
import { getBlogs, deleteBlog } from "api/blog";
import { BlogInterface } from "schema/blog";
import { useConfirm } from "components/ConfirmDialog";
import { format } from "date-fns";

export default function BlogsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const { data: blogList, isLoading, isError } = useQuery<DataWrapper<BlogInterface[]>>({
        queryKey: ['blogs'],
        queryFn: async () => {
            const rest = await getBlogs();
            return rest.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteBlog(id);
        },
        onSuccess: () => {
            toast.success("Blog post deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: () => {
            toast.error("Failed to delete blog post");
        }
    });

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: "Delete Blog Post",
            message: "Are you sure you want to delete this blog? This action will remove the post permanently.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (ok) {
            deleteMutation.mutate(id);
        }
    };

    const blogs = blogList?.data || [];

    if (isLoading) return <Loader />;
    if (isError) return <Error404 title="Blog posts not found" />;

    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    return (
        <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Box>
                    <Typography variant="h3" fontWeight={700}>Blog Management</Typography>
                    <Typography variant="body2" color="textSecondary">Create, edit, and manage your articles and news</Typography>
                </Box>

            </Stack>

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Post Details</TableCell>
                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Date Created</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.length > 0 ? (
                            blogs.map((blog) => {
                                let imgSrc = undefined;
                                if (blog.imageUrl) {
                                    if (blog.imageUrl.startsWith("http")) {
                                        imgSrc = blog.imageUrl;
                                    } else {
                                        const cleanBaseUrl = baseUrl?.endsWith("/uploads") ? baseUrl : `${baseUrl}/uploads`;
                                        imgSrc = `${cleanBaseUrl}/${blog.imageUrl}`;
                                    }
                                }

                                return (
                                <TableRow key={blog.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                src={imgSrc}
                                                variant="rounded"
                                                alt={blog.title}
                                                sx={{ width: 48, height: 48, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.100' }}
                                            >
                                                <DocumentText size="20" />
                                            </Avatar>
                                            <Stack spacing={0.25}>
                                                <Typography variant="subtitle1" fontWeight={600} sx={{
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {blog.title}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {blog.slug}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={blog.isPublished ? "Published" : "Draft"}
                                            color={blog.isPublished ? "success" : "default"}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                bgcolor: blog.isPublished ? 'success.lighter' : 'grey.100',
                                                color: blog.isPublished ? 'success.dark' : 'text.secondary',
                                                border: '1px solid',
                                                borderColor: blog.isPublished ? 'success.light' : 'grey.300',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="textSecondary">
                                            {blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                            <Tooltip title="Edit Post">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => router.push(`/dashboard/blog/${blog.id}`)}
                                                >
                                                    <Edit size="18" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Post">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDelete(blog.id)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash size="18" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )})
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                    <Stack alignItems="center" spacing={1}>
                                        <Typography variant="h5" color="textSecondary">No blog posts found</Typography>
                                        <Typography variant="body2" color="textSecondary">Start by creating your first article</Typography>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
