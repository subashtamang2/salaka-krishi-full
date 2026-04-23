"use client";
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { DataWrapper } from 'schema/schema';
import Loading from '../loading';
import { getCategories } from 'api/category';
import { CategoryResponse } from 'schema/category';
import Category from 'components/cards/Category';
import { Grid } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Error404 from '../error';

export default function page() {
    const { data: CategoriesList, isLoading, isError } = useQuery<DataWrapper<CategoryResponse[]>>({
        queryKey: ['categories'],
        queryFn: async () => {
            const rest = await getCategories();
            return rest.data;
        }
    });
    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Category not found" />

    const categories = CategoriesList?.data || [];

    return (
        <>
            <Grid container spacing={2}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

                {categories?.map((category) => (
                    <Grid
                        item
                        xs={12}
                        md={3}
                        xl={3}
                        key={category.id}>
                        <Category category={category} />
                    </Grid>)
                )}
            </Grid>
        </>
    )
}
