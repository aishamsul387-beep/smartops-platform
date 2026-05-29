'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ROUTES } from '@/lib/routes';
import { ordersApi } from '../api';
import { useCreateGRN } from '../hooks/useCreateGRN';
import { initialGRNFormValues, mapGRNFormToRequest, validateGRNForm } from '../schema';
import type { GRNFormErrors, GRNFormValues, PurchaseOrderRecord } from '../types';

export function GRNCreateScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createGRN, isSubmitting, error } = useCreateGRN();

  const preselectedPoId = String(searchParams.get('poId') ?? '').trim();
  const preselectedPoNo = String(searchParams.get('poNo') ?? '').trim();

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);
  const [isPoLoading, setIsPoLoading] = useState(true);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState('');
  const [selectedLineId, setSelectedLineId] = useState('');

  const [values, setValues] = useState<GRNFormValues>(initialGRNFormValues);
  const [errors, setErrors] = useState<GRNFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPurchaseOrders() {
      try {
        setIsPoLoading(true);
        const rows = await ordersApi.getPurchaseOrders({ search: '', status: 'all' });
        setPurchaseOrders(
          rows.filter(
            (item) =>
              item.status === 'issued' || item.status === 'partially_received'
          )
        );
      } catch {
        setPurchaseOrders([]);
      } finally {
        setIsPoLoading(false);
      }
    }

    void loadPurchaseOrders();
  }, []);

  useEffect(() => {
    if (isPoLoading || selectedPurchaseOrderId) {
      return;
    }

    if (!purchaseOrders.length) {
      return;
    }

    const matchById = preselectedPoId
      ? purchaseOrders.find((item) => item.id === preselectedPoId) || null
      : null;

    const matchByPoNo =
      !matchById && preselectedPoNo
        ? purchaseOrders.find((item) => item.poNo === preselectedPoNo) || null
        : null;

    const target = matchById || matchByPoNo;

    if (target) {
      handlePurchaseOrderChange(target.id);
    }
  }, [isPoLoading, purchaseOrders, preselectedPoId, preselectedPoNo, selectedPurchaseOrderId]);

  const selectedPurchaseOrder = useMemo(
    () => purchaseOrders.find((item) => item.id === selectedPurchaseOrderId) || null,
    [purchaseOrders, selectedPurchaseOrderId]
  );

  const availableLines = useMemo(() => {
    if (!selectedPurchaseOrder) {
      return [];
    }

    return selectedPurchaseOrder.lines.filter((line) => line.receivedQty < line.orderedQty);
  }, [selectedPurchaseOrder]);

  const selectedLine = useMemo(
    () => availableLines.find((line) => line.id === selectedLineId) || null,
    [availableLines, selectedLineId]
  );

  const remainingQty = selectedLine
    ? Math.max(selectedLine.orderedQty - selectedLine.receivedQty, 0)
    : 0;

  const numericReceivedQty = Number(values.receivedQty);
  const isReceivedQtyInvalid =
    !!selectedLine &&
    (!Number.isFinite(numericReceivedQty) ||
      numericReceivedQty <= 0 ||
      numericReceivedQty > remainingQty);

  function updateField<K extends keyof GRNFormValues>(field: K, value: GRNFormValues[K]) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));

    setFormError(null);
  }

  function handlePurchaseOrderChange(poId: string) {
    setSelectedPurchaseOrderId(poId);

    const po = purchaseOrders.find((item) => item.id === poId);
    const availablePoLines = po
      ? po.lines.filter((line) => line.receivedQty < line.orderedQty)
      : [];
    const nextLine = availablePoLines.length === 1 ? availablePoLines[0] : null;
    const nextRemainingQty = nextLine
      ? Math.max(nextLine.orderedQty - nextLine.receivedQty, 0)
      : 0;

    setSelectedLineId(nextLine?.id || '');

    setValues((current) => ({
      ...current,
      poNo: po?.poNo || '',
      purchaseOrderLineId: nextLine?.id || '',
      supplierName: po?.supplierName || '',
      inventoryItemId: nextLine?.inventoryItemId || '',
      receivedLines: '1',
      receivedQty: nextLine ? String(nextRemainingQty) : '0'
    }));

    setFormError(null);
  }

  function handleLineChange(lineId: string) {
    setSelectedLineId(lineId);

    const line = availableLines.find((item) => item.id === lineId);

    if (!line) {
      return;
    }

    const nextRemainingQty = Math.max(line.orderedQty - line.receivedQty, 0);

    setValues((current) => ({
      ...current,
      purchaseOrderLineId: line.id,
      inventoryItemId: line.inventoryItemId,
      supplierName: selectedPurchaseOrder?.supplierName || current.supplierName,
      receivedLines: '1',
      receivedQty: String(nextRemainingQty)
    }));

    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateGRNForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    if (!selectedPurchaseOrder) {
      setFormError('Purchase order selection is required');
      return;
    }

    if (!selectedLine) {
      setFormError('Purchase order line selection is required');
      return;
    }

    if (isReceivedQtyInvalid) {
      setFormError(
        remainingQty > 0
          ? `Received quantity cannot exceed remaining PO quantity (${remainingQty})`
          : 'Selected PO line is already fully received'
      );
      return;
    }

    try {
      setFormError(null);
      const created = await createGRN(mapGRNFormToRequest(values));
      router.replace(ROUTES.goodsReceivedNoteDetail(created.id));
      router.refresh();
    } catch {
      // hook error shown on screen
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
        <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
          Create Goods Received Note
        </div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          Receive goods against issued purchase order lines with guardrails to prevent over-receipt.
        </div>

        {preselectedPoId || preselectedPoNo ? (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe'
            }}
          >
            This GRN form was opened from an issued purchase order. Matching PO context will be preselected when available.
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <label htmlFor="purchaseOrderId" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Purchase Order
            </label>
            <select
              id="purchaseOrderId"
              value={selectedPurchaseOrderId}
              onChange={(e) => handlePurchaseOrderChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="">
                {isPoLoading ? 'Loading purchase orders...' : 'Select issued purchase order'}
              </option>
              {purchaseOrders.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.poNo} - {item.supplierName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="purchaseOrderLineId" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Purchase Order Line
            </label>
            <select
              id="purchaseOrderLineId"
              value={selectedLineId}
              onChange={(e) => handleLineChange(e.target.value)}
              disabled={!selectedPurchaseOrder}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="">
                {selectedPurchaseOrder ? 'Select PO line' : 'Select purchase order first'}
              </option>
              {availableLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.itemCode} - {line.itemName}
                </option>
              ))}
            </select>
            {errors.purchaseOrderLineId ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.purchaseOrderLineId}</div> : null}
            {selectedPurchaseOrder && availableLines.length === 0 ? (
              <div style={{ color: '#9a3412', marginTop: '8px', fontSize: '14px' }}>
                All PO lines for this purchase order are already fully received.
              </div>
            ) : null}
            {selectedPurchaseOrder && availableLines.length === 1 ? (
              <div style={{ color: '#475569', marginTop: '8px', fontSize: '14px' }}>
                One receivable PO line was found and auto-filled below.
              </div>
            ) : null}
            {selectedPurchaseOrder && availableLines.length > 1 && !selectedLine ? (
              <div style={{ color: '#475569', marginTop: '8px', fontSize: '14px' }}>
                Select a PO line to auto-fill Inventory Item ID and remaining receivable quantity.
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="poNo" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              PO No
            </label>
            <input
              id="poNo"
              value={values.poNo}
              onChange={(e) => updateField('poNo', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              readOnly
            />
            {errors.poNo ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.poNo}</div> : null}
          </div>

          <div>
            <label htmlFor="supplierName" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Supplier Name
            </label>
            <input
              id="supplierName"
              value={values.supplierName}
              onChange={(e) => updateField('supplierName', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              readOnly
            />
            {errors.supplierName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.supplierName}</div> : null}
          </div>

          <div>
            <label htmlFor="inventoryItemId" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Inventory Item ID
            </label>
            <input
              id="inventoryItemId"
              value={values.inventoryItemId}
              onChange={(e) => updateField('inventoryItemId', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155'
              }}
              readOnly
            />
            {errors.inventoryItemId ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.inventoryItemId}</div> : null}
            <div style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>
              Auto-filled from the selected purchase order line. This field is read-only by design.
            </div>
          </div>

          <div>
            <label htmlFor="batchNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Batch Number
            </label>
            <input
              id="batchNumber"
              value={values.batchNumber}
              onChange={(e) => updateField('batchNumber', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.batchNumber ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.batchNumber}</div> : null}
          </div>

          <div>
            <label htmlFor="lotNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Lot Number
            </label>
            <input
              id="lotNumber"
              value={values.lotNumber}
              onChange={(e) => updateField('lotNumber', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="supplierLotNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Supplier Lot Number
            </label>
            <input
              id="supplierLotNumber"
              value={values.supplierLotNumber}
              onChange={(e) => updateField('supplierLotNumber', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="manufactureDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Manufacture Date
            </label>
            <input
              id="manufactureDate"
              type="date"
              value={values.manufactureDate}
              onChange={(e) => updateField('manufactureDate', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="expiryDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={values.expiryDate}
              onChange={(e) => updateField('expiryDate', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="receivedDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Received Date
            </label>
            <input
              id="receivedDate"
              type="date"
              value={values.receivedDate}
              onChange={(e) => updateField('receivedDate', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="receivedLines" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Received Lines
            </label>
            <input
              id="receivedLines"
              value={values.receivedLines}
              onChange={(e) => updateField('receivedLines', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.receivedLines ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.receivedLines}</div> : null}
          </div>

          <div>
            <label htmlFor="receivedQty" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Received Qty
            </label>
            <input
              id="receivedQty"
              value={values.receivedQty}
              onChange={(e) => updateField('receivedQty', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: isReceivedQtyInvalid ? '1px solid #dc2626' : '1px solid #cbd5e1'
              }}
            />
            {errors.receivedQty ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.receivedQty}</div> : null}
            {selectedLine && isReceivedQtyInvalid ? (
              <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>
                Received quantity must be greater than 0 and cannot exceed remaining qty ({remainingQty}).
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Status
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(e) => updateField('status', e.target.value as GRNFormValues['status'])}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
            </select>
          </div>

          <div>
            <label htmlFor="warehouseLocation" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Warehouse Location
            </label>
            <input
              id="warehouseLocation"
              value={values.warehouseLocation}
              onChange={(e) => updateField('warehouseLocation', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="zone" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Zone
            </label>
            <input
              id="zone"
              value={values.zone}
              onChange={(e) => updateField('zone', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="aisle" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Aisle
            </label>
            <input
              id="aisle"
              value={values.aisle}
              onChange={(e) => updateField('aisle', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="levelCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Level
            </label>
            <input
              id="levelCode"
              value={values.levelCode}
              onChange={(e) => updateField('levelCode', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="bin" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Bin
            </label>
            <input
              id="bin"
              value={values.bin}
              onChange={(e) => updateField('bin', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        {selectedLine ? (
          <div
            style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '8px' }}>
              Selected PO Line Context
            </div>
            <div>Item: <strong>{selectedLine.itemCode} - {selectedLine.itemName}</strong></div>
            <div>Ordered Qty: <strong>{selectedLine.orderedQty}</strong></div>
            <div>Already Received: <strong>{selectedLine.receivedQty}</strong></div>
            <div>Remaining Qty: <strong>{remainingQty}</strong></div>
            <div>Unit Cost: <strong>{selectedLine.currency} {Number(selectedLine.unitCost).toFixed(2)}</strong></div>
          </div>
        ) : null}

        {(error || formError) ? (
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
            {formError || error}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !selectedPurchaseOrder ||
              !selectedLine ||
              isReceivedQtyInvalid
            }
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background:
                isSubmitting || !selectedPurchaseOrder || !selectedLine || isReceivedQtyInvalid
                  ? '#94a3b8'
                  : '#0f172a',
              color: '#ffffff',
              cursor:
                isSubmitting || !selectedPurchaseOrder || !selectedLine || isReceivedQtyInvalid
                  ? 'not-allowed'
                  : 'pointer',
              fontWeight: 600
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create GRN'}
          </button>

          <Link
            href={ROUTES.goodsReceivedNotes}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontWeight: 600
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

