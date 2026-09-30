-- Expand the optional catalog schema for keyboard and switch records.
-- Safe for existing 0001 databases; analytics storage remains independent.

PRAGMA foreign_keys = OFF;

DROP TRIGGER IF EXISTS products_ai;
DROP TRIGGER IF EXISTS products_ad;
DROP TRIGGER IF EXISTS products_au;

CREATE TABLE products_v2 (
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

INSERT INTO products_v2(id,slug,type,brand,model,status,msrp_usd,summary,payload_json,updated_at)
SELECT id,slug,type,brand,model,status,msrp_usd,summary,payload_json,updated_at FROM products;

DROP TABLE products;
ALTER TABLE products_v2 RENAME TO products;

CREATE TRIGGER products_ai AFTER INSERT ON products BEGIN
  INSERT INTO product_search(rowid,slug,brand,model,summary) VALUES(new.rowid,new.slug,new.brand,new.model,new.summary);
END;
CREATE TRIGGER products_ad AFTER DELETE ON products BEGIN
  INSERT INTO product_search(product_search,rowid,slug,brand,model,summary) VALUES('delete',old.rowid,old.slug,old.brand,old.model,old.summary);
END;
CREATE TRIGGER products_au AFTER UPDATE ON products BEGIN
  INSERT INTO product_search(product_search,rowid,slug,brand,model,summary) VALUES('delete',old.rowid,old.slug,old.brand,old.model,old.summary);
  INSERT INTO product_search(rowid,slug,brand,model,summary) VALUES(new.rowid,new.slug,new.brand,new.model,new.summary);
END;

INSERT INTO product_search(product_search) VALUES('rebuild');

PRAGMA foreign_keys = ON;
