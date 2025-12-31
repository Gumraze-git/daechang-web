-- Migration: Add features column to products table
alter table products add column if not exists features jsonb default '[]'::jsonb;
