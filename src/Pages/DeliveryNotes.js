import React, { useState } from "react";
import { apiClient } from "@/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DeliveryNoteForm from "../Components/DeliveryNoteForm";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeliveryNotes() {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: deliveryNotes = [], isLoading } = useQuery({
    queryKey: ['deliveryNotes'],
    queryFn: () => apiClient.entities.DeliveryNote.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.DeliveryNote.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] });
      setShowForm(false);
      setEditingNote(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.DeliveryNote.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] });
      setShowForm(false);
      setEditingNote(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.DeliveryNote.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] });
      setDeletingId(null);
    },
  });

  const handleSave = (data) => {
    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      processed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
    };
    const labels = {
      pending: "Pendiente",
      processed: "Procesado"
    };
    return (
      <Badge className={`${styles[status]} font-medium`}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Package className="w-8 h-8 text-purple-600" />
              Albaranes
            </h1>
            <p className="text-gray-600">Gestiona todos tus albaranes</p>
          </div>
          <Button
            onClick={() => {
              setEditingNote(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Albarán
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-gray-900">
                Lista de Albaranes ({deliveryNotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Cliente</TableHead>
                      <TableHead className="font-semibold">Fecha</TableHead>
                      <TableHead className="font-semibold">Referencia</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            Cargando...
                          </TableCell>
                        </TableRow>
                      ) : deliveryNotes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No hay albaranes. ¡Crea tu primer albarán!
                          </TableCell>
                        </TableRow>
                      ) : (
                        deliveryNotes.map((note, index) => (
                          <motion.tr
                            key={note.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b hover:bg-purple-50/50 transition-colors"
                          >
                            <TableCell className="font-mono text-sm text-gray-600">
                              #{note.id.slice(-6)}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {note.customer_name}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {format(new Date(note.date), "d 'de' MMMM, yyyy", { locale: es })}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-600">
                              {note.reference}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(note.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(note)}
                                  className="hover:bg-purple-100"
                                >
                                  <Edit2 className="w-4 h-4 text-purple-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingId(note.id)}
                                  className="hover:bg-red-100"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <DeliveryNoteForm
          deliveryNote={editingNote}
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingNote(null);
          }}
          onSave={handleSave}
        />

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El albarán será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
