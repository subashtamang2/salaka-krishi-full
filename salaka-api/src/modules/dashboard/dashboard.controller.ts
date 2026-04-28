import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { ROLE } from "@prisma/client";
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE.Admin, ROLE.SuperAdmin)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getStats() {
        const data = await this.dashboardService.getStats();
        return {
            message: 'Dashboard stats fetched successfully',
            data,
        };
    }

    @Get('charts')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get dashboard chart data' })
    async getCharts() {
        const data = await this.dashboardService.getChartData();
        return {
            message: 'Dashboard chart data fetched successfully',
            data,
        };
    }

    @Get('recent')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get dashboard recent data lists' })
    async getRecent() {
        const data = await this.dashboardService.getRecentData();
        return {
            message: 'Dashboard recent data fetched successfully',
            data,
        };
    }
}
