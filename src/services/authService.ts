import { Role, Permission, UserSession } from '@/types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'VIEW_CAMERA', 'CONTROL_CAMERA', 'VIEW_ALERT', 'ACK_ALERT', 'RESOLVE_ALERT',
    'MANAGE_ZONES', 'VIEW_EVIDENCE', 'EXPORT_EVIDENCE', 'MANAGE_USERS', 'VIEW_AUDIT', 'MANAGE_SYSTEM'
  ],
  COMMANDER: [
    'VIEW_CAMERA', 'CONTROL_CAMERA', 'VIEW_ALERT', 'ACK_ALERT', 'RESOLVE_ALERT',
    'MANAGE_ZONES', 'VIEW_EVIDENCE', 'EXPORT_EVIDENCE', 'VIEW_AUDIT'
  ],
  OPERATOR: [
    'VIEW_CAMERA', 'CONTROL_CAMERA', 'VIEW_ALERT', 'ACK_ALERT',
    'MANAGE_ZONES', 'VIEW_EVIDENCE'
  ],
  ANALYST: [
    'VIEW_CAMERA', 'VIEW_ALERT', 'VIEW_EVIDENCE', 'EXPORT_EVIDENCE'
  ],
  AUDITOR: [
    'VIEW_CAMERA', 'VIEW_ALERT', 'VIEW_EVIDENCE', 'VIEW_AUDIT'
  ]
};

export const DEMO_USERS: Record<Role, UserSession> = {
  COMMANDER: {
    userId: 'usr-cmd-01',
    username: 'cmd_sharma',
    fullName: 'Col. Rajesh Sharma',
    role: 'COMMANDER',
    permissions: ROLE_PERMISSIONS.COMMANDER,
    callsign: 'VICTOR-ACTUAL',
    station: 'BOP-17 SECTOR HQ'
  },
  OPERATOR: {
    userId: 'usr-op-07',
    username: 'op_verma',
    fullName: 'Sub-Inspector Ankit Verma',
    role: 'OPERATOR',
    permissions: ROLE_PERMISSIONS.OPERATOR,
    callsign: 'OP-ALPHA-07',
    station: 'BOP-17 CONSOLE 01'
  },
  SUPER_ADMIN: {
    userId: 'usr-adm-00',
    username: 'admin_sys',
    fullName: 'Defense Tech Admin',
    role: 'SUPER_ADMIN',
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
    callsign: 'SYS-ROOT',
    station: 'CENTRAL DEFENSE DAEMON'
  },
  ANALYST: {
    userId: 'usr-ana-03',
    username: 'analyst_mehta',
    fullName: 'Intelligence Analyst Priya Mehta',
    role: 'ANALYST',
    permissions: ROLE_PERMISSIONS.ANALYST,
    callsign: 'INTEL-03',
    station: 'SECTOR INTEL CELL'
  },
  AUDITOR: {
    userId: 'usr-aud-09',
    username: 'auditor_kaur',
    fullName: 'Inspector Harpreet Kaur',
    role: 'AUDITOR',
    permissions: ROLE_PERMISSIONS.AUDITOR,
    callsign: 'AUDIT-LEAD',
    station: 'FORENSIC AUDIT WING'
  }
};

export const authService = {
  getCurrentSession(role: Role = 'OPERATOR'): UserSession {
    return DEMO_USERS[role] || DEMO_USERS.OPERATOR;
  },

  hasPermission(role: Role, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }
};
