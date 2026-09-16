import { apiClient } from './apiClient';
import { Camera } from '@/types';

export const cameraService = {
  async getAllCameras(filters?: { sector?: string; status?: string }): Promise<Camera[]> {
    const data = await apiClient.get<{ total: number; cameras: Camera[] }>('/api/cameras', filters);
    return data.cameras;
  },

  async getCameraById(id: string): Promise<Camera> {
    return apiClient.get<Camera>(`/api/cameras/${id}`);
  },

  async updateCamera(id: string, updates: Partial<Camera>): Promise<Camera> {
    return apiClient.patch<Camera>(`/api/cameras/${id}`, updates);
  },

  async testCameraStream(id: string): Promise<any> {
    return apiClient.post(`/api/cameras/${id}/test`);
  }
};
