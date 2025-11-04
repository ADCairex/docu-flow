import React from "react";
import { apiClient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Package, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Calendar
} from "lucide-react";
import { format, startOfMonth, eachDayOfInterval, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../components/StatCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiClient.entities.Invoice.list('-created_date'),
    initialData: [],
  });

  const { data: deliveryNotes = [] } = useQuery({
    queryKey: ['deliveryNotes'],
    queryFn: () => apiClient.entities.DeliveryNote.list('-created_date'),
    initialData: [],
  });

  const invoicesPending = invoices.filter(i => i.status === 'pending').length;
  const invoicesProcessed = invoices.filter(i => i.status === 'processed').length;
  const deliveryNotesPending = deliveryNotes.filter(d => d.status === 'pending').length;
  const deliveryNotesProcessed = deliveryNotes.filter(d => d.status === 'processed').length;

  const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const monthlyInvoiceAmount = invoices
    .filter(inv => {
      const invDate = new Date(inv.date);
      const now = new Date();
      return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  // Datos para gráfica de actividad diaria del mes actual
  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const dailyData = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const invoiceCount = invoices.filter(i => i.date === dayStr).length;
    const deliveryNoteCount = deliveryNotes.filter(d => d.date === dayStr).length;
    
    return {
      date: format(day, 'd MMM', { locale: es }),
      facturas: invoiceCount,
      albaranes: deliveryNoteCount,
      total: invoiceCount + deliveryNoteCount
    };
  });

  const statusData = [
    { name: 'Facturas Pendientes', value: invoicesPending, color: '#f59e0b' },
    { name: 'Facturas Procesadas', value: invoicesProcessed, color: '#10b981' },
    { name: 'Albaranes Pendientes', value: deliveryNotesPending, color: '#f97316' },
    { name: 'Albaranes Procesados', value: deliveryNotesProcessed, color: '#06b6d4' }
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Vista general de tus documentos</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Facturas"
            value={invoices.length}
            subtitle={`${invoicesProcessed} procesadas`}
            icon={FileText}
            gradient="from-indigo-500 to-blue-500"
            delay={0.1}
          />
          <StatCard
            title="Total Albaranes"
            value={deliveryNotes.length}
            subtitle={`${deliveryNotesProcessed} procesados`}
            icon={Package}
            gradient="from-purple-500 to-pink-500"
            delay={0.2}
          />
          <StatCard
            title="Pendientes"
            value={invoicesPending + deliveryNotesPending}
            subtitle="Por procesar"
            icon={Clock}
            gradient="from-orange-500 to-red-500"
            delay={0.3}
          />
          <StatCard
            title="Importe Mensual"
            value={`€${monthlyInvoiceAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            subtitle={`Total: €${totalInvoiceAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-500"
            delay={0.4}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Actividad Diaria - {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="facturas" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Facturas"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="albaranes" 
                      stroke="#ec4899" 
                      strokeWidth={3}
                      dot={{ fill: '#ec4899', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Albaranes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Estado de Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      style={{ fontSize: '11px' }}
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    >
                      {statusData.map((entry, index) => (
                        <Bar key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-gray-900">Resumen del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Documentos Creados</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {invoices.filter(i => {
                      const d = new Date(i.created_date);
                      return d.getMonth() === currentMonth.getMonth();
                    }).length + deliveryNotes.filter(d => {
                      const date = new Date(d.created_date);
                      return date.getMonth() === currentMonth.getMonth();
                    }).length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Porcentaje Procesado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(((invoicesProcessed + deliveryNotesProcessed) / 
                      (invoices.length + deliveryNotes.length || 1)) * 100)}%
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Facturación Mensual</p>
                  <p className="text-2xl font-bold text-purple-600">
                    €{monthlyInvoiceAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}