export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh'
  },
  dashboard: {
    summary: '/dashboard/summary'
  },
  inventory: {
    list: '/inventory',
    detail: (id: string) => `/inventory/${id}`,
    create: '/inventory',
    update: (id: string) => `/inventory/${id}`,
    toggleActive: (id: string) => `/inventory/${id}/active`
  },
  batches: {
    list: '/batches',
    detail: (id: string) => `/batches/${id}`,
    create: '/batches'
  },
  stockControl: {
    summary: '/stock-control/summary',
    alerts: '/stock-control/alerts',
    reorderSuggestions: '/stock-control/reorder-suggestions',
    procurementActions: '/stock-control/procurement-actions',
    createDraftPurchaseOrderFromSuggestion: (inventoryItemId: string) =>
      `/stock-control/reorder-suggestions/${inventoryItemId}/create-po-draft`,
    movements: '/stock-control/movements',
    movementsByInventory: (inventoryItemId: string) =>
      `/stock-control/movements/inventory/${inventoryItemId}`,
    movementsByBatch: (batchId: string) => `/stock-control/movements/batch/${batchId}`,
    issuePreview: '/stock-control/issue-preview',
    createIssue: '/stock-control/issues'
  },
  warehouse: {
    summary: '/warehouse/summary',
    locations: '/warehouse/locations',
    locationDetail: (id: string) => `/warehouse/locations/${id}`,
    createLocation: '/warehouse/locations',
    updateLocation: (id: string) => `/warehouse/locations/${id}`,
    toggleLocationActive: (id: string) => `/warehouse/locations/${id}/active`,
    importCsv: '/warehouse/locations/import-csv',
    exportCsv: '/warehouse/locations/export-csv'
  },
  tasks: {
    list: '/tasks',
    detail: (id: string) => `/tasks/${id}`,
    updateStatus: (id: string) => `/tasks/${id}/status`
  },
  orders: {
    summary: '/orders/summary',
    quotations: '/orders/quotations',
    purchaseOrders: '/orders/purchase-orders',
    purchaseOrderDetail: (id: string) => `/orders/purchase-orders/${id}`,
    createPurchaseOrder: '/orders/purchase-orders',
    issuePurchaseOrder: (id: string) => `/orders/purchase-orders/${id}/issue`,
    goodsReceivedNotes: '/orders/goods-received-notes',
    goodsReceivedNoteDetail: (id: string) => `/orders/goods-received-notes/${id}`,
    createGoodsReceivedNote: '/orders/goods-received-notes',
    supplierInvoices: '/orders/supplier-invoices',
    supplierCreditNotes: '/orders/supplier-credit-notes',
    returns: '/orders/returns'
  },
  uom: {
    list: '/uom',
    create: '/uom',
    update: (id: string) => `/uom/${id}`,
    toggleActive: (id: string) => `/uom/${id}/active`,
    conversionGroups: '/uom/conversion-groups',
    updateConversionGroup: (id: string) => `/uom/conversion-groups/${id}`,
    toggleConversionGroupActive: (id: string) => `/uom/conversion-groups/${id}/active`,
    conversionGroupLines: (id: string) => `/uom/conversion-groups/${id}/lines`,
    createConversionLine: (groupId: string) => `/uom/conversion-groups/${groupId}/lines`,
    updateConversionLine: (groupId: string, lineId: string) =>
      `/uom/conversion-groups/${groupId}/lines/${lineId}`,
    toggleConversionLineActive: (groupId: string, lineId: string) =>
      `/uom/conversion-groups/${groupId}/lines/${lineId}/active`
  },
  reports: {
    list: '/reports'
  },
  ai: {
    chat: '/ai/chat'
  }
} as const;