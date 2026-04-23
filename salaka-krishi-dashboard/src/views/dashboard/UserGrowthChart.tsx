'use client';

import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
    series?: { name: string; data: number[] }[];
    categories?: string[];
}

export default function UserGrowthChart({ series = [], categories = [] }: Props) {
    const theme = useTheme();

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
            background: 'transparent',
            animations: {
                enabled: true,
                speed: 600,
            }
        },
        colors: [theme.palette.success.main],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.25,
                opacityFrom: 0.95,
                opacityTo: 0.85,
                stops: [0, 100]
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '45%',
                distributed: false,
            }
        },
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
                formatter: (val: number) => Math.round(val).toString()
            }
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 4,
            xaxis: { lines: { show: false } }
        },
        tooltip: {
            theme: theme.palette.mode,
        }
    };

    return (
        <MainCard title="User Growth (This Week)" sx={{ height: '100%' }}>
            <ReactApexChart options={options} series={series} type="bar" height={420} />
        </MainCard>
    );
}
