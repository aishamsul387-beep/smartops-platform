export type StockAlertType =
  | 'low_stock'
  | 'out_of_stock'
  | 'overstock'
  | 'expiring_soon'
  | 'expired_batch';

export type StockAlertSeverity = 'high' | 'medium' | 'low';
export type ReorderPriority = 'critical' | 'high' | 'medium' | 'low';
export type DemandTrend = 'rising' | 'stable' | 'falling';
export type ProcurementAction = 'order_now' | 'order_this_week' | 'monitor';
export type ProcurementQueueStatus = 'immediate' | 'this_week' | 'monitor';
export type SupplierSource = 'inventory_master' | 'batch_history' | 'unassigned';

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
  risingDemandItems: number;
  stableDemandItems: number;
  fallingDemandItems: number;
  procurementDueToday: number;
  procurementDueThisWeek: number;
  plannedProcurementValue: number;
  urgentProcurementValue: number;
  planningCurrency: string;
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
  itemType: string;
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
  supplierSource: SupplierSource;
  supplierScore: number;
  leadTimeDays: number;
  reorderByDate: string;
  riskNote: string;
  demandTrend: DemandTrend;
  monthlyUsageEstimate: number;
  forecastDemand30d: number;
  forecastDemand60d: number;
  forecastDemand90d: number;
  procurementAction: ProcurementAction;
  standardCost: number;
  currency: string;
  estimatedReorderValue: number;
}

export interface ProcurementQueueItem {
  id: string;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  itemType: string;
  preferredSupplierName: string;
  supplierSource: SupplierSource;
  suggestedOrderQty: number;
  reorderByDate: string;
  leadTimeDays: number;
  priority: ReorderPriority;
  supplierScore: number;
  procurementAction: ProcurementAction;
  queueStatus: ProcurementQueueStatus;
  riskNote: string;
  standardCost: number;
  currency: string;
  estimatedOrderValue: number;
}

export interface DraftPurchaseOrderResult {
  purchaseOrder: {
    id: string;
    poNo: string;
    supplierName: string;
    itemCount: number;
    totalAmount: number;
    currency: string;
    status: string;
    expectedDate: string;
    createdAt: string;
  };
  sourceSuggestion: {
    inventoryItemId: string;
    itemCode: string;
    itemName: string;
    suggestedOrderQty: number;
    estimatedReorderValue: number;
    preferredSupplierName: string;
    supplierSource: SupplierSource;
    standardCost: number;
    currency: string;
    reorderByDate: string;
  };
}