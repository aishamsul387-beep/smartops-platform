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
  tasks: {
    list: '/tasks',
    detail: (id: string) => `/tasks/${id}`
  },
  orders: {
    quotations: '/orders/quotations',
    purchaseOrders: '/orders/purchase-orders',
    goodsReceivedNotes: '/orders/goods-received-notes',
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
