# Migration Reconciliation Notes

## Purpose
This file records the difference between:
- migration files in database/migrations
- actual tables in smartops_platform database

## Current reality
Some tables were created or stabilized manually during development.

## Known manual / recovery-created areas to verify
- product_uom_conversions
- stock_movements
- inventory_adjustments
- inventory_write_offs
- supplier_quotations
- supplier_invoices
- supplier_credit_notes
- returns

## Required cleanup tasks
- confirm migration files match actual schema
- do not keep editing old migration history repeatedly
- prefer one new reconciliation migration for drift
- test fresh DB rebuild from zero

## Rule going forward
- stop manually creating tables unless emergency
- all future schema changes should go through migration files first
- if emergency SQL is used, immediately record it here and backfill a migration file
