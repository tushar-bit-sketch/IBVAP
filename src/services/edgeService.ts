import { apiClient } from './apiClient';
import { EdgeNodeTelemetry, BOPNode } from '@/types';

export const edgeService = {
  async getEdgeNodes(): Promise<EdgeNodeTelemetry[]> {
    const data = await apiClient.get<{ edgeNodes: EdgeNodeTelemetry[] }>('/api/edge-nodes');
    return data.edgeNodes;
  },

  async getBOPs(): Promise<BOPNode[]> {
    const data = await apiClient.get<{ total: number; bops: BOPNode[] }>('/api/bops');
    return data.bops;
  },

  async getBOPById(id: string): Promise<BOPNode> {
    return apiClient.get<BOPNode>(`/api/bops/${id}`);
  },

  async getSystemStatus(): Promise<any> {
    return apiClient.get('/api/system/status');
  }
};
