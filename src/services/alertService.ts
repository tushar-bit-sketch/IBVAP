import { apiClient } from './apiClient';
import { Alert } from '@/types';

export const alertService = {
  async getAllAlerts(filters?: { severity?: string; status?: string; cameraId?: string }): Promise<Alert[]> {
    const data = await apiClient.get<{ total: number; alerts: Alert[] }>('/api/alerts', filters);
    return data.alerts;
  },

  async getAlertById(id: string): Promise<Alert> {
    return apiClient.get<Alert>(`/api/alerts/${id}`);
  },

  async acknowledgeAlert(id: string): Promise<{ success: boolean; alert: Alert }> {
    return apiClient.post(`/api/alerts/${id}/acknowledge`);
  },

  async resolveAlert(id: string, notes?: string, falsePositive?: boolean): Promise<{ success: boolean; alert: Alert }> {
    return apiClient.post(`/api/alerts/${id}/resolve`, { resolutionNotes: notes, falsePositive });
  },

  async triggerBreachAlert(payload?: Partial<Alert>): Promise<Alert> {
    return apiClient.post<Alert>('/api/alerts', payload);
  }
};
