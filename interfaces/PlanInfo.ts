export interface PlanInfo {
    plan: string;
    isCanceled: boolean;
    daysUntilExpiration: number | null;
    timeUntilExpiration: string | null;
    endDate: string | null;
}