'use client';

import { useEffect, useMemo, useState } from 'react';
import { inventoryApi } from '@/features/inventory/api';
import type { InventoryItem } from '@/features/inventory/types';

type InventorySummaryMap = Record<
  string,
  {
    inventoryItemId: string;
    sku: string;
    barcode: string;
    name: string;
  }
>;

export function usePurchaseOrderLineInventorySummary(
  lines: Array<{ inventoryItemId: string }>
) {
  const [itemsById, setItemsById] = useState<InventorySummaryMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inventoryItemIds = useMemo(() => {
    return Array.from(
      new Set(
        lines
          .map((line) => String(line.inventoryItemId || '').trim())
          .filter(Boolean)
      )
    );
  }, [lines]);

  useEffect(() => {
    async function load() {
      if (!inventoryItemIds.length) {
        setItemsById({});
        setError(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const results = await Promise.all(
          inventoryItemIds.map(async (inventoryItemId) => {
            try {
              const item = await inventoryApi.getInventoryById(inventoryItemId);
              return item;
            } catch {
              return null;
            }
          })
        );

        const nextMap: InventorySummaryMap = {};

        results.forEach((item) => {
          const row = item as InventoryItem | null;

          if (!row) {
            return;
          }

          nextMap[row.id] = {
            inventoryItemId: row.id,
            sku: row.sku,
            barcode: row.barcode,
            name: row.name
          };
        });

        setItemsById(nextMap);
      } catch (err: any) {
        setItemsById({});
        setError(err?.message || 'Failed to load purchase order line inventory summary');
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [inventoryItemIds.join('|')]);

  return {
    itemsById,
    isLoading,
    error
  };
}