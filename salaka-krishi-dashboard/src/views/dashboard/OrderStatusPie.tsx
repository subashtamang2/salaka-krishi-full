'use client';

import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
    series?: number[];
    labels?: string[];
}

export default function OrderStatusPie({ series = [], labels = [] }: Props) {
    const theme = useTheme();

    const colors = [
        theme.palette.warning.main,   // Pending
        theme.palette.success.main,   // Completed
        theme.palette.error.main,     // Cancelled
    ];

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: theme.typography.fontFamily,
            background: 'transparent',
        },
        labels,
        colors,
        stroke: {
            width: 3,
            colors: [theme.palette.background.paper]
        },
        fill: {
            opacity: 0.9,
        },
        legend: {
            position: 'bottom',
            fontSize: '13px',
            labels: { colors: theme.palette.text.primary },
            markers: { shape: 'circle' as const }
        },
        dataLabels: {
            enabled: true,
            dropShadow: { enabled: false },
            style: { fontSize: '13px', fontWeight: 600 },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '55%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Orders',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                            formatter: (w: { globals: { seriesTotals: number[] } }) =>
                                w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString()
                        },
                        value: {
                            fontSize: '22px',
                            fontWeight: 700,
                            color: theme.palette.text.primary
                        }
                    }
                }
            }
        },
        tooltip: {
            theme: theme.palette.mode,
        }
    };

    return (
        <MainCard title="Order Status" sx={{ height: '100%' }}>
            <ReactApexChart options={options} series={series} type="donut" height={420} />
        </MainCard>
    );
}
