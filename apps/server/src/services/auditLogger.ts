import { v4 as uuidv4 } from 'uuid';

export interface AuditLogEntry {
  id: string;
  actor: string; // e.g. "admin@autoupi" or "usr_auto_889210"
  action: string; // e.g. "KYC_APPROVAL", "RESERVE_LOCK", "CORRIDOR_TOGGLE", "AML_REVIEW"
  transactionId?: string;
  requestId?: string;
  result: 'SUCCESS' | 'FAILED' | 'REVERTED';
  metadata: Record<string, any>;
  timestamp: string;
}

export class AuditLoggerService {
  private logs: AuditLogEntry[] = [
    {
      id: 'aud_init_01',
      actor: 'system@autoupi',
      action: 'SYSTEM_BOOTSTRAP',
      result: 'SUCCESS',
      metadata: {
        chainId: 31337,
        contract: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        initialReserveUsd: 12500000,
      },
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'aud_init_02',
      actor: 'admin@autoupi',
      action: 'KYC_TIER_UPGRADE',
      result: 'SUCCESS',
      metadata: {
        userId: 'usr_auto_889210',
        newTier: 2,
        approvedDailyLimitUsd: 50000,
      },
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'aud_init_03',
      actor: 'settlement_engine',
      action: 'ATOMIC_SETTLEMENT_FINALITY',
      transactionId: 'tx_upi_992810',
      requestId: 'req_88921001',
      result: 'SUCCESS',
      metadata: {
        corridor: 'USD_INR',
        amount: 350,
        txHash: '0x3c91a8e104f2d7a984bc19d678e0293847f9810427acde84792bce9812401f82',
      },
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  ];

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const fullEntry: AuditLogEntry = {
      id: `aud_${uuidv4().substring(0, 8)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.logs.unshift(fullEntry);
    return fullEntry;
  }

  public logEvent(params: { action: string; userId: string; details: Record<string, any> }): AuditLogEntry {
    return this.log({
      actor: params.userId,
      action: params.action,
      result: 'SUCCESS',
      metadata: params.details,
    });
  }

  public getLogs(limit: number = 50, actionFilter?: string): AuditLogEntry[] {
    let result = this.logs;
    if (actionFilter) {
      result = result.filter((l) => l.action.toLowerCase().includes(actionFilter.toLowerCase()));
    }
    return result.slice(0, limit);
  }
}

export const auditLogger = new AuditLoggerService();
