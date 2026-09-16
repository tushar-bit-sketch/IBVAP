import { apiClient } from './apiClient';
import { TrackedObject } from '@/types';

export const trackingService = {
  async getAllTracks(filters?: { status?: string; class?: string }): Promise<TrackedObject[]> {
    const data = await apiClient.get<{ count: number; tracks: TrackedObject[] }>('/api/tracks', filters);
    return data.tracks;
  },

  async getTrackById(id: string): Promise<TrackedObject> {
    return apiClient.get<TrackedObject>(`/api/tracks/${id}`);
  }
};
