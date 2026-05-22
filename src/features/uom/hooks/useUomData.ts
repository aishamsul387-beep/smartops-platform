'use client';

import { useEffect, useMemo, useState } from 'react';
import { uomApi } from '../api';
import type {
  ConversionGroupFormErrors,
  ConversionGroupFormValues,
  ConversionLineFormErrors,
  ConversionLineFormValues,
  CreateConversionGroupRequest,
  CreateConversionLineRequest,
  CreateUomRequest,
  UomConversionGroupWithLines,
  UomFilters,
  UomFormErrors,
  UomFormValues,
  UomRecord,
  UpdateConversionGroupRequest,
  UpdateConversionLineRequest,
  UpdateUomRequest
} from '../types';

const initialFilters: UomFilters = {
  search: '',
  type: 'all'
};

export const initialUomFormValues: UomFormValues = {
  uomCode: '',
  uomName: '',
  uomType: 'quantity',
  decimalPlaces: '0',
  notes: ''
};

export const initialConversionGroupFormValues: ConversionGroupFormValues = {
  groupCode: '',
  groupName: '',
  description: ''
};

export const initialConversionLineFormValues: ConversionLineFormValues = {
  conversionGroupId: '',
  fromUomCode: '',
  toUomCode: '',
  multiplier: '',
  isBase: false,
  roundingRule: 'none'
};

export function validateUomForm(values: UomFormValues) {
  const errors: UomFormErrors = {};

  if (!values.uomCode.trim()) {
    errors.uomCode = 'UOM code is required';
  } else if (values.uomCode.trim().length > 20) {
    errors.uomCode = 'UOM code must be 20 characters or less';
  }

  if (!values.uomName.trim()) {
    errors.uomName = 'UOM name is required';
  } else if (values.uomName.trim().length > 100) {
    errors.uomName = 'UOM name must be 100 characters or less';
  }

  const decimals = Number(values.decimalPlaces);
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 6) {
    errors.decimalPlaces = 'Decimal places must be a whole number between 0 and 6';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateConversionGroupForm(values: ConversionGroupFormValues) {
  const errors: ConversionGroupFormErrors = {};

  if (!values.groupCode.trim()) {
    errors.groupCode = 'Group code is required';
  } else if (values.groupCode.trim().length > 30) {
    errors.groupCode = 'Group code must be 30 characters or less';
  }

  if (!values.groupName.trim()) {
    errors.groupName = 'Group name is required';
  } else if (values.groupName.trim().length > 120) {
    errors.groupName = 'Group name must be 120 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateConversionLineForm(values: ConversionLineFormValues) {
  const errors: ConversionLineFormErrors = {};

  if (!values.conversionGroupId.trim()) {
    errors.fromUomCode = 'Conversion group is required';
  }

  if (!values.fromUomCode.trim()) {
    errors.fromUomCode = 'From UOM is required';
  }

  if (!values.toUomCode.trim()) {
    errors.toUomCode = 'To UOM is required';
  }

  const multiplier = Number(values.multiplier);
  if (Number.isNaN(multiplier) || multiplier <= 0) {
    errors.multiplier = 'Multiplier must be a number greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function toCreateUomPayload(values: UomFormValues): CreateUomRequest {
  return {
    uomCode: values.uomCode.trim().toUpperCase(),
    uomName: values.uomName.trim(),
    uomType: values.uomType,
    decimalPlaces: Number(values.decimalPlaces),
    notes: values.notes.trim()
  };
}

function toUpdateUomPayload(values: UomFormValues): UpdateUomRequest {
  return {
    id: String(values.id),
    ...toCreateUomPayload(values)
  };
}

function toCreateConversionGroupPayload(
  values: ConversionGroupFormValues
): CreateConversionGroupRequest {
  return {
    groupCode: values.groupCode.trim().toUpperCase(),
    groupName: values.groupName.trim(),
    description: values.description.trim()
  };
}

function toUpdateConversionGroupPayload(
  values: ConversionGroupFormValues
): UpdateConversionGroupRequest {
  return {
    id: String(values.id),
    ...toCreateConversionGroupPayload(values)
  };
}

function toCreateConversionLinePayload(
  values: ConversionLineFormValues
): CreateConversionLineRequest {
  return {
    conversionGroupId: values.conversionGroupId,
    fromUomCode: values.fromUomCode.trim().toUpperCase(),
    toUomCode: values.toUomCode.trim().toUpperCase(),
    multiplier: Number(values.multiplier),
    isBase: values.isBase,
    roundingRule: values.roundingRule
  };
}

function toUpdateConversionLinePayload(
  values: ConversionLineFormValues
): UpdateConversionLineRequest {
  return {
    id: String(values.id),
    ...toCreateConversionLinePayload(values)
  };
}

export function useUomData() {
  const [uoms, setUoms] = useState<UomRecord[]>([]);
  const [conversionGroups, setConversionGroups] = useState<UomConversionGroupWithLines[]>([]);
  const [filters, setFilters] = useState<UomFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);

  async function load(nextFilters: UomFilters) {
    try {
      setIsLoading(true);
      setError(null);

      const [uomRows, groups] = await Promise.all([
        uomApi.getUoms(nextFilters),
        uomApi.getConversionGroups(nextFilters.search)
      ]);

      const groupDetails = await Promise.all(
        groups.map((group) => uomApi.getConversionGroupLines(group.id))
      );

      setUoms(uomRows);
      setConversionGroups(groupDetails);
    } catch (err: any) {
      setError(err?.message || 'Failed to load UOM data');
      setUoms([]);
      setConversionGroups([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load(filters);
  }, [filters]);

  const activeCount = useMemo(() => uoms.filter((item) => item.isActive).length, [uoms]);
  const inactiveCount = useMemo(() => uoms.filter((item) => !item.isActive).length, [uoms]);

  function startCreate() {
    setEditingId(null);
    setFormError(null);
  }

  function startEdit(item: UomRecord): UomFormValues {
    setEditingId(item.id);
    setFormError(null);

    return {
      id: item.id,
      uomCode: item.uomCode,
      uomName: item.uomName,
      uomType: item.uomType,
      decimalPlaces: String(item.decimalPlaces),
      notes: item.notes
    };
  }

  function startGroupCreate() {
    setEditingGroupId(null);
    setFormError(null);
  }

  function startGroupEdit(groupId: string): ConversionGroupFormValues {
    const found = conversionGroups.find((item) => item.group.id === groupId);

    if (!found) {
      return initialConversionGroupFormValues;
    }

    setEditingGroupId(groupId);
    setFormError(null);

    return {
      id: found.group.id,
      groupCode: found.group.groupCode,
      groupName: found.group.groupName,
      description: found.group.description
    };
  }

  function startLineCreate(groupId: string): ConversionLineFormValues {
    setEditingLineId(null);
    setFormError(null);

    return {
      ...initialConversionLineFormValues,
      conversionGroupId: groupId
    };
  }

  function startLineEdit(groupId: string, lineId: string): ConversionLineFormValues {
    const foundGroup = conversionGroups.find((item) => item.group.id === groupId);
    const foundLine = foundGroup?.lines.find((line) => line.id === lineId);

    if (!foundLine) {
      return {
        ...initialConversionLineFormValues,
        conversionGroupId: groupId
      };
    }

    setEditingLineId(lineId);
    setFormError(null);

    return {
      id: foundLine.id,
      conversionGroupId: foundLine.conversionGroupId,
      fromUomCode: foundLine.fromUomCode,
      toUomCode: foundLine.toUomCode,
      multiplier: String(foundLine.multiplier),
      isBase: foundLine.isBase,
      roundingRule: foundLine.roundingRule
    };
  }

  async function saveUom(values: UomFormValues) {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const validation = validateUomForm(values);
      if (!validation.isValid) {
        return validation;
      }

      if (editingId) {
        await uomApi.updateUom(toUpdateUomPayload(values));
      } else {
        await uomApi.createUom(toCreateUomPayload(values));
      }

      await load(filters);
      setEditingId(null);

      return {
        isValid: true,
        errors: {}
      };
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save UOM');
      return {
        isValid: false,
        errors: {}
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveConversionGroup(values: ConversionGroupFormValues) {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const validation = validateConversionGroupForm(values);
      if (!validation.isValid) {
        return validation;
      }

      if (editingGroupId) {
        await uomApi.updateConversionGroup(toUpdateConversionGroupPayload(values));
      } else {
        await uomApi.createConversionGroup(toCreateConversionGroupPayload(values));
      }

      await load(filters);
      setEditingGroupId(null);

      return {
        isValid: true,
        errors: {}
      };
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save conversion group');
      return {
        isValid: false,
        errors: {}
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveConversionLine(values: ConversionLineFormValues) {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const validation = validateConversionLineForm(values);
      if (!validation.isValid) {
        return validation;
      }

      if (editingLineId) {
        await uomApi.updateConversionLine(toUpdateConversionLinePayload(values));
      } else {
        await uomApi.createConversionLine(toCreateConversionLinePayload(values));
      }

      await load(filters);
      setEditingLineId(null);

      return {
        isValid: true,
        errors: {}
      };
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save conversion line');
      return {
        isValid: false,
        errors: {}
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleActive(item: UomRecord) {
    try {
      await uomApi.setUomActive(item.id, !item.isActive);
      await load(filters);
    } catch (err: any) {
      setError(err?.message || 'Failed to update UOM active status');
    }
  }

  async function toggleGroupActive(id: string, isActive: boolean) {
    try {
      await uomApi.setConversionGroupActive(id, !isActive);
      await load(filters);
    } catch (err: any) {
      setError(err?.message || 'Failed to update conversion group active status');
    }
  }

  async function toggleLineActive(groupId: string, lineId: string, isActive: boolean) {
    try {
      await uomApi.setConversionLineActive(groupId, lineId, !isActive);
      await load(filters);
    } catch (err: any) {
      setError(err?.message || 'Failed to update conversion line active status');
    }
  }

  return {
    uoms,
    conversionGroups,
    filters,
    isLoading,
    isSubmitting,
    error,
    formError,
    editingId,
    editingGroupId,
    editingLineId,
    activeCount,
    inactiveCount,
    updateSearch: (value: string) =>
      setFilters((current) => ({
        ...current,
        search: value
      })),
    updateType: (value: UomFilters['type']) =>
      setFilters((current) => ({
        ...current,
        type: value
      })),
    refresh: () => load(filters),
    startCreate,
    startEdit,
    saveUom,
    toggleActive,
    startGroupCreate,
    startGroupEdit,
    saveConversionGroup,
    startLineCreate,
    startLineEdit,
    saveConversionLine,
    toggleGroupActive,
    toggleLineActive
  };
}