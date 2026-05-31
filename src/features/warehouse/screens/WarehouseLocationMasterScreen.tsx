'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { PageHeaderCard, PageSectionCard, PageStatCard, PageStatsGrid } from '@/components/layout/PageShell';
import { useCreateWarehouseLocation } from '../hooks/useCreateWarehouseLocation';
import { useToggleWarehouseLocationActive } from '../hooks/useToggleWarehouseLocationActive';
import { useWarehouseLocations } from '../hooks/useWarehouseLocations';
import {
  initialWarehouseLocationFormValues,
  mapWarehouseLocationFormToCreateRequest,
  validateWarehouseLocationForm
} from '../schema';
import type { WarehouseLocationFormErrors, WarehouseLocationFormValues, WarehouseLocationRecord } from '../types';

function getStatusStyle(status: string) {
  if (status === 'empty') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  if (status === 'occupied') {
    return {
      background: '#dbeafe',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe'
    };
  }

  return {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  };
}

export function WarehouseLocationMasterScreen() {
  const {
    items,
    total,
    filters,
    isLoading,
    error,
    updateSearch,
    updateStatus,
    updateType,
    updateActive,
    refresh
  } = useWarehouseLocations();

  const { createLocation, isSubmitting, error: createError } = useCreateWarehouseLocation();
  const { toggleActive, isSubmitting: isToggling, error: toggleError } = useToggleWarehouseLocationActive();

  const [values, setValues] = useState<WarehouseLocationFormValues>(initialWarehouseLocationFormValues);
  const [errors, setErrors] = useState<WarehouseLocationFormErrors>({});

  const summary = useMemo(() => {
    const activeItems = items.filter((item) => item.isActive).length;
    const emptyItems = items.filter((item) => item.status === 'empty').length;
    const occupiedItems = items.filter((item) => item.status === 'occupied').length;
    const blockedItems = items.filter((item) => item.status === 'blocked').length;

    return {
      activeItems,
      emptyItems,
      occupiedItems,
      blockedItems
    };
  }, [items]);

  function updateField<K extends keyof WarehouseLocationFormValues>(
    field: K,
    value: WarehouseLocationFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateWarehouseLocationForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      await createLocation(mapWarehouseLocationFormToCreateRequest(values));
      setValues(initialWarehouseLocationFormValues);
      await refresh();
    } catch {
      // hook error shown on screen
    }
  }

  async function handleToggle(item: WarehouseLocationRecord) {
    try {
      await toggleActive(item.id, !item.isActive);
      await refresh();
    } catch {
      // hook error shown on screen
    }
  }

  return (
    <div className="container">
      <PageHeaderCard
        title="Warehouse Location Master"
        description="Master location setup for storage, inventory control, receiving, and future capacity analytics."
        actions={
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
        }
      />

      <PageSectionCard title="Create Warehouse Location">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Warehouse Code</label>
              <input value={values.warehouseCode} onChange={(e) => updateField('warehouseCode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.warehouseCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.warehouseCode}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Warehouse Name</label>
              <input value={values.warehouseName} onChange={(e) => updateField('warehouseName', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.warehouseName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.warehouseName}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Location Code</label>
              <input value={values.locationCode} onChange={(e) => updateField('locationCode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.locationCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.locationCode}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Zone</label>
              <input value={values.zone} onChange={(e) => updateField('zone', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.zone ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.zone}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Aisle</label>
              <input value={values.aisle} onChange={(e) => updateField('aisle', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.aisle ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.aisle}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Level</label>
              <input value={values.levelCode} onChange={(e) => updateField('levelCode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.levelCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.levelCode}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Bin</label>
              <input value={values.bin} onChange={(e) => updateField('bin', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.bin ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.bin}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Location Type</label>
              <select value={values.locationType} onChange={(e) => updateField('locationType', e.target.value as WarehouseLocationFormValues['locationType'])} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
                <option value="rack">rack</option>
                <option value="floor">floor</option>
                <option value="bulk">bulk</option>
                <option value="staging">staging</option>
                <option value="quarantine">quarantine</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
              <select value={values.status} onChange={(e) => updateField('status', e.target.value as WarehouseLocationFormValues['status'])} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
                <option value="empty">empty</option>
                <option value="occupied">occupied</option>
                <option value="blocked">blocked</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Pallet Capacity</label>
              <input value={values.palletCapacity} onChange={(e) => updateField('palletCapacity', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.palletCapacity ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.palletCapacity}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Used Pallet Capacity</label>
              <input value={values.usedPalletCapacity} onChange={(e) => updateField('usedPalletCapacity', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.usedPalletCapacity ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.usedPalletCapacity}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Cubic Capacity (m3)</label>
              <input value={values.cubicCapacityM3} onChange={(e) => updateField('cubicCapacityM3', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.cubicCapacityM3 ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.cubicCapacityM3}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Used Cubic Capacity (m3)</label>
              <input value={values.usedCubicCapacityM3} onChange={(e) => updateField('usedCubicCapacityM3', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.usedCubicCapacityM3 ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.usedCubicCapacityM3}</div> : null}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '28px' }}>
              <input
                id="isActive"
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
              />
              <label htmlFor="isActive" style={{ fontWeight: 600 }}>Active</label>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Notes</label>
              <textarea value={values.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
            </div>
          </div>

          {(createError || toggleError) ? (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {createError || toggleError}
            </div>
          ) : null}

          <div style={{ marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isSubmitting ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Location'}
            </button>
          </div>
        </form>
      </PageSectionCard>

      <PageSectionCard title="Warehouse Location Summary">
        <PageStatsGrid>
          <PageStatCard label="Total Locations" value={total} />
          <PageStatCard label="Active Locations" value={summary.activeItems} />
          <PageStatCard label="Empty Locations" value={summary.emptyItems} />
          <PageStatCard label="Occupied Locations" value={summary.occupiedItems} />
          <PageStatCard label="Blocked Locations" value={summary.blockedItems} />
        </PageStatsGrid>
      </PageSectionCard>

      <PageSectionCard title="Search & Filter">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Search</label>
            <input
              value={filters.search || ''}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search location, zone, aisle, warehouse"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => updateStatus(e.target.value as any)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="empty">empty</option>
              <option value="occupied">occupied</option>
              <option value="blocked">blocked</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Type</label>
            <select
              value={filters.type || 'all'}
              onChange={(e) => updateType(e.target.value as any)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="rack">rack</option>
              <option value="floor">floor</option>
              <option value="bulk">bulk</option>
              <option value="staging">staging</option>
              <option value="quarantine">quarantine</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Active</label>
            <select
              value={filters.active || 'all'}
              onChange={(e) => updateActive(e.target.value as any)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
        </div>
      </PageSectionCard>

      <PageSectionCard title="Warehouse Location List" noPadding>
        {isLoading ? (
          <div style={{ padding: '24px', color: '#64748b' }}>Loading warehouse locations...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No warehouse locations found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Warehouse</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Location Code</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Zone / Aisle / Level / Bin</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Capacity</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Active</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 700 }}>{item.warehouseCode}</div>
                      <div>{item.warehouseName}</div>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {item.locationCode}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.zone} / {item.aisle} / {item.levelCode} / {item.bin}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.locationType}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 700,
                          ...getStatusStyle(item.status)
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div>Pallet: {item.usedPalletCapacity} / {item.palletCapacity}</div>
                      <div>M3: {item.usedCubicCapacityM3} / {item.cubicCapacityM3}</div>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.isActive ? 'Yes' : 'No'}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => void handleToggle(item)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontWeight: 600
                        }}
                      >
                        {item.isActive ? 'Set inactive' : 'Set active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageSectionCard>
    </div>
  );
}