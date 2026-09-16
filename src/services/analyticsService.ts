import { apiClient } from './apiClient';
import { AnalyticsDataPoint } from '@/types';

export const analyticsService = {
  async getRealtimeMetrics(): Promise<any> {
    return apiClient.get('/api/analytics/realtime');
  },

  async getHistoricalSeries(): Promise<{ interval: string; dataPoints: AnalyticsDataPoint[]; summary: any }> {
    return apiClient.get('/api/analytics/history');
  }
};
