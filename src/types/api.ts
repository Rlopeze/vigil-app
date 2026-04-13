export interface DashboardStats {
  windowDays: number;
  sessionCount: number;
  eventCount: number;
  byType: Array<{ type: string; count: number }>;
}
