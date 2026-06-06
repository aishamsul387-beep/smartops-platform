import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import {
  mapWarehouseLocation,
  mapWarehouseLocationListResponse,
  mapWarehouseUtilizationDrilldown,
  mapWarehouseUtilizationSummary
} from './mapper';
import type {
  CreateWarehouseLocationRequest,
  UpdateWarehouseLocationRequest,
  WarehouseLocationImportResult,
  WarehouseLocationListFilters,
  WarehouseSiteListResponse,
  WarehouseSiteRecord,
  WarehouseSiteScope,
  WarehouseUtilizationDrilldown
} from './types';

export interface WarehouseSummaryFilters {
  search?: string;
  locationCode?: string;
  status?: WarehouseLocationListFilters['status'];
  type?: WarehouseLocationListFilters['type'];
  active?: WarehouseLocationListFilters['active'];
  siteScope?: WarehouseSiteScope;
  warehouseCode?: string;
}

const WAREHOUSE_DRILLDOWN_ENDPOINT = '/warehouse/drilldown';

function buildWarehouseSummaryUrl(filters: WarehouseSummaryFilters = {}) {
  const query = new URLSearchParams();

  if (filters.search && filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters.locationCode && filters.locationCode.trim()) {
    query.set('locationCode', filters.locationCode.trim());
  }

  if (filters.status && filters.status !== 'all') {
    query.set('status', filters.status);
  }

  if (filters.type && filters.type !== 'all') {
    query.set('type', filters.type);
  }

  if (filters.active && filters.active !== 'all') {
    query.set('active', filters.active);
  }

  if (filters.siteScope && filters.siteScope !== 'all') {
    query.set('siteScope', filters.siteScope);
  }

  if (filters.warehouseCode && filters.warehouseCode.trim()) {
    query.set('warehouseCode', filters.warehouseCode.trim());
  }

  const queryString = query.toString();
  return queryString ? `${ENDPOINTS.warehouse.summary}?${queryString}` : ENDPOINTS.warehouse.summary;
}

function buildWarehouseDrilldownUrl(filters: WarehouseSummaryFilters = {}) {
  const query = new URLSearchParams();

  if (filters.search && filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters.locationCode && filters.locationCode.trim()) {
    query.set('locationCode', filters.locationCode.trim());
  }

  if (filters.status && filters.status !== 'all') {
    query.set('status', filters.status);
  }

  if (filters.type && filters.type !== 'all') {
    query.set('type', filters.type);
  }

  if (filters.active && filters.active !== 'all') {
    query.set('active', filters.active);
  }

  if (filters.siteScope && filters.siteScope !== 'all') {
    query.set('siteScope', filters.siteScope);
  }

  if (filters.warehouseCode && filters.warehouseCode.trim()) {
    query.set('warehouseCode', filters.warehouseCode.trim());
  }

  const queryString = query.toString();
  return queryString ? `${WAREHOUSE_DRILLDOWN_ENDPOINT}?${queryString}` : WAREHOUSE_DRILLDOWN_ENDPOINT;
}

function buildWarehouseLocationListUrl(filters: WarehouseLocationListFilters = {}) {
  const query = new URLSearchParams();

  if (filters.search && filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters.warehouseCode && filters.warehouseCode.trim()) {
    query.set('warehouseCode', filters.warehouseCode.trim());
  }

  if (filters.siteScope && filters.siteScope !== 'all') {
    query.set('siteScope', filters.siteScope);
  }

  if (filters.locationCode && filters.locationCode.trim()) {
    query.set('locationCode', filters.locationCode.trim());
  }

  if (filters.status && filters.status !== 'all') {
    query.set('status', filters.status);
  }

  if (filters.type && filters.type !== 'all') {
    query.set('type', filters.type);
  }

  if (filters.active && filters.active !== 'all') {
    query.set('active', filters.active);
  }

  const queryString = query.toString();
  return queryString ? `${ENDPOINTS.warehouse.locations}?${queryString}` : ENDPOINTS.warehouse.locations;
}

function mapWarehouseSiteListResponse(data: any): WarehouseSiteListResponse {
  const payload = data?.data ?? data ?? {};
  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  const items: WarehouseSiteRecord[] = rawItems.map((item: any) => ({
    siteCode: String(item?.siteCode ?? '').trim(),
    siteName: String(item?.siteName ?? '').trim(),
    siteType: item?.siteType === 'outlet' ? 'outlet' : 'warehouse'
  }));

  const total = Number.isFinite(Number(payload.total)) ? Number(payload.total) : items.length;

  return {
    items,
    total
  };
}

export const warehouseApi = {
  async getSites() {
    const response = await apiClient.get<any>('/warehouse/sites');
    return mapWarehouseSiteListResponse(response.data);
  },

  async getSummary(filters: WarehouseSummaryFilters = {}) {
    const response = await apiClient.get<any>(buildWarehouseSummaryUrl(filters));
    return mapWarehouseUtilizationSummary(response.data);
  },

  async getDrilldown(filters: WarehouseSummaryFilters = {}): Promise<WarehouseUtilizationDrilldown> {
    const response = await apiClient.get<any>(buildWarehouseDrilldownUrl(filters));
    return mapWarehouseUtilizationDrilldown(response.data);
  },

  async getLocations(filters: WarehouseLocationListFilters = {}) {
    const response = await apiClient.get<any>(buildWarehouseLocationListUrl(filters));
    return mapWarehouseLocationListResponse(response.data);
  },

  async getLocationById(id: string) {
    const response = await apiClient.get<any>(ENDPOINTS.warehouse.locationDetail(id));
    return mapWarehouseLocation(response.data);
  },

  async createLocation(payload: CreateWarehouseLocationRequest) {
    const response = await apiClient.post<any>(ENDPOINTS.warehouse.createLocation, payload);
    return mapWarehouseLocation(response.data);
  },

  async updateLocation(id: string, payload: Omit<UpdateWarehouseLocationRequest, 'id'>) {
    const response = await apiClient.put<any>(ENDPOINTS.warehouse.updateLocation(id), payload);
    return mapWarehouseLocation(response.data);
  },

  async toggleLocationActive(id: string, isActive: boolean) {
    const response = await apiClient.patch<any>(ENDPOINTS.warehouse.toggleLocationActive(id), {
      isActive
    });
    return mapWarehouseLocation(response.data);
  },

  async importLocationsCsv(csvText: string): Promise<WarehouseLocationImportResult> {
    const response = await apiClient.post<any>(ENDPOINTS.warehouse.importCsv, {
      csvText
    });

    return response.data?.data ?? response.data;
  },

  async exportLocationsCsv(): Promise<string> {
    const response = await apiClient.get<any>(ENDPOINTS.warehouse.exportCsv);
    return typeof response.data === 'string' ? response.data : String(response.data ?? '');
  }
};
