export const ROUTES = {
  home: '/',
  login: '/login',
  unauthorized: '/unauthorized',
  dashboard: '/dashboard',

  inventory: '/inventory',
  inventoryCreate: '/inventory/create',
  inventoryTransfers: '/inventory/transfers',
  batches: '/batches',
  stockControl: '/stock-control',

  warehouse: '/warehouse',
  warehouseLocations: '/warehouse/locations',
  warehouseTasks: '/warehouse/tasks',

  orders: '/orders',
  quotations: '/orders/quotations',

  purchaseOrders: '/orders/purchase-orders',
  purchaseOrdersCreate: '/orders/purchase-orders/create',
  purchaseOrderDetail: (id: string) => `/orders/purchase-orders/${id}`,

  goodsReceivedNotes: '/orders/goods-received-notes',
  goodsReceivedNotesCreate: '/orders/goods-received-notes/create',
  goodsReceivedNoteDetail: (id: string) => `/orders/goods-received-notes/${id}`,

  supplierInvoices: '/orders/supplier-invoices',
  supplierCreditNotes: '/orders/supplier-credit-notes',
  returns: '/orders/returns',

  reports: '/reports',
  aiAssistant: '/ai-assistant',
  uom: '/uom'
} as const;
