-- Optional Atlas first-party product analytics.
-- This migration is inert unless a D1 database is bound as ANALYTICS_DB.
-- Synthetic/demo events are never inserted into this table.

CREATE TABLE IF NOT EXISTS analytics_events (
  event_id TEXT PRIMARY KEY,
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  event_name TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  segment_json TEXT,
  properties_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at
  ON analytics_events(occurred_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_time
  ON analytics_events(event_name, occurred_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_time
  ON analytics_events(session_id, occurred_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_time
  ON analytics_events(visitor_id, occurred_at);
