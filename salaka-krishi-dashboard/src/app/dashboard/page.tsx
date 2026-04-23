'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'api/axios-interceptor';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import { Profile, Box as ProductIcon, ReceiptItem, DollarCircle } from '@wandersonalwes/iconsax-react';

// Components
import EcommerceDataCard from 'components/cards/EcommerceDataCard';

import OrderStatusPie from 'views/dashboard/OrderStatusPie';
import UserGrowthChart from 'views/dashboard/UserGrowthChart';
import BestSellingTable from 'views/dashboard/BestSellingTable';
import LowStockTable from 'views/dashboard/LowStockTable';
import LatestOrdersTable from 'views/dashboard/LatestOrdersTable';

export default function SummaryDashboard() {
  // Fetch Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/stats');
      return response.data.data;
    }
  });

  // Fetch Charts
  const { data: chartsData, isLoading: chartsLoading } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/charts');
      return response.data.data;
    }
  });

  // Fetch Recent Lists
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['dashboard-recent'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/recent');
      return response.data.data;
    }
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'users': return <Profile variant="Bulk" size={24} />;
      case 'products': return <ProductIcon variant="Bulk" size={24} />;
      case 'orders': return <ReceiptItem variant="Bulk" size={24} />;
      case 'revenue': return <DollarCircle variant="Bulk" size={24} />;
      default: return <Profile variant="Bulk" size={24} />;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* 1. TOP STATS CARDS */}
      <Grid size={12}>
        <Grid container spacing={3}>
          {statsLoading ? (
            [1, 2, 3, 4].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          ) : (
            statsData?.stats?.map((stat: any, index: number) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <EcommerceDataCard
                  title={stat.title}
                  count={stat.count}
                  icon={getIcon(stat.icon)}
                  color={stat.color}
                  isCurrency={stat.isCurrency}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Grid>



      {/* 3. ORDER STATUS & USER GROWTH */}
      <Grid size={{ xs: 12, md: 5 }}>
        {chartsLoading ? (
          <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
        ) : (
          <OrderStatusPie
            series={chartsData?.orderStatusPie?.series}
            labels={chartsData?.orderStatusPie?.labels}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        {chartsLoading ? (
          <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
        ) : (
          <UserGrowthChart
            series={chartsData?.userGrowth?.series}
            categories={chartsData?.userGrowth?.categories}
          />
        )}
      </Grid>

      {/* 4. OPERATIONAL TABLES */}
      <Grid size={{ xs: 12, lg: 4 }}>
        {recentLoading ? (
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        ) : (
          <BestSellingTable products={recentData?.bestSellers} />
        )}
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        {recentLoading ? (
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        ) : (
          <LowStockTable products={recentData?.lowStock} />
        )}
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        {recentLoading ? (
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        ) : (
          <LatestOrdersTable orders={recentData?.latestOrders} />
        )}
      </Grid>
    </Grid>
  );
}
