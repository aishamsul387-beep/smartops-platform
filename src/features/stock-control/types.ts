export type StockAlertType =
  | 'low_stock'
  | 'out_of_stock'
  | 'overstock'
  | 'expiring_soon'
  | 'expired_batch';

export type StockAlertSeverity = 'high' | 'medium' | 'low';
export type ReorderPriority = 'critical' | 'high' | 'medium' | 'low';

export interface StockControlSummary {
  totalItems: number;
  totalOnHandQty: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  expiringSoonBatches: number;
  expiredBatches: number;
  reorderCandidates: number;
  criticalReorderCount: number;
  highReorderCount: number;
  mediumReorderCount: number;
}

export interface StockControlAlert {
  id: string;
  alertType: StockAlertType;
  severity: StockAlertSeverity;
  referenceType: 'inventory' | 'batch';
  referenceId: string;
  title: string;
  message: string;
  itemCode?: string;
  batchNumber?: string;
  dueDate?: string | null;
}

export interface ReorderSuggestion {
  id: string;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentQty: number;
  reorderLevel: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  suggestedOrderQty: number;
  estimatedDailyUsage: number;
  estimatedDaysOfCover: number;
  priority: ReorderPriority;
  reason: string;
  preferredSupplierName: string;
  leadTimeDays: number;
  reorderByDate: string;
  riskNote: string;
}