import { apiClient } from './apiClient';
import { Zone } from '@/types';

export const zoneService = {
  async getAllZones(filters?: { cameraId?: string; type?: string }): Promise<Zone[]> {
    const data = await apiClient.get<{ total: number; zones: Zone[] }>('/api/zones', filters);
    return data.zones;
  },

  async createZone(zone: Partial<Zone>): Promise<Zone> {
    return apiClient.post<Zone>('/api/zones', zone);
  },

  async updateZone(id: string, updates: Partial<Zone>): Promise<any> {
    return apiClient.patch(`/api/zones/${id}`, updates);
  },

  async deleteZone(id: string): Promise<any> {
    return apiClient.delete(`/api/zones/${id}`);
  }
};
