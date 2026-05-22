export type UomType = 'quantity' | 'weight' | 'volume' | 'length' | 'pack';
export type UomRoundingRule = 'none' | 'round_up' | 'round_down' | 'round_nearest';

export interface UomRecord {
  id: string;
  uomCode: string;
  uomName: string;
  uomType: UomType;
  decimalPlaces: number;
  isActive: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface UomConversionGroup {
  id: string;
  groupCode: string;
  groupName: string;
  description: string;
  isActive: boolean;
}

export interface UomConversionLine {
  id: string;
  conversionGroupId: string;
  fromUomCode: string;
  toUomCode: string;
  multiplier: number;
  isBase: boolean;
  roundingRule: UomRoundingRule;
  isActive: boolean;
}

export interface UomConversionGroupWithLines {
  group: UomConversionGroup;
  lines: UomConversionLine[];
}

export interface UomFilters {
  search?: string;
  type?: UomType | 'all';
}

export interface CreateUomRequest {
  uomCode: string;
  uomName: string;
  uomType: UomType;
  decimalPlaces: number;
  notes: string;
}

export interface UpdateUomRequest extends CreateUomRequest {
  id: string;
}

export interface CreateConversionGroupRequest {
  groupCode: string;
  groupName: string;
  description: string;
}

export interface UpdateConversionGroupRequest extends CreateConversionGroupRequest {
  id: string;
}

export interface CreateConversionLineRequest {
  conversionGroupId: string;
  fromUomCode: string;
  toUomCode: string;
  multiplier: number;
  isBase: boolean;
  roundingRule: UomRoundingRule;
}

export interface UpdateConversionLineRequest extends CreateConversionLineRequest {
  id: string;
}

export interface UomFormValues {
  id?: string;
  uomCode: string;
  uomName: string;
  uomType: UomType;
  decimalPlaces: string;
  notes: string;
}

export interface UomFormErrors {
  uomCode?: string;
  uomName?: string;
  uomType?: string;
  decimalPlaces?: string;
}

export interface ConversionGroupFormValues {
  id?: string;
  groupCode: string;
  groupName: string;
  description: string;
}

export interface ConversionGroupFormErrors {
  groupCode?: string;
  groupName?: string;
}

export interface ConversionLineFormValues {
  id?: string;
  conversionGroupId: string;
  fromUomCode: string;
  toUomCode: string;
  multiplier: string;
  isBase: boolean;
  roundingRule: UomRoundingRule;
}

export interface ConversionLineFormErrors {
  fromUomCode?: string;
  toUomCode?: string;
  multiplier?: string;
  roundingRule?: string;
}