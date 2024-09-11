import DashboardController from '@/app/controller/dashboard/DashboardController';

const dashboardController = new DashboardController();

export async function GET() {
  return dashboardController.getDashboardData();
}
