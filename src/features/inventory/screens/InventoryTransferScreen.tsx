'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ROUTES } from '@/lib/routes';
import { InventoryTransferHistorySection } from '../components/InventoryTransferHistorySection';
import { useInventoryList } from '../hooks/useInventoryList';
import { useInventoryLocationBalances } from '../hooks/useInventoryLocationBalances';
import { useInventoryTransferCommit } from '../hooks/useInventoryTransferCommit';
import { useInventoryTransferDraft } from '../hooks/useInventoryTransferDraft';
import { useInventoryTransferSuggestion } from '../hooks/useInventoryTransferSuggestion';

export function InventoryTransferScreen() {
  const {
    items: inventoryItems,
    isLoading: isInventoryLoading,
    error: inventoryLoadError
  } = useInventoryList();

  const {
    draft,
    isLoading: isPreviewLoading,
    error: transferPreviewError,
    previewTransfer,
    clearDraft
  } = useInventoryTransferDraft();

  const {
    result: commitResult,
    isLoading: isCommitLoading,
    error: transferCommitError,
    commitTransfer,
    clearResult
  } = useInventoryTransferCommit();

  const {
    suggestion,
    isLoading: isSuggestLoading,
    error: suggestError,
    suggestSource,
    clearSuggestion
  } = useInventoryTransferSuggestion();

  const [inventoryItemId, setInventoryItemId] = useState('');
  const [fromWarehouseLocation, setFromWarehouseLocation] = useState('');
  const [toWarehouseLocation, setToWarehouseLocation] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState('inventory_transfer');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    items: locationBalances,
    summary: locationBalanceSummary,
    isLoading: isBalanceLoading,
    error: locationBalanceError,
    refresh: refreshBalances,
    getBalanceByLocation
  } = useInventoryLocationBalances(inventoryItemId || undefined);

  const selectedItem = useMemo(() => {
    if (!inventoryItemId) return null;
    return inventoryItems.find((item) => item.id === inventoryItemId) ?? null;
  }, [inventoryItems, inventoryItemId]);

  const sourceBalance = useMemo(() => {
    return fromWarehouseLocation ? getBalanceByLocation(fromWarehouseLocation) : null;
  }, [fromWarehouseLocation, getBalanceByLocation]);

  const destinationBalance = useMemo(() => {
    return toWarehouseLocation ? getBalanceByLocation(toWarehouseLocation) : null;
  }, [toWarehouseLocation, getBalanceByLocation]);

  useEffect(() => {
    if (!selectedItem) return;

    setFromWarehouseLocation(selectedItem.warehouseLocation || '');
    setQuantity(selectedItem.quantity > 0 ? '1' : '0');
  }, [selectedItem]);

  async function handleSuggestSource() {
    const qty = Number(quantity);

    if (!inventoryItemId.trim()) {
      setFormError('Inventory item is required');
      return;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      setFormError('Transfer quantity must be greater than 0');
      return;
    }

    setFormError(null);

    try {
      const result = await suggestSource({
        inventoryItemId: inventoryItemId.trim(),
        quantity: qty
      });

      if (result?.recommendedFromWarehouseLocation) {
        setFromWarehouseLocation(result.recommendedFromWarehouseLocation);
      }
    } catch {
      // hook error shown on screen
    }
  }

  async function handlePreviewTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const qty = Number(quantity);

    if (!inventoryItemId.trim()) {
      setFormError('Inventory item is required');
      return;
    }

    if (!fromWarehouseLocation.trim()) {
      setFormError('From Location is required');
      return;
    }

    if (!toWarehouseLocation.trim()) {
      setFormError('To Location is required');
      return;
    }

    if (!reason.trim()) {
      setFormError('Reason is required');
      return;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      setFormError('Transfer quantity must be greater than 0');
      return;
    }

    setFormError(null);
    clearResult();

    try {
      await previewTransfer({
        inventoryItemId: inventoryItemId.trim(),
        fromWarehouseLocation: fromWarehouseLocation.trim(),
        toWarehouseLocation: toWarehouseLocation.trim(),
        quantity: qty,
        reason: reason.trim(),
        notes: notes.trim()
      });
    } catch {
      // hook error shown on screen
    }
  }

  async function handlePostTransfer() {
    const qty = Number(quantity);

    if (!inventoryItemId.trim()) {
      setFormError('Inventory item is required');
      return;
    }

    if (!fromWarehouseLocation.trim()) {
      setFormError('From Location is required');
      return;
    }

    if (!toWarehouseLocation.trim()) {
      setFormError('To Location is required');
      return;
    }

    if (!reason.trim()) {
      setFormError('Reason is required');
      return;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      setFormError('Transfer quantity must be greater than 0');
      return;
    }

    setFormError(null);

    try {
      await commitTransfer({
        inventoryItemId: inventoryItemId.trim(),
        fromWarehouseLocation: fromWarehouseLocation.trim(),
        toWarehouseLocation: toWarehouseLocation.trim(),
        quantity: qty,
        reason: reason.trim(),
        notes: notes.trim()
      });

      await refreshBalances();
    } catch {
      // hook error shown on screen
    }
  }

  function handleClearPreview() {
    clearDraft();
    clearResult();
    clearSuggestion?.();

    setFormError(null);
    setInventoryItemId('');
    setFromWarehouseLocation('');
    setToWarehouseLocation('');
    setQuantity('1');
    setReason('inventory_transfer');
    setNotes('');
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
              Stock Transfer Preview
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Preview and then post location-to-location or plant-to-plant stock transfer.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.inventory}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to inventory
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
          Transfer Request
        </div>
        <div style={{ color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
          Start with a preview to validate source balance before posting the transfer.
        </div>

        <form onSubmit={handlePreviewTransfer}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Inventory Item
              </label>
              <select
                value={inventoryItemId}
                onChange={(e) => setInventoryItemId(e.target.value)}
                disabled={isInventoryLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff'
                }}
              >
                <option value="">
                  {isInventoryLoading ? 'Loading inventory...' : 'Select inventory item'}
                </option>

                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sku} - {item.name}
                  </option>
                ))}
              </select>

              {inventoryLoadError ? (
                <div style={{ marginTop: '8px', color: '#b91c1c', fontSize: '13px' }}>
                  {inventoryLoadError}
                </div>
              ) : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                From Location
              </label>
              <input
                value={fromWarehouseLocation}
                onChange={(e) => setFromWarehouseLocation(e.target.value)}
                placeholder="Example: A-01-01"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: selectedItem ? '#f8fafc' : '#ffffff'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                To Location
              </label>
              <input
                value={toWarehouseLocation}
                onChange={(e) => setToWarehouseLocation(e.target.value)}
                placeholder="Example: B-02-01 or TRANSIT-01"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Quantity
              </label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Reason
              </label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="inventory_transfer"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1'
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional transfer note"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {selectedItem ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155'
              }}
            >
              <div>
                <strong>Selected Item:</strong> {selectedItem.sku} - {selectedItem.name}
              </div>
              <div>
                <strong>Current Quantity:</strong> {selectedItem.quantity} {selectedItem.unit}
              </div>
              <div>
                <strong>Current Recorded Location:</strong> {selectedItem.warehouseLocation}
              </div>
            </div>
          ) : null}

          {isBalanceLoading ? (
            <div style={{ marginBottom: '16px', color: '#64748b' }}>
              Loading location balances...
            </div>
          ) : locationBalanceError ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {locationBalanceError}
            </div>
          ) : selectedItem ? (
            <>
              <div
                style={{
                  marginBottom: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155'
                  }}
                >
                  <strong>Source Balance:</strong>
                  <br />
                  {sourceBalance
                    ? `${sourceBalance.availableQty} ${sourceBalance.unit} available at ${sourceBalance.warehouseLocation}`
                    : 'No source balance found'}
                </div>

                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155'
                  }}
                >
                  <strong>Destination Balance:</strong>
                  <br />
                  {destinationBalance
                    ? `${destinationBalance.availableQty} ${destinationBalance.unit} currently at ${destinationBalance.warehouseLocation}`
                    : toWarehouseLocation
                      ? 'No existing balance found at destination yet'
                      : 'Enter destination location to check'}
                </div>

                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155'
                  }}
                >
                  <strong>Balance Summary:</strong>
                  <br />
                  Total lines: {locationBalanceSummary.totalLines}
                  <br />
                  Total on hand: {locationBalanceSummary.totalOnHandQty}
                  <br />
                  Total available: {locationBalanceSummary.totalAvailableQty}
                </div>
              </div>

              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#334155'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                  Balances for selected item
                </div>

                {locationBalances.length === 0 ? (
                  <div style={{ color: '#64748b' }}>
                    No location balances found for this item.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                          <th
                            style={{
                              padding: '12px',
                              borderBottom: '1px solid #e2e8f0'
                            }}
                          >
                            Location
                          </th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                            On Hand
                          </th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                            Reserved
                          </th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                            Available
                          </th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                            Unit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {locationBalances.map((balance) => (
                          <tr key={balance.id}>
                            <td
                              style={{
                                padding: '12px',
                                borderBottom: '1px solid #e2e8f0',
                                fontWeight: 700
                              }}
                            >
                              {balance.warehouseLocation}
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                              {balance.onHandQty}
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                              {balance.reservedQty}
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                              {balance.availableQty}
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                              {balance.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : null}

          {formError ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {formError}
            </div>
          ) : null}

          {transferPreviewError ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {transferPreviewError}
            </div>
          ) : null}

          {transferCommitError ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {transferCommitError}
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button
              type="submit"
              disabled={isPreviewLoading}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isPreviewLoading ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {isPreviewLoading ? 'Previewing...' : 'Preview Transfer'}
            </button>

            <button
              type="button"
              disabled={!draft || isCommitLoading}
              onClick={() => void handlePostTransfer()}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: !draft || isCommitLoading ? '#94a3b8' : '#0f766e',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {isCommitLoading ? 'Posting...' : 'Post Transfer'}
            </button>

            <button
              type="button"
              onClick={handleClearPreview}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 600
              }}
            >
              Clear Preview
            </button>
          </div>
        </form>

        {draft ? (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              marginBottom: commitResult ? '16px' : '0'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
              Draft Preview
            </div>
            <div>
              <strong>Item:</strong> {draft.sku} - {draft.itemName}
            </div>
            <div>
              <strong>From:</strong> {draft.fromWarehouseLocation}
            </div>
            <div>
              <strong>To:</strong> {draft.toWarehouseLocation}
            </div>
            <div>
              <strong>Quantity:</strong> {draft.quantity} {draft.unit}
            </div>
            <div>
              <strong>Reason:</strong> {draft.reason}
            </div>
            <div>
              <strong>Notes:</strong> {draft.notes || '-'}
            </div>
            <div style={{ marginTop: '12px' }}>
              <strong>Source Balance:</strong>{' '}
              {draft.availableSourceBalance
                ? `${draft.availableSourceBalance.availableQty} ${draft.availableSourceBalance.unit} available at ${draft.availableSourceBalance.warehouseLocation}`
                : 'No source balance found'}
            </div>
          </div>
        ) : null}

        {commitResult ? (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#ecfdf5',
              border: '1px solid #bbf7d0',
              color: '#166534',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
              Transfer Posted
            </div>
            <div>
              <strong>Transfer ID:</strong> {commitResult.transfer?.id || '-'}
            </div>
            <div>
              <strong>Item:</strong> {commitResult.transfer?.sku || '-'} -{' '}
              {commitResult.transfer?.itemName || '-'}
            </div>
            <div>
              <strong>From:</strong> {commitResult.transfer?.fromWarehouseLocation || '-'}
            </div>
            <div>
              <strong>To:</strong> {commitResult.transfer?.toWarehouseLocation || '-'}
            </div>
            <div>
              <strong>Quantity:</strong> {commitResult.transfer?.quantity || 0}
            </div>
            <div style={{ marginTop: '12px' }}>
              <strong>Updated Source Balance:</strong>{' '}
              {commitResult.sourceBalance
                ? `${commitResult.sourceBalance.availableQty} ${commitResult.sourceBalance.unit} available at ${commitResult.sourceBalance.warehouseLocation}`
                : '-'}
            </div>
            <div>
              <strong>Updated Destination Balance:</strong>{' '}
              {commitResult.destinationBalance
                ? `${commitResult.destinationBalance.availableQty} ${commitResult.destinationBalance.unit} available at ${commitResult.destinationBalance.warehouseLocation}`
                : '-'}
            </div>
          </div>
        ) : null}

        <InventoryTransferHistorySection />
      </div>
    </div>
  );
}