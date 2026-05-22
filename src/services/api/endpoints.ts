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
    update: (id: string) => `/inventory/${id}`
  },
  warehouse: {
    summary: '/warehouse/summary',
    locations: '/warehouse/locations'
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
    goodsReceivedNotes: '/orders/goods-received-notes',
    goodsReceivedNoteDetail: (id: string) => `/orders/goods-received-notes/${id}`,
    createGoodsReceivedNote: '/orders/goods-received-notes',
    supplierInvoices: '/orders/supplier-invoices',
    supplierCreditNotes: '/orders/supplier-credit-notes',
    returns: '/orders/returns'
  },
  reports: {
    list: '/reports'
  },
  ai: {
    chat: '/ai/chat'
  }
} as const;