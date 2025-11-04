-- Script para crear las tablas de la base de datos docu_flow

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de albaranes
CREATE TABLE IF NOT EXISTS delivery_notes (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  reference VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_date ON invoices(created_date);

CREATE INDEX IF NOT EXISTS idx_delivery_notes_date ON delivery_notes(date);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_status ON delivery_notes(status);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_created_date ON delivery_notes(created_date);
