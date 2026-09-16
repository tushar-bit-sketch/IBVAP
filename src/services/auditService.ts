import { apiClient } from './apiClient';
import { AuditLogEntry, Role } from '@/types';

export const auditService = {
  async getAuditLogs(filters?: { actor?: string; action?: string }): Promise<AuditLogEntry[]> {
    const data = await apiClient.get<{ total: number; entries: AuditLogEntry[] }>('/api/audit', filters);
    return data.entries;
  },

  async logAction(entry: {
    actor: string;
    role: Role;
    action: string;
    resource: string;
    details: string;
  }): Promise<AuditLogEntry> {
    return apiClient.post<AuditLogEntry>('/api/audit', entry);
  }
};
