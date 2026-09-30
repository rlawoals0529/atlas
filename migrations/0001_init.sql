PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('mouse','mousepad','skate','keyboard','switch')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL,
  msrp_usd REAL,
  summary TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('manufacturer','independent','community','editorial')),
  checked_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS product_sources (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  PRIMARY KEY(product_id, source_id)
);
CREATE TABLE IF NOT EXISTS facts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  value_json TEXT NOT NULL,
  unit TEXT,
  source_id TEXT REFERENCES sources(id),
  confidence TEXT NOT NULL CHECK(confidence IN ('high','medium','low')),
  methodology TEXT,
  measured INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, path, source_id)
);
CREATE VIRTUAL TABLE IF NOT EXISTS product_search USING fts5(slug, brand, model, summary, content='products', content_rowid='rowid');
CREATE TRIGGER IF NOT EXISTS products_ai AFTER INSERT ON products BEGIN
  INSERT INTO product_search(rowid,slug,brand,model,summary) VALUES(new.rowid,new.slug,new.brand,new.model,new.summary);
END;
CREATE TRIGGER IF NOT EXISTS products_ad AFTER DELETE ON products BEGIN
  INSERT INTO product_search(product_search,rowid,slug,brand,model,summary) VALUES('delete',old.rowid,old.slug,old.brand,old.model,old.summary);
END;
CREATE TRIGGER IF NOT EXISTS products_au AFTER UPDATE ON products BEGIN
  INSERT INTO product_search(product_search,rowid,slug,brand,model,summary) VALUES('delete',old.rowid,old.slug,old.brand,old.model,old.summary);
  INSERT INTO product_search(rowid,slug,brand,model,summary) VALUES(new.rowid,new.slug,new.brand,new.model,new.summary);
END;
