import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'docu_flow',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Configurar rutas API
export function setupApiRoutes(app) {

  // ==================== FACTURAS ====================
  
  app.get('/api/invoices', async (req, res) => {
    try {
      const { orderBy = '-created_date' } = req.query;
      const isDescending = orderBy.startsWith('-');
      const field = isDescending ? orderBy.substring(1) : orderBy;
      const order = isDescending ? 'DESC' : 'ASC';

      const result = await pool.query(
        `SELECT * FROM invoices ORDER BY ${field} ${order}`
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      res.status(500).json({ error: 'Error al obtener facturas' });
    }
  });

  app.get('/api/invoices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Factura no encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener factura:', error);
      res.status(500).json({ error: 'Error al obtener factura' });
    }
  });

  app.post('/api/invoices', async (req, res) => {
    try {
      const { customer_name, date, amount, status, description } = req.body;
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const created_date = new Date().toISOString();

      const result = await pool.query(
        `INSERT INTO invoices (id, customer_name, date, amount, status, description, created_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [id, customer_name, date, amount, status, description, created_date]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear factura:', error);
      res.status(500).json({ error: 'Error al crear factura' });
    }
  });

  app.put('/api/invoices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { customer_name, date, amount, status, description } = req.body;

      const result = await pool.query(
        `UPDATE invoices 
         SET customer_name = $1, date = $2, amount = $3, status = $4, description = $5
         WHERE id = $6
         RETURNING *`,
        [customer_name, date, amount, status, description, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Factura no encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      res.status(500).json({ error: 'Error al actualizar factura' });
    }
  });

  app.delete('/api/invoices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Factura no encontrada' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      res.status(500).json({ error: 'Error al eliminar factura' });
    }
  });

  // ==================== ALBARANES ====================

  app.get('/api/delivery-notes', async (req, res) => {
    try {
      const { orderBy = '-created_date' } = req.query;
      const isDescending = orderBy.startsWith('-');
      const field = isDescending ? orderBy.substring(1) : orderBy;
      const order = isDescending ? 'DESC' : 'ASC';

      const result = await pool.query(
        `SELECT * FROM delivery_notes ORDER BY ${field} ${order}`
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener albaranes:', error);
      res.status(500).json({ error: 'Error al obtener albaranes' });
    }
  });

  app.get('/api/delivery-notes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM delivery_notes WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Albarán no encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener albarán:', error);
      res.status(500).json({ error: 'Error al obtener albarán' });
    }
  });

  app.post('/api/delivery-notes', async (req, res) => {
    try {
      const { customer_name, date, reference, status, notes } = req.body;
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const created_date = new Date().toISOString();

      const result = await pool.query(
        `INSERT INTO delivery_notes (id, customer_name, date, reference, status, notes, created_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [id, customer_name, date, reference, status, notes, created_date]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear albarán:', error);
      res.status(500).json({ error: 'Error al crear albarán' });
    }
  });

  app.put('/api/delivery-notes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { customer_name, date, reference, status, notes } = req.body;

      const result = await pool.query(
        `UPDATE delivery_notes 
         SET customer_name = $1, date = $2, reference = $3, status = $4, notes = $5
         WHERE id = $6
         RETURNING *`,
        [customer_name, date, reference, status, notes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Albarán no encontrado' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar albarán:', error);
      res.status(500).json({ error: 'Error al actualizar albarán' });
    }
  });

  app.delete('/api/delivery-notes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM delivery_notes WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Albarán no encontrado' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error al eliminar albarán:', error);
      res.status(500).json({ error: 'Error al eliminar albarán' });
    }
  });

  console.log('✅ Rutas API configuradas en /api/*');
}
