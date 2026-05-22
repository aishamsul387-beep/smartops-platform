import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type {
  CreateConversionGroupRequest,
  CreateConversionLineRequest,
  CreateUomRequest,
  UomConversionGroup,
  UomConversionGroupWithLines,
  UomConversionLine,
  UomFilters,
  UomRecord,
  UpdateConversionGroupRequest,
  UpdateConversionLineRequest,
  UpdateUomRequest
} from './types';

export const uomApi = {
  async getUoms(filters?: UomFilters): Promise<UomRecord[]> {
    const response = await apiClient.get<UomRecord[]>(ENDPOINTS.uom.list, {
      query: {
        search: filters?.search || '',
        type: filters?.type || 'all'
      }
    });

    return response.data || [];
  },

  async createUom(payload: CreateUomRequest): Promise<UomRecord> {
    const response = await apiClient.post<UomRecord>(ENDPOINTS.uom.create, payload);
    return response.data;
  },

  async updateUom(payload: UpdateUomRequest): Promise<UomRecord> {
    const response = await apiClient.put<UomRecord>(ENDPOINTS.uom.update(payload.id), {
      uomCode: payload.uomCode,
      uomName: payload.uomName,
      uomType: payload.uomType,
      decimalPlaces: payload.decimalPlaces,
      notes: payload.notes
    });

    return response.data;
  },

  async setUomActive(id: string, isActive: boolean): Promise<UomRecord> {
    const response = await apiClient.patch<UomRecord>(ENDPOINTS.uom.toggleActive(id), {
      isActive
    });

    return response.data;
  },

  async getConversionGroups(search?: string): Promise<UomConversionGroup[]> {
    const response = await apiClient.get<UomConversionGroup[]>(ENDPOINTS.uom.conversionGroups, {
      query: {
        search: search || ''
      }
    });

    return response.data || [];
  },

  async createConversionGroup(payload: CreateConversionGroupRequest): Promise<UomConversionGroup> {
    const response = await apiClient.post<UomConversionGroup>(
      ENDPOINTS.uom.conversionGroups,
      payload
    );

    return response.data;
  },

  async updateConversionGroup(payload: UpdateConversionGroupRequest): Promise<UomConversionGroup> {
    const response = await apiClient.put<UomConversionGroup>(
      ENDPOINTS.uom.updateConversionGroup(payload.id),
      payload
    );

    return response.data;
  },

  async setConversionGroupActive(id: string, isActive: boolean): Promise<UomConversionGroup> {
    const response = await apiClient.patch<UomConversionGroup>(
      ENDPOINTS.uom.toggleConversionGroupActive(id),
      { isActive }
    );

    return response.data;
  },

  async getConversionGroupLines(groupId: string): Promise<UomConversionGroupWithLines> {
    const response = await apiClient.get<{
      group: UomConversionGroup;
      lines: UomConversionLine[];
    }>(ENDPOINTS.uom.conversionGroupLines(groupId));

    return {
      group: response.data.group,
      lines: response.data.lines || []
    };
  },

  async createConversionLine(payload: CreateConversionLineRequest): Promise<UomConversionLine> {
    const response = await apiClient.post<UomConversionLine>(
      ENDPOINTS.uom.createConversionLine(payload.conversionGroupId),
      {
        fromUomCode: payload.fromUomCode,
        toUomCode: payload.toUomCode,
        multiplier: payload.multiplier,
        isBase: payload.isBase,
        roundingRule: payload.roundingRule
      }
    );

    return response.data;
  },

  async updateConversionLine(payload: UpdateConversionLineRequest): Promise<UomConversionLine> {
    const response = await apiClient.put<UomConversionLine>(
      ENDPOINTS.uom.updateConversionLine(payload.conversionGroupId, payload.id),
      {
        fromUomCode: payload.fromUomCode,
        toUomCode: payload.toUomCode,
        multiplier: payload.multiplier,
        isBase: payload.isBase,
        roundingRule: payload.roundingRule
      }
    );

    return response.data;
  },

  async setConversionLineActive(
    groupId: string,
    lineId: string,
    isActive: boolean
  ): Promise<UomConversionLine> {
    const response = await apiClient.patch<UomConversionLine>(
      ENDPOINTS.uom.toggleConversionLineActive(groupId, lineId),
      { isActive }
    );

    return response.data;
  }
};