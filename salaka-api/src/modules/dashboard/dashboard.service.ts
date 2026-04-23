import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [userCount, productCount, orderCount, revenueResult] = await Promise.all([
      this.prisma.user.count({ where: { role: 'User' } }),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true }
      })
    ]);

    const revenue = revenueResult._sum.total || 0;

    return {
      totalUsers: userCount,
      totalProducts: productCount,
      totalOrders: orderCount,
      revenue,
      stats: [
        { title: 'Total Users', count: userCount, icon: 'users', color: 'primary' },
        { title: 'Total Products', count: productCount, icon: 'products', color: 'success' },
        { title: 'Total Orders', count: orderCount, icon: 'orders', color: 'warning' },
        { title: 'Total Revenue', count: revenue, icon: 'revenue', color: 'error', isCurrency: true },
      ]
    };
  }

  async getChartData() {
    // Current week starting from Sunday
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    const [userGrowthData, salesData, statusCounts] = await Promise.all([
      Promise.all(weekDays.map(async (date) => {
        if (date > today) return 0;
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        return this.prisma.user.count({
          where: { createdAt: { gte: date, lt: nextDate }, role: 'User' }
        });
      })),
      Promise.all(weekDays.map(async (date) => {
        if (date > today) return 0;
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        const result = await this.prisma.order.aggregate({
          where: { createdAt: { gte: date, lt: nextDate } },
          _sum: { total: true }
        });
        return result._sum.total || 0;
      })),
      Promise.all([
        this.prisma.order.count({ where: { orderStatus: 'Pending' } }),
        this.prisma.order.count({ where: { orderStatus: 'Delivered' } }),
        this.prisma.order.count({ where: { orderStatus: 'Cancelled' } })
      ])
    ]);

    const categories = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return {
      salesLine: {
        series: [{ name: 'Sales', data: salesData }],
        categories: categories,
      },
      orderStatusPie: {
        series: statusCounts,
        labels: ['Pending', 'Completed', 'Cancelled'],
      },
      userGrowth: {
        series: [{ name: 'New Users', data: userGrowthData }],
        categories: categories,
      }
    };
  }

  async getRecentData() {
    const [lowStock, bestSellers, latestOrders] = await Promise.all([
      this.prisma.product.findMany({
        where: { stock: { lte: 20 } },
        take: 5,
        orderBy: { stock: 'asc' },
        select: { id: true, name: true, stock: true, price: true, imageUrls: true }
      }),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { sold: 'desc' },
        select: { id: true, name: true, sold: true, price: true, imageUrls: true }
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          orderNumber: true,
          fullName: true,
          orderStatus: true,
          total: true,
          createdAt: true
        }
      })
    ]);

    return {
      lowStock,
      bestSellers,
      latestOrders: latestOrders.map(o => ({
        id: o.orderNumber,
        customer: o.fullName,
        status: o.orderStatus,
        total: o.total,
        createdAt: o.createdAt
      })),
    };
  }
}
