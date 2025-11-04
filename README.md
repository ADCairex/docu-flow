# DocuFlow - Sistema de Gestión de Documentos

Una aplicación web moderna para gestionar facturas y albaranes con PostgreSQL y API Routes integradas en Vite.

## 🚀 Características

- ✅ Gestión de facturas y albaranes
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gráficos interactivos con Recharts
- ✅ Base de datos PostgreSQL con Docker
- ✅ API REST integrada en Vite (sin servidor separado)
- ✅ Interfaz moderna con TailwindCSS y shadcn/ui
- ✅ Animaciones suaves con Framer Motion
- ✅ Adminer incluido para gestión visual de la BD

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- Docker y Docker Compose
- npm o yarn

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/ADCairex/docu-flow.git
cd docu-flow
npm install
```

### 2. Iniciar PostgreSQL con Docker

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto **5433** (para evitar conflictos con instalaciones locales)
- Adminer en el puerto **8080** (gestor visual de BD)

Verificar que está corriendo:
```bash
docker-compose ps
```

### 3. Crear las tablas de la base de datos

**Opción A: Usando Adminer (Recomendado)**

1. Abre http://localhost:8080
2. Conéctate con:
   - Sistema: `PostgreSQL`
   - Servidor: `postgres`
   - Usuario: `postgres`
   - Contraseña: `postgres`
   - Base de datos: `docu_flow`
3. Ve a "SQL command"
4. Copia y pega el contenido de `database/schema.sql`
5. Ejecuta

**Opción B: Desde la terminal**

```bash
docker exec -i docu-flow-postgres psql -U postgres -d docu_flow < database/schema.sql
```

### 4. Configurar variables de entorno (Opcional)

El archivo `.env` ya está configurado para Docker. Si necesitas cambiar algo:

```bash
cp .env.example .env
# Edita .env si es necesario
```

## 🚀 Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Adminer** (Gestor BD): http://localhost:8080
- **API**: http://localhost:5173/api/*

La API REST está integrada en el mismo servidor de Vite, no necesitas servidor separado.

## 📦 Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`

Para producción, necesitarás configurar un servidor Node.js separado o usar el archivo `vite.config.js` como base.

## 📝 Estructura del Proyecto

```
docu-flow/
├── database/
│   ├── schema.sql               # Script SQL para crear tablas
│   └── README.md                # Guía para gestionar la BD
├── src/
│   ├── server/
│   │   └── api.js               # API Routes (como Next.js)
│   ├── api/
│   │   └── apiClient.js         # Cliente HTTP para el frontend
│   ├── components/
│   │   └── ui/                  # Componentes shadcn/ui
│   ├── Components/
│   │   ├── DeliveryNoteForm.js  # Formulario de albaranes
│   │   ├── InvoiceForm.js       # Formulario de facturas
│   │   └── StatCard.js          # Tarjetas de estadísticas
│   ├── Pages/
│   │   ├── Dashboard.js         # Dashboard con gráficos
│   │   ├── Invoices.js          # Gestión de facturas
│   │   └── DeliveryNotes.js     # Gestión de albaranes
│   ├── utils/
│   │   └── index.js             # Funciones auxiliares
│   ├── App.jsx                  # App principal con routing
│   ├── Layout.js                # Layout con sidebar
│   ├── index.jsx                # Punto de entrada
│   └── index.css                # Estilos globales
├── docker-compose.yml           # PostgreSQL + Adminer
├── .env                         # Variables de entorno
├── package.json
├── vite.config.js               # Config con API Routes
└── tailwind.config.js
```

## �️ Esquema de Base de Datos

### Tabla: invoices
- `id` - Identificador único
- `customer_name` - Nombre del cliente
- `date` - Fecha de la factura
- `amount` - Importe (DECIMAL)
- `status` - Estado (pending/processed)
- `description` - Descripción
- `created_date` - Fecha de creación

### Tabla: delivery_notes
- `id` - Identificador único
- `customer_name` - Nombre del cliente
- `date` - Fecha del albarán
- `reference` - Referencia única
- `status` - Estado (pending/processed)
- `notes` - Notas adicionales
- `created_date` - Fecha de creación

## 🔌 API Endpoints

Todas las rutas están bajo `/api/*`:

### Facturas
- `GET /api/invoices?orderBy=-created_date` - Listar
- `GET /api/invoices/:id` - Obtener una
- `POST /api/invoices` - Crear
- `PUT /api/invoices/:id` - Actualizar
- `DELETE /api/invoices/:id` - Eliminar

### Albaranes
- `GET /api/delivery-notes?orderBy=-created_date` - Listar
- `GET /api/delivery-notes/:id` - Obtener uno
- `POST /api/delivery-notes` - Crear
- `PUT /api/delivery-notes/:id` - Actualizar
- `DELETE /api/delivery-notes/:id` - Eliminar

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend**: Express integrado en Vite
- **Database**: PostgreSQL 15
- **Container**: Docker + Docker Compose

## 🐛 Solución de Problemas

### Puerto 5432 ocupado
Si el puerto está en uso, el `docker-compose.yml` ya usa el puerto 5433. Verifica `.env`:
```env
DB_PORT=5433
```

### Error de conexión a PostgreSQL
Verifica que Docker está corriendo:
```bash
docker-compose ps
docker-compose logs postgres
```

### Las tablas no existen
Ejecuta el script de creación:
```bash
docker exec -i docu-flow-postgres psql -U postgres -d docu_flow < database/schema.sql
```

### Error 404 en las rutas /api/*
Reinicia el servidor de desarrollo y borra la caché:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Error al instalar dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentación Adicional

- [Configuración de Docker](./DOCKER.md)
- [Gestión de Base de Datos](./database/README.md)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.
