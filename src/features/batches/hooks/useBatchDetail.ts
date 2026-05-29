'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  h10aGetBatchDetail,
  h10aGetBatchMovements,
  h10aUpdateBatchStatus,
  type H10ABatchDetail,
  type H10ABatchStatus,
  type H10AStockMovementRecord
} from '../api'

export interface UseBatchDetailResult {
  batchId: string
  batch: H10ABatchDetail | null
  item: H10ABatchDetail | null
  movements: H10AStockMovementRecord[]
  isLoading: boolean
  isRefreshing: boolean
  isUpdatingStatus: boolean
  error: string | null
  statusError: string | null
  refresh: () => Promise<void>
  refetch: () => Promise<void>
  updateStatus: (nextStatus: H10ABatchStatus, statusNote?: string) => Promise<H10ABatchDetail | null>
  quantitySummary: {
    receivedQty: number
    availableQty: number
    reservedQty: number
    blockedQty: number
    qaHoldQty: number
    netQty: number
  }
}

function toSafeNumber(value: unknown) {
  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0
  }

  return parsed
}

export function useBatchDetail(batchId?: string): UseBatchDetailResult {
  const resolvedBatchId = String(batchId ?? '').trim()

  const [batch, setBatch] = useState<H10ABatchDetail | null>(null)
  const [movements, setMovements] = useState<H10AStockMovementRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  const load = useCallback(
    async (mode: 'initial' | 'refresh' = 'refresh') => {
      if (!resolvedBatchId) {
        setBatch(null)
        setMovements([])
        setError('Batch id is required')
        setIsLoading(false)
        setIsRefreshing(false)
        return
      }

      if (mode === 'initial') {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      setError(null)

      try {
        const [batchDetail, batchMovements] = await Promise.all([
          h10aGetBatchDetail(resolvedBatchId),
          h10aGetBatchMovements(resolvedBatchId)
        ])

        setBatch(batchDetail)
        setMovements(batchMovements)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load batch detail'
        setError(message)
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [resolvedBatchId]
  )

  useEffect(() => {
    void load('initial')
  }, [load])

  const updateStatus = useCallback(
    async (nextStatus: H10ABatchStatus, statusNote = '') => {
      if (!resolvedBatchId) {
        return null
      }

      setIsUpdatingStatus(true)
      setStatusError(null)

      try {
        const updatedBatch = await h10aUpdateBatchStatus(resolvedBatchId, {
          batchStatus: nextStatus,
          statusNote
        })

        setBatch(updatedBatch)

        const batchMovements = await h10aGetBatchMovements(resolvedBatchId)
        setMovements(batchMovements)

        return updatedBatch
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update batch status'
        setStatusError(message)
        throw err
      } finally {
        setIsUpdatingStatus(false)
      }
    },
    [resolvedBatchId]
  )

  const quantitySummary = useMemo(() => {
    const receivedQty = toSafeNumber(batch?.receivedQty)
    const availableQty = toSafeNumber(batch?.availableQty)
    const reservedQty = toSafeNumber(batch?.reservedQty)
    const blockedQty = toSafeNumber(batch?.blockedQty)
    const qaHoldQty = toSafeNumber(batch?.qaHoldQty)

    const bucketTotal = availableQty + reservedQty + blockedQty + qaHoldQty

    return {
      receivedQty,
      availableQty,
      reservedQty,
      blockedQty,
      qaHoldQty,
      netQty: bucketTotal > 0 ? bucketTotal : receivedQty
    }
  }, [batch])

  const refresh = useCallback(async () => {
    await load('refresh')
  }, [load])

  return {
    batchId: resolvedBatchId,
    batch,
    item: batch,
    movements,
    isLoading,
    isRefreshing,
    isUpdatingStatus,
    error,
    statusError,
    refresh,
    refetch: refresh,
    updateStatus,
    quantitySummary
  }
}

export default useBatchDetail
