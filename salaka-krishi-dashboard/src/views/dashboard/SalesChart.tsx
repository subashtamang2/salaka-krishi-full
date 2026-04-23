'use client';

import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
    series?: { name: string; data: number[] }[];
    categories?: string[];
}

export default function SalesChart({ series = [], categories = [] }: Props) {
    const theme = useTheme();

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
            background: 'transparent',
            animations: {
                enabled: true,
                speed: 800,
                animateGradually: { enabled: true, delay: 150 },
                dynamicAnimation: { enabled: true, speed: 350 }
            }
        },
        colors: [theme.palette.primary.main],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        stroke: { curve: 'smooth', width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: Array(7).fill(theme.palette.text.secondary),
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: { colors: [theme.palette.text.secondary], fontSize: '12px' },
                formatter: (val: number) => `Rs. ${val.toLocaleString()}`
            }
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 4,
            xaxis: { lines: { show: false } }
        },
        tooltip: {
            theme: theme.palette.mode,
            y: { formatter: (val: number) => `Rs. ${val.toLocaleString()}` }
        },
        markers: {
            size: 4,
            colors: [theme.palette.background.paper],
            strokeColors: theme.palette.primary.main,
            strokeWidth: 2,
            hover: { size: 6 }
        }
    };

    return (
        <MainCard title="Weekly Sales Overview">
            <ReactApexChart options={options} series={series} type="area" height={420} />
        </MainCard>
    );
}
