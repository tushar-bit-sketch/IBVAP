import { apiClient } from './apiClient';
import { Evidence } from '@/types';

export const evidenceService = {
  async getAllEvidence(filters?: { severity?: string; alertType?: string }): Promise<Evidence[]> {
    const data = await apiClient.get<{ total: number; evidence: Evidence[] }>('/api/evidence', filters);
    return data.evidence;
  },

  async getEvidenceById(id: string): Promise<Evidence> {
    return apiClient.get<Evidence>(`/api/evidence/${id}`);
  }
};
