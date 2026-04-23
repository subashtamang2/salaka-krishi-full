"use client";
import { useQuery } from '@tanstack/react-query';
import { DataWrapper } from 'schema/schema';
import Loading from '../loading';
import { Grid } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Error404 from '../error';
import BannerCard from 'components/cards/Banner';
import { MainBannerInterface } from 'schema/main-banner';
import { getMainBanner } from 'api/main-banner';


export default function page() {
    const { data: bannerList, isLoading, isError } = useQuery<DataWrapper<MainBannerInterface[]>>({
        queryKey: ['banners'],
        queryFn: async () => {
            const rest = await getMainBanner();
            return rest.data;
        }
    });
    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Banner not found" />

    const banners = bannerList?.data || [];
    return (
        <>
            <Grid container spacing={2}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

                {banners?.map((banner) => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        xl={3}
                        key={banner.id}>
                        <BannerCard banner={banner} />
                    </Grid>)
                )}
            </Grid>
        </>
    )
}
