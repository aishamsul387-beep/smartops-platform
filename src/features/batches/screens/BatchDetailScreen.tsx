'use client';

import Link from 'next/link';
import { useBatchDetail } from '../hooks/useBatchDetail';
import { useBatchInventorySummary } from '../hooks/useBatchInventorySummary';

function getBatchStatusStyle(status: string) {
  if (status === 'available') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  if (status === 'quarantine') {
    return {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    };
  }

  if (status === 'blocked') {
    return {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    };
  }

  if (status === 'expired') {
    return {
      background: '#e0e7ff',
      color: '#3730a3',
      border: '1px solid #c7d2fe'
    };
  }

  return {
    background: '#e2e8f0',
    color: '#334155',
    border: '1px solid #cbd5e1'
  };
}

function DetailCard({
  label,
  value
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}
    >
      <div style={{ color: '#64748b', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 700 }}>
        {value === null || value === undefined || value === '' ? '-' : value}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid #f1f5f9'
      }}
    >
      <div style={{ color: '#64748b', fontWeight: 600 }}>{label}</div>
      <div>{value === null || value === undefined || value === '' ? '-' : value}</div>
    </div>
  );
}

export function BatchDetailScreen({ id }: { id: string }) {
  const { item, isLoading, error, refresh } = useBatchDetail(id);
  const {
    item: inventoryItem,
    isLoading: isInventoryLoading,
    error: inventoryError
  } = useBatchInventorySummary(item?.inventoryItemId || '');

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ padding: '24px', color: '#64748b' }}>Loading batch detail...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container">
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '24px'
          }}
        >
          <div style={{ color: '#b91c1c', marginBottom: '16px' }}>
            {error || 'Batch not found'}
          </div>
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
            Retry
          </button>
        </div>
      </div>
    );
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
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              {item.batchNumber}
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Batch detail drill-down with product identity and source traceability.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/batches"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to Batches
            </Link>

            <Link
              href={`/inventory/${item.inventoryItemId}`}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Open Inventory Item
            </Link>
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
        <DetailCard label="Batch Number" value={item.batchNumber} />
        <DetailCard label="SKU" value={inventoryItem?.sku || (isInventoryLoading ? 'Loading...' : '-')} />
        <DetailCard label="Barcode" value={inventoryItem?.barcode || (isInventoryLoading ? 'Loading...' : '-')} />
        <DetailCard label="Product Name" value={inventoryItem?.name || (isInventoryLoading ? 'Loading...' : '-')} />
        <DetailCard label="Supplier" value={item.supplierName} />
        <DetailCard label="Status" value={item.batchStatus} />
      </div>

      <div
        style={{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Product Identity
          </div>

          {inventoryError ? (
            <div style={{ color: '#b91c1c' }}>{inventoryError}</div>
          ) : inventoryItem ? (
            <>
              <DetailRow label="SKU" value={inventoryItem.sku} />
              <DetailRow label="Barcode" value={inventoryItem.barcode} />
              <DetailRow label="Product Name" value={inventoryItem.name} />
              <DetailRow label="Category" value={inventoryItem.category} />
              <DetailRow label="Item Type" value={inventoryItem.itemType} />
              <DetailRow label="Brand" value={inventoryItem.brand} />
              <DetailRow label="Model" value={inventoryItem.model} />
              <DetailRow label="Preferred Supplier" value={inventoryItem.preferredSupplierName} />
            </>
          ) : (
            <div style={{ color: '#64748b' }}>
              {isInventoryLoading ? 'Loading inventory identity...' : 'No inventory identity found.'}
            </div>
          )}
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Source Traceability
          </div>
          <DetailRow label="Inventory Item ID" value={item.inventoryItemId} />
          <DetailRow label="Purchase Order No" value={item.purchaseOrderNo || '-'} />
          <DetailRow label="GRN No" value={item.goodsReceivedNoteNo || '-'} />
          <DetailRow label="Supplier Lot Number" value={item.supplierLotNumber || '-'} />
          <DetailRow label="Lot Number" value={item.lotNumber || '-'} />
          <DetailRow label="Notes" value={item.notes || '-'} />
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Quantity Breakdown
          </div>
          <DetailRow label="Received Qty" value={item.receivedQty} />
          <DetailRow label="Available Qty" value={item.availableQty} />
          <DetailRow label="Reserved Qty" value={item.reservedQty} />
          <DetailRow label="Blocked Qty" value={item.blockedQty} />
          <DetailRow label="QA Hold Qty" value={item.qaHoldQty} />
          <DetailRow label="Unit Cost" value={`${item.currency} ${Number(item.unitCost).toFixed(2)}`} />
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Date Tracking
          </div>
          <DetailRow label="Manufacture Date" value={item.manufactureDate} />
          <DetailRow label="Expiry Date" value={item.expiryDate} />
          <DetailRow label="Received Date" value={item.receivedDate} />
          <DetailRow label="Currency" value={item.currency} />
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Storage Location
          </div>
          <DetailRow label="Warehouse Location" value={item.warehouseLocation} />
          <DetailRow label="Zone" value={item.zone} />
          <DetailRow label="Aisle" value={item.aisle} />
          <DetailRow label="Level" value={item.levelCode} />
          <DetailRow label="Bin" value={item.bin} />
          <div style={{ marginTop: '16px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                ...getBatchStatusStyle(item.batchStatus)
              }}
            >
              {item.batchStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}