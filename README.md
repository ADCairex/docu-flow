# DocuFlow - Sistema de Gestión de Documentos

Una aplicación web moderna para gestionar facturas y albaranes de forma eficiente.

## 🚀 Características

- ✅ Gestión de facturas
- ✅ Gestión de albaranes
- ✅ Dashboard con estadísticas
- ✅ Gráficos interactivos
- ✅ Almacenamiento local (localStorage)
- ✅ Interfaz moderna y responsive
- ✅ Animaciones suaves

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación

1. Instala las dependencias:

```bash
npm install
```

## 🚀 Ejecutar la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📝 Estructura del Proyecto

```
docu-flow/
├── src/
│   ├── api/
│   │   └── base44Client.js      # Cliente API local (reemplaza Base44)
│   ├── components/
│   │   └── ui/                  # Componentes UI reutilizables
│   ├── Components/
│   │   ├── DeliveryNoteForm.js  # Formulario de albaranes
│   │   ├── InvoiceForm.js       # Formulario de facturas
│   │   └── StatCard.js          # Tarjeta de estadísticas
│   ├── Pages/
│   │   ├── Dashboard.js         # Página principal
│   │   ├── Invoices.js          # Página de facturas
│   │   └── DeliveryNotes.js     # Página de albaranes
│   ├── utils/
│   │   └── index.js             # Utilidades
│   ├── App.jsx                  # Componente principal
│   ├── Layout.js                # Layout de la aplicación
│   ├── index.jsx                # Punto de entrada
│   └── index.css                # Estilos globales
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔄 Cambios Realizados desde Base44

### 1. **API Local**
Se reemplazó el cliente de API de Base44 por un sistema local que usa `localStorage`:
- `src/api/base44Client.js` - Simula las operaciones CRUD de Base44
- Los datos se guardan automáticamente en el navegador

### 2. **Componentes UI**
Se crearon todos los componentes de shadcn/ui necesarios:
- Button, Card, Input, Label, Textarea
- Select, Table, Badge
- Dialog, Alert Dialog, Sidebar

### 3. **Configuración del Proyecto**
- Vite como bundler (más rápido que Create React App)
- TailwindCSS para estilos
- React Router para navegación
- React Query para gestión de estado

## 💾 Almacenamiento de Datos

Los datos se guardan en `localStorage` del navegador:
- `docu-flow-invoices` - Facturas
- `docu-flow-delivery-notes` - Albaranes

Para limpiar los datos, abre la consola del navegador:
```javascript
localStorage.clear()
```

## 🎨 Personalización

### Colores
Modifica los colores en `src/index.css` en la sección `:root`

### Datos de Ejemplo
La función `initializeSampleData()` en `src/api/base44Client.js` crea datos de ejemplo al iniciar.

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
npm install
```

### La aplicación no inicia
Verifica que tienes Node.js 16+ instalado:
```bash
node --version
```

### Los datos no se guardan
Verifica que tu navegador permita `localStorage`

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.
