'use client';

import { useRef, useState, type FormEvent } from 'react';
import {
  initialConversionGroupFormValues,
  initialConversionLineFormValues,
  initialUomFormValues,
  useUomData,
  validateConversionGroupForm,
  validateConversionLineForm,
  validateUomForm
} from '../hooks/useUomData';
import type {
  ConversionGroupFormErrors,
  ConversionGroupFormValues,
  ConversionLineFormErrors,
  ConversionLineFormValues,
  UomFormErrors,
  UomFormValues,
  UomRecord
} from '../types';

function getActiveBadgeStyle(isActive: boolean) {
  if (isActive) {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  return {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  };
}

function sectionCardStyle() {
  return {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px'
  } as const;
}

export function UomScreen() {
  const {
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
    updateSearch,
    updateType,
    refresh,
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
  } = useUomData();

  const [uomValues, setUomValues] = useState<UomFormValues>(initialUomFormValues);
  const [uomErrors, setUomErrors] = useState<UomFormErrors>({});

  const [groupValues, setGroupValues] = useState<ConversionGroupFormValues>(
    initialConversionGroupFormValues
  );
  const [groupErrors, setGroupErrors] = useState<ConversionGroupFormErrors>({});

  const [lineValues, setLineValues] = useState<ConversionLineFormValues>(
    initialConversionLineFormValues
  );
  const [lineErrors, setLineErrors] = useState<ConversionLineFormErrors>({});

  const uomFormRef = useRef<HTMLFormElement | null>(null);
  const groupFormRef = useRef<HTMLFormElement | null>(null);
  const lineFormRef = useRef<HTMLFormElement | null>(null);

  function scrollToForm(ref: React.RefObject<HTMLElement>) {
    window.setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }

  function updateUomField<K extends keyof UomFormValues>(field: K, value: UomFormValues[K]) {
    setUomValues((current) => ({
      ...current,
      [field]: value
    }));

    setUomErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  function updateGroupField<K extends keyof ConversionGroupFormValues>(
    field: K,
    value: ConversionGroupFormValues[K]
  ) {
    setGroupValues((current) => ({
      ...current,
      [field]: value
    }));

    setGroupErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  function updateLineField<K extends keyof ConversionLineFormValues>(
    field: K,
    value: ConversionLineFormValues[K]
  ) {
    setLineValues((current) => ({
      ...current,
      [field]: value
    }));

    setLineErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  function handleStartCreate() {
    startCreate();
    setUomValues(initialUomFormValues);
    setUomErrors({});
    scrollToForm(uomFormRef);
  }

  function handleStartEdit(item: UomRecord) {
    const nextValues = startEdit(item);
    setUomValues(nextValues);
    setUomErrors({});
    scrollToForm(uomFormRef);
  }

  function handleStartGroupCreate() {
    startGroupCreate();
    setGroupValues(initialConversionGroupFormValues);
    setGroupErrors({});
    scrollToForm(groupFormRef);
  }

  function handleStartGroupEdit(groupId: string) {
    const nextValues = startGroupEdit(groupId);
    setGroupValues(nextValues);
    setGroupErrors({});
    scrollToForm(groupFormRef);
  }

  function handleStartLineCreate(groupId: string) {
    const nextValues = startLineCreate(groupId);
    setLineValues(nextValues);
    setLineErrors({});
    scrollToForm(lineFormRef);
  }

  function handleStartLineEdit(groupId: string, lineId: string) {
    const nextValues = startLineEdit(groupId, lineId);
    setLineValues(nextValues);
    setLineErrors({});
    scrollToForm(lineFormRef);
  }

  async function handleUomSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateUomForm(uomValues);
    setUomErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    const result = await saveUom(uomValues);

    if (result.isValid) {
      setUomValues(initialUomFormValues);
      setUomErrors({});
    }
  }

  async function handleGroupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateConversionGroupForm(groupValues);
    setGroupErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    const result = await saveConversionGroup(groupValues);

    if (result.isValid) {
      setGroupValues(initialConversionGroupFormValues);
      setGroupErrors({});
    }
  }

  async function handleLineSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateConversionLineForm(lineValues);
    setLineErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    const result = await saveConversionLine(lineValues);

    if (result.isValid) {
      setLineValues(initialConversionLineFormValues);
      setLineErrors({});
    }
  }

  return (
    <div className="container">
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              UOM / Multi-UOM Conversion
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Manage UOM master records, conversion groups, and conversion lines for inventory,
              procurement, batch handling, and stock movement policies.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleStartCreate}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f766e',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Create UOM
            </button>

            <button
              type="button"
              onClick={handleStartGroupCreate}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Create Group
            </button>

            <button
              type="button"
              onClick={() => void refresh()}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <div style={{ ...sectionCardStyle(), padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Total UOMs</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{uoms.length}</div>
        </div>

        <div style={{ ...sectionCardStyle(), padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Active</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{activeCount}</div>
        </div>

        <div style={{ ...sectionCardStyle(), padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Inactive</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{inactiveCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px', marginBottom: '24px' }}>
        <form
          ref={uomFormRef}
          onSubmit={handleUomSubmit}
          style={sectionCardStyle()}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            {editingId ? 'Edit UOM' : 'Create UOM'}
          </div>
          <div style={{ color: '#64748b', marginBottom: '16px' }}>
            {editingId
              ? `Editing record: ${uomValues.uomCode || '(existing UOM)'}`
              : 'Create a new unit of measurement master record.'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="uomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>UOM Code</label>
              <input
                id="uomCode"
                value={uomValues.uomCode}
                onChange={(event) => updateUomField('uomCode', event.target.value)}
                placeholder="PCS"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {uomErrors.uomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{uomErrors.uomCode}</div> : null}
            </div>

            <div>
              <label htmlFor="uomName" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>UOM Name</label>
              <input
                id="uomName"
                value={uomValues.uomName}
                onChange={(event) => updateUomField('uomName', event.target.value)}
                placeholder="Pieces"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {uomErrors.uomName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{uomErrors.uomName}</div> : null}
            </div>

            <div>
              <label htmlFor="uomType" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>UOM Type</label>
              <select
                id="uomType"
                value={uomValues.uomType}
                onChange={(event) => updateUomField('uomType', event.target.value as UomFormValues['uomType'])}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
              >
                <option value="quantity">Quantity</option>
                <option value="weight">Weight</option>
                <option value="volume">Volume</option>
                <option value="length">Length</option>
                <option value="pack">Pack</option>
              </select>
            </div>

            <div>
              <label htmlFor="decimalPlaces" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Decimal Places</label>
              <input
                id="decimalPlaces"
                value={uomValues.decimalPlaces}
                onChange={(event) => updateUomField('decimalPlaces', event.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {uomErrors.decimalPlaces ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{uomErrors.decimalPlaces}</div> : null}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="uomNotes" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Notes</label>
              <textarea
                id="uomNotes"
                value={uomValues.notes}
                onChange={(event) => updateUomField('notes', event.target.value)}
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              />
            </div>
          </div>

          {formError ? <div style={{ marginTop: '16px', color: '#b91c1c' }}>{formError}</div> : null}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '12px 16px', borderRadius: '10px', border: 'none', background: isSubmitting ? '#94a3b8' : '#0f172a', color: '#ffffff', fontWeight: 600 }}
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update UOM' : 'Create UOM'}
            </button>

            <button
              type="button"
              onClick={handleStartCreate}
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}
            >
              Reset
            </button>
          </div>
        </form>

        <form
          ref={groupFormRef}
          onSubmit={handleGroupSubmit}
          style={sectionCardStyle()}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            {editingGroupId ? 'Edit Conversion Group' : 'Create Conversion Group'}
          </div>
          <div style={{ color: '#64748b', marginBottom: '16px' }}>
            {editingGroupId
              ? `Editing group: ${groupValues.groupCode || '(existing group)'}`
              : 'Create a conversion group for multi-UOM relationships.'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="groupCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Group Code</label>
              <input
                id="groupCode"
                value={groupValues.groupCode}
                onChange={(event) => updateGroupField('groupCode', event.target.value)}
                placeholder="PK_STD_001"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {groupErrors.groupCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{groupErrors.groupCode}</div> : null}
            </div>

            <div>
              <label htmlFor="groupName" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Group Name</label>
              <input
                id="groupName"
                value={groupValues.groupName}
                onChange={(event) => updateGroupField('groupName', event.target.value)}
                placeholder="Standard Packaging"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {groupErrors.groupName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{groupErrors.groupName}</div> : null}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="groupDescription" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
              <textarea
                id="groupDescription"
                value={groupValues.description}
                onChange={(event) => updateGroupField('description', event.target.value)}
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '12px 16px', borderRadius: '10px', border: 'none', background: isSubmitting ? '#94a3b8' : '#2563eb', color: '#ffffff', fontWeight: 600 }}
            >
              {isSubmitting ? 'Saving...' : editingGroupId ? 'Update Group' : 'Create Group'}
            </button>

            <button
              type="button"
              onClick={handleStartGroupCreate}
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}
            >
              Reset
            </button>
          </div>
        </form>

        <form
          ref={lineFormRef}
          onSubmit={handleLineSubmit}
          style={sectionCardStyle()}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            {editingLineId ? 'Edit Conversion Line' : 'Create Conversion Line'}
          </div>
          <div style={{ color: '#64748b', marginBottom: '16px' }}>
            {editingLineId
              ? `Editing conversion line for group ${lineValues.conversionGroupId || '(selected group)'}`
              : 'Create a conversion line inside a selected conversion group.'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="lineGroup" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Conversion Group</label>
              <select
                id="lineGroup"
                value={lineValues.conversionGroupId}
                onChange={(event) => updateLineField('conversionGroupId', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
              >
                <option value="">Select group</option>
                {conversionGroups.map((groupBlock) => (
                  <option key={groupBlock.group.id} value={groupBlock.group.id}>
                    {groupBlock.group.groupCode} - {groupBlock.group.groupName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fromUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>From UOM</label>
              <input
                id="fromUomCode"
                value={lineValues.fromUomCode}
                onChange={(event) => updateLineField('fromUomCode', event.target.value)}
                placeholder="BOX"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {lineErrors.fromUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{lineErrors.fromUomCode}</div> : null}
            </div>

            <div>
              <label htmlFor="toUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>To UOM</label>
              <input
                id="toUomCode"
                value={lineValues.toUomCode}
                onChange={(event) => updateLineField('toUomCode', event.target.value)}
                placeholder="PCS"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {lineErrors.toUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{lineErrors.toUomCode}</div> : null}
            </div>

            <div>
              <label htmlFor="multiplier" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Multiplier</label>
              <input
                id="multiplier"
                value={lineValues.multiplier}
                onChange={(event) => updateLineField('multiplier', event.target.value)}
                placeholder="24"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {lineErrors.multiplier ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{lineErrors.multiplier}</div> : null}
            </div>

            <div>
              <label htmlFor="roundingRule" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Rounding Rule</label>
              <select
                id="roundingRule"
                value={lineValues.roundingRule}
                onChange={(event) =>
                  updateLineField('roundingRule', event.target.value as ConversionLineFormValues['roundingRule'])
                }
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
              >
                <option value="none">none</option>
                <option value="round_up">round_up</option>
                <option value="round_down">round_down</option>
                <option value="round_nearest">round_nearest</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '32px' }}>
              <input
                id="isBase"
                type="checkbox"
                checked={lineValues.isBase}
                onChange={(event) => updateLineField('isBase', event.target.checked)}
              />
              <label htmlFor="isBase" style={{ fontWeight: 600 }}>Is Base Rule</label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '12px 16px', borderRadius: '10px', border: 'none', background: isSubmitting ? '#94a3b8' : '#7c3aed', color: '#ffffff', fontWeight: 600 }}
            >
              {isSubmitting ? 'Saving...' : editingLineId ? 'Update Line' : 'Create Line'}
            </button>

            <button
              type="button"
              onClick={() => {
                setLineValues(initialConversionLineFormValues);
                setLineErrors({});
              }}
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <label htmlFor="uom-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="uom-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search code, name, notes"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="uom-type-filter" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              UOM Type
            </label>
            <select
              id="uom-type-filter"
              value={filters.type || 'all'}
              onChange={(event) =>
                updateType(
                  event.target.value as 'all' | 'quantity' | 'weight' | 'volume' | 'length' | 'pack'
                )
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="all">All</option>
              <option value="quantity">Quantity</option>
              <option value="weight">Weight</option>
              <option value="volume">Volume</option>
              <option value="length">Length</option>
              <option value="pack">Pack</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#64748b' }}>Loading UOM data...</div>
      ) : error ? (
        <div style={{ color: '#b91c1c' }}>{error}</div>
      ) : (
        <>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px'
            }}
          >
            <div style={{ padding: '20px', fontSize: '22px', fontWeight: 700 }}>
              UOM Master
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                    <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Code</th>
                    <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                    <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                    <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Decimals</th>
                    <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Active</th>
                    <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Notes</th>
                    <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uoms.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                        {item.uomCode}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.uomName}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.uomType}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.decimalPlaces}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '6px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            ...getActiveBadgeStyle(item.isActive)
                          }}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.notes}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => void toggleActive(item)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: 'none',
                              background: item.isActive ? '#991b1b' : '#166534',
                              color: '#ffffff',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            {item.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {conversionGroups.map((groupBlock) => (
              <div
                key={groupBlock.group.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
                        {groupBlock.group.groupName}
                      </div>
                      <div style={{ color: '#475569', marginBottom: '8px' }}>
                        {groupBlock.group.groupCode}
                      </div>
                      <div style={{ color: '#64748b', marginBottom: '12px' }}>
                        {groupBlock.group.description}
                      </div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 700,
                          ...getActiveBadgeStyle(groupBlock.group.isActive)
                        }}
                      >
                        {groupBlock.group.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'start' }}>
                      <button
                        type="button"
                        onClick={() => handleStartGroupEdit(groupBlock.group.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Edit Group
                      </button>

                      <button
                        type="button"
                        onClick={() => void toggleGroupActive(groupBlock.group.id, groupBlock.group.isActive)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: groupBlock.group.isActive ? '#991b1b' : '#166534',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {groupBlock.group.isActive ? 'Deactivate Group' : 'Activate Group'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartLineCreate(groupBlock.group.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#7c3aed',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Add Line
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                        <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>From</th>
                        <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>To</th>
                        <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Multiplier</th>
                        <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Base</th>
                        <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Rounding</th>
                        <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Active</th>
                        <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupBlock.lines.map((line) => (
                        <tr key={line.id}>
                          <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{line.fromUomCode}</td>
                          <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{line.toUomCode}</td>
                          <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{line.multiplier}</td>
                          <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{line.isBase ? 'Yes' : 'No'}</td>
                          <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{line.roundingRule}</td>
                          <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '6px 10px',
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: 700,
                                ...getActiveBadgeStyle(line.isActive)
                              }}
                            >
                              {line.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleStartLineEdit(groupBlock.group.id, line.id)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                              >
                                Edit Line
                              </button>

                              <button
                                type="button"
                                onClick={() => void toggleLineActive(groupBlock.group.id, line.id, line.isActive)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: line.isActive ? '#991b1b' : '#166534',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                              >
                                {line.isActive ? 'Deactivate Line' : 'Activate Line'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}