'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useBatchDetail } from '../hooks/useBatchDetail'
import type { H10ABatchStatus, H10AStockMovementRecord } from '../api'

export type BatchDetailScreenProps = {
  id?: string
  batchId?: string
}

const STATUS_OPTIONS: Array<{
  value: H10ABatchStatus
  label: string
  tone: string
}> = [
  {
    value: 'available',
    label: 'Set Available',
    tone: 'bg-emerald-600 text-white hover:bg-emerald-700'
  },
  {
    value: 'blocked',
    label: 'Set Blocked',
    tone: 'bg-rose-600 text-white hover:bg-rose-700'
  },
  {
    value: 'quarantine',
    label: 'Set Quarantine',
    tone: 'bg-amber-500 text-white hover:bg-amber-600'
  },
  {
    value: 'expired',
    label: 'Set Expired',
    tone: 'bg-slate-700 text-white hover:bg-slate-800'
  },
  {
    value: 'consumed',
    label: 'Set Consumed',
    tone: 'bg-indigo-600 text-white hover:bg-indigo-700'
  }
]

function formatDate(value?: string | null) {
  if (!value) {
    return 'â€”'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString()
}

function formatNumber(value?: number | null) {
  const parsed = Number(value ?? 0)
  if (Number.isNaN(parsed)) {
    return '0'
  }

  return parsed.toLocaleString()
}

function statusBadgeTone(status?: string | null) {
  switch (String(status ?? '').toLowerCase()) {
    case 'available':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    case 'blocked':
      return 'bg-rose-100 text-rose-800 border border-rose-200'
    case 'quarantine':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'expired':
      return 'bg-slate-200 text-slate-800 border border-slate-300'
    case 'consumed':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200'
  }
}

function DetailItem(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{props.label}</div>
      <div className="mt-2 break-words text-sm text-slate-900">{props.value || 'â€”'}</div>
    </div>
  )
}

function MovementTable({ items }: { items: H10AStockMovementRecord[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        No movement ledger records found for this batch.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Occurred</th>
            <th className="px-4 py-3 text-left font-semibold">Reference</th>
            <th className="px-4 py-3 text-left font-semibold">Type</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Qty In</th>
            <th className="px-4 py-3 text-right font-semibold">Net Qty</th>
            <th className="px-4 py-3 text-right font-semibold">Available</th>
            <th className="px-4 py-3 text-right font-semibold">Blocked</th>
            <th className="px-4 py-3 text-right font-semibold">QA Hold</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3 align-top text-slate-700">{formatDate(item.occurredAt)}</td>
              <td className="px-4 py-3 align-top text-slate-900">{item.referenceNo || 'â€”'}</td>
              <td className="px-4 py-3 align-top uppercase text-slate-700">{item.referenceType}</td>
              <td className="px-4 py-3 align-top">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeTone(
                    item.batchStatus
                  )}`}
                >
                  {item.batchStatus || 'â€”'}
                </span>
              </td>
              <td className="px-4 py-3 align-top text-right text-slate-700">{formatNumber(item.qtyIn)}</td>
              <td className="px-4 py-3 align-top text-right text-slate-700">{formatNumber(item.netQty)}</td>
              <td className="px-4 py-3 align-top text-right text-slate-700">{formatNumber(item.availableQty)}</td>
              <td className="px-4 py-3 align-top text-right text-slate-700">{formatNumber(item.blockedQty)}</td>
              <td className="px-4 py-3 align-top text-right text-slate-700">{formatNumber(item.qaHoldQty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function BatchDetailScreen(props: BatchDetailScreenProps) {
  const params = useParams<{ id?: string | string[] }>()
  const routeId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const batchId = String(props.batchId ?? props.id ?? routeId ?? '').trim()

  const {
    batch,
    movements,
    isLoading,
    isRefreshing,
    isUpdatingStatus,
    error,
    statusError,
    refresh,
    updateStatus,
    quantitySummary
  } = useBatchDetail(batchId)

  const currentStatus = String(batch?.batchStatus ?? '').toLowerCase()

  const statusSummary = useMemo(() => {
    return STATUS_OPTIONS.map((option) => ({
      ...option,
      isCurrent: option.value === currentStatus
    }))
  }, [currentStatus])

  const handleStatusChange = async (nextStatus: H10ABatchStatus) => {
    if (!batchId) {
      return
    }

    let statusNote = ''

    if (typeof window !== 'undefined') {
      const input = window.prompt(
        `Optional note for setting batch status to "${nextStatus}". Leave blank if not needed.`,
        ''
      )

      if (input === null) {
        return
      }

      statusNote = input.trim()
    }

    await updateStatus(nextStatus, statusNote)
  }

  if (!batchId) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Batch id is missing.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading batch detail...
        </div>
      </div>
    )
  }

  if (error || !batch) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error || 'Batch not found.'}
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Batch Detail
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{batch.batchNumber}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Inventory Item ID: <span className="font-medium text-slate-700">{batch.inventoryItemId}</span>
            </p>
          </div>

          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusBadgeTone(
                batch.batchStatus
              )}`}
            >
              {batch.batchStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={isRefreshing || isUpdatingStatus}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Batch Status Actions</h2>
          <p className="text-sm text-slate-500">
            Update the operational status and keep movement ledger view aligned with the latest batch state.
          </p>
        </div>

        {statusError ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {statusError}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {statusSummary.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => void handleStatusChange(option.value)}
              disabled={isUpdatingStatus || option.isCurrent}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                option.isCurrent
                  ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                  : `${option.tone} disabled:cursor-not-allowed disabled:opacity-60`
              }`}
            >
              {isUpdatingStatus && option.isCurrent ? 'Updating...' : option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem label="Lot Number" value={batch.lotNumber || 'â€”'} />
        <DetailItem label="Supplier Lot Number" value={batch.supplierLotNumber || 'â€”'} />
        <DetailItem label="Supplier Name" value={batch.supplierName || 'â€”'} />
        <DetailItem label="Currency / Unit Cost" value={`${batch.currency || 'â€”'} / ${formatNumber(batch.unitCost)}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="Purchase Order No" value={batch.purchaseOrderNo || 'â€”'} />
        <DetailItem label="GRN No" value={batch.goodsReceivedNoteNo || 'â€”'} />
        <DetailItem label="Updated At" value={formatDate(batch.updatedAt)} />
        <DetailItem label="Received Date" value={formatDate(batch.receivedDate)} />
        <DetailItem label="Manufacture Date" value={formatDate(batch.manufactureDate)} />
        <DetailItem label="Expiry Date" value={formatDate(batch.expiryDate)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Current Quantity Buckets</h2>
        <p className="mt-1 text-sm text-slate-500">Latest batch quantity state after any status changes.</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <DetailItem label="Received Qty" value={formatNumber(quantitySummary.receivedQty)} />
          <DetailItem label="Available Qty" value={formatNumber(quantitySummary.availableQty)} />
          <DetailItem label="Reserved Qty" value={formatNumber(quantitySummary.reservedQty)} />
          <DetailItem label="Blocked Qty" value={formatNumber(quantitySummary.blockedQty)} />
          <DetailItem label="QA Hold Qty" value={formatNumber(quantitySummary.qaHoldQty)} />
          <DetailItem label="Net Qty" value={formatNumber(quantitySummary.netQty)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Location</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DetailItem label="Warehouse Location" value={batch.warehouseLocation || 'â€”'} />
          <DetailItem label="Zone" value={batch.zone || 'â€”'} />
          <DetailItem label="Aisle" value={batch.aisle || 'â€”'} />
          <DetailItem label="Level" value={batch.levelCode || 'â€”'} />
          <DetailItem label="Bin" value={batch.bin || 'â€”'} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
        <div className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          {batch.notes || 'No notes available.'}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Movement Ledger</h2>
          <p className="text-sm text-slate-500">
            Ledger rows reflect the current batch status and quantity buckets returned by the backend.
          </p>
        </div>

        <MovementTable items={movements} />
      </div>
    </div>
  )
}

export default BatchDetailScreen
