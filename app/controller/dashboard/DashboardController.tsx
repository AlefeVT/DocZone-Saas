import DashboardService from '@/app/service/dashboard/DashboardService';
import { NextResponse } from 'next/server';

export default class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getDashboardData() {
    try {
      const data = await this.dashboardService.getDashboardInfo();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return NextResponse.json(
        { error: 'Error fetching dashboard data' },
        { status: 500 }
      );
    }
  }
}
