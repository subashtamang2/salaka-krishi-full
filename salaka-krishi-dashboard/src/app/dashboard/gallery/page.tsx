"use client";
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { DataWrapper } from 'schema/schema';
import Loading from '../loading';
import { getGalleryImages } from 'api/gallery';
import { GalleryResponse } from 'schema/gallery';
import Gallery from 'components/cards/Gallery';
import { Grid } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Error404 from '../error';

export default function GalleryPage() {
    const { data: GalleryList, isLoading, isError } = useQuery<DataWrapper<GalleryResponse[]>>({
        queryKey: ['gallery'],
        queryFn: async () => {
            const rest = await getGalleryImages();
            return rest.data;
        }
    });

    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Gallery images not found" />

    const images = GalleryList?.data || [];

    return (
        <>
            <Grid container spacing={2}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

                {images?.length > 0 ? (
                    images.map((image) => (
                        <Grid
                            item
                            xs={12}
                            md={3}
                            xl={3}
                            key={image.id}>
                            <Gallery gallery={image} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <h3>No images found in gallery.</h3>
                        </div>
                    </Grid>
                )}
            </Grid>
        </>
    )
}
