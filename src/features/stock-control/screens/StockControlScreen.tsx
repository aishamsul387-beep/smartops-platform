'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { stockControlApi } from '../api';
import { useStockControl } from '../hooks/useStockControl';

function getSeverityStyle(severity: string) {
  if (severity === 'high') {
    return {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    };
  }

  if (severity === 'medium') {
    return {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    };
  }

  return {
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0'
  };
}

function getPriorityStyle(priority: string) {
  if (priority === 'critical') {
    return {
      background: '#991b1b',
      color: '#ffffff'
    };
  }

  if (priority === 'high') {
    return {
      background: '#dc2626',
      color: '#ffffff'
    };
  }

  if (priority === 'medium') {
    return {
      background: '#f59e0b',
      color: '#111827'
    };
  }

  return {
    background: '#10b981',
    color: '#ffffff'
  };
}

function getTrendStyle(trend: string) {
  if (trend === 'rising') {
    return { color: '#dc2626', fontWeight: 700 };
  }

  if (trend === 'falling') {
    return { color: '#2563eb', fontWeight: 700 };
  }

  return { color: '#166534', fontWeight: 700 };
}

function getQueueStatusStyle(status: string) {
  if (status === 'immediate') {
    return {
      background: '#991b1b',
      color: '#ffffff'
    };
  }

  if (status === 'this_week') {
    return {
      background: '#f59e0b',
      color: '#111827'
    };
  }

  return {
    background: '#10b981',
    color: '#ffffff'
  };
}

function getSupplierSourceLabel(source: string) {
  if (source === 'inventory_master') return 'Inventory Master';
  if (source === 'batch_history') return 'Batch History';
  return 'Unassigned';
}

function getItemTypeLabel(value: string) {
  if (value === 'raw_material') return 'Raw Material';
  if (value === 'finished_goods') return 'Finished Goods';
  if (value === 'packaging') return 'Packaging';
  if (value === 'spare_part') return 'Spare Part';
  if (value === 'consumable') return 'Consumable';
  return value || '-';
}

function formatMoney(value: number, currency: string) {
  return `${currency || 'USD'} ${Number(value || 0).toFixed(2)}`;
}

export function StockControlScreen() {
  const router = useRouter();
  const { summary, alerts, reorderSuggestions, procurementActions, isLoading, error, refresh } =
    useStockControl();

  const [creatingPoFor, setCreatingPoFor] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleCreateDraftPo(inventoryItemId: string) {
    try {
      setCreatingPoFor(inventoryItemId);
      setActionError(null);

      const result = await stockControlApi.createDraftPurchaseOrderFromSuggestion(inventoryItemId);
      router.push(`/orders/purchase-orders/${result.purchaseOrder.id}`);
      router.refresh();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to create draft purchase order');
    } finally {
      setCreatingPoFor(null);
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
              Stock Control / Forecasting
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Planning now supports draft PO creation directly from procurement actions using
              supplier, quantity, and cost data from Inventory Master and planning logic.
            </div>
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
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#64748b' }}>Loading stock control summary...</div>
      ) : error ? (
        <div style={{ color: '#b91c1c' }}>{error}</div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              marginBottom: '24px'
            }}
          >
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Total Items</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.totalItems}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>On Hand Qty</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.totalOnHandQty}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Due Today</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.procurementDueToday}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Due This Week</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.procurementDueThisWeek}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Planned Procurement Value</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>
                {formatMoney(summary.plannedProcurementValue, summary.planningCurrency)}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Urgent Procurement Value</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>
                {formatMoney(summary.urgentProcurementValue, summary.planningCurrency)}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Critical Reorders</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.criticalReorderCount}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>High Reorders</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.highReorderCount}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Rising Demand</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.risingDemandItems}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Expiring Soon</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.expiringSoonBatches}</div>
            </div>
          </div>

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
              Procurement Action Queue
            </div>

            {actionError ? (
              <div
                style={{
                  margin: '0 20px 16px 20px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca'
                }}
              >
                {actionError}
              </div>
            ) : null}

            {procurementActions.length === 0 ? (
              <div style={{ padding: '24px', color: '#64748b' }}>No procurement actions found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Item</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Cost Basis</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Suggested Qty</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Est. Value</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Reorder By</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Queue Status</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procurementActions.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                          {item.itemCode} - {item.itemName}
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>
                            {getItemTypeLabel(item.itemType)}
                          </div>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <div>{item.preferredSupplierName}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>
                            Source: {getSupplierSourceLabel(item.supplierSource)} Â· Score {item.supplierScore}
                          </div>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          {formatMoney(item.standardCost, item.currency)}
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.suggestedOrderQty}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          {formatMoney(item.estimatedOrderValue, item.currency)}
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          {item.reorderByDate}
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{item.leadTimeDays}d lead time</div>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '6px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 700,
                              ...getQueueStatusStyle(item.queueStatus)
                            }}
                          >
                            {item.queueStatus}
                          </span>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{item.procurementAction}</div>
                            <button
                              type="button"
                              disabled={creatingPoFor === item.inventoryItemId}
                              onClick={() => void handleCreateDraftPo(item.inventoryItemId)}
                              style={{
                                padding: '8px 10px',
                                borderRadius: '8px',
                                border: 'none',
                                background: creatingPoFor === item.inventoryItemId ? '#94a3b8' : '#0f172a',
                                color: '#ffffff',
                                fontWeight: 600,
                                cursor: creatingPoFor === item.inventoryItemId ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {creatingPoFor === item.inventoryItemId ? 'Creating...' : 'Create Draft PO'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

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
              Reorder Suggestions
            </div>

            {reorderSuggestions.length === 0 ? (
              <div style={{ padding: '24px', color: '#64748b' }}>No reorder suggestions found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Item</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Trend</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Current Qty</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Suggested Order</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Cost / Value</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>30/60/90 Forecast</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Reorder By</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Action</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reorderSuggestions.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                          {item.itemCode} - {item.itemName}
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>
                            {getItemTypeLabel(item.itemType)}
                          </div>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <div>{item.preferredSupplierName}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>
                            Source: {getSupplierSourceLabel(item.supplierSource)} Â· Score {item.supplierScore}
                          </div>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <span style={getTrendStyle(item.demandTrend)}>{item.demandTrend}</span>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.currentQty}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.suggestedOrderQty}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <div>{formatMoney(item.standardCost, item.currency)}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>
                            Est: {formatMoney(item.estimatedReorderValue, item.currency)}
                          </div>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          {item.forecastDemand30d} / {item.forecastDemand60d} / {item.forecastDemand90d}
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          {item.reorderByDate}
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{item.leadTimeDays}d lead time</div>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.procurementAction}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '6px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 700,
                              ...getPriorityStyle(item.priority)
                            }}
                          >
                            {item.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
              Reorder Risk Notes
            </div>

            {reorderSuggestions.length === 0 ? (
              <div style={{ color: '#64748b' }}>No reorder notes available.</div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {reorderSuggestions.map((item) => (
                  <div
                    key={`${item.id}-note`}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px'
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                      {item.itemCode} - {item.itemName}
                    </div>
                    <div style={{ color: '#475569', marginBottom: '6px' }}>{item.riskNote}</div>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>
                      Supplier: <strong>{item.preferredSupplierName}</strong> ({getSupplierSourceLabel(item.supplierSource)}) Â·
                      Monthly usage est.: <strong>{item.monthlyUsageEstimate}</strong> Â·
                      Days of cover: <strong>{item.estimatedDaysOfCover}</strong> Â·
                      Estimated reorder value: <strong>{formatMoney(item.estimatedReorderValue, item.currency)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '20px', fontSize: '22px', fontWeight: 700 }}>
              Alerts
            </div>

            {alerts.length === 0 ? (
              <div style={{ padding: '24px', color: '#64748b' }}>No alerts found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Severity</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Title</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Message</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Reference</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert.id}>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>{alert.alertType}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '6px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 700,
                              ...getSeverityStyle(alert.severity)
                            }}
                          >
                            {alert.severity}
                          </span>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{alert.title}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{alert.message}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          {alert.referenceType} / {alert.referenceId}
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{alert.dueDate || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}