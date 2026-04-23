"use client";
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { DataWrapper } from 'schema/schema';
import Loading from '../loading';
import Error500 from '../error';
import { Grid } from '@mui/material';
import { getCoupons } from 'api/coupon';
import { CouponSchema } from 'schema/coupon';
import CouponCard from 'components/cards/Coupon';
import { ToastContainer } from 'react-toastify';

export default function page() {
    const { data: couponList, isLoading, isError } = useQuery<DataWrapper<CouponSchema[]>>({
        queryKey: ['coupons'],
        queryFn: async () => {
            const rest = await getCoupons();
            return rest.data;
        }
    });
    if (isLoading) return <Loading />
    if (isError) return <Error500 title='Coupon not found' />

    const coupons = couponList?.data || [];
    return (
        <>
            <Grid container spacing={2}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

                {coupons?.map((coupon) => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        xl={4}
                        key={coupon.id}>
                        <CouponCard coupon={coupon} />
                    </Grid>)
                )}

            </Grid>
        </>
    )
}
