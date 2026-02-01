import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([
    { id: 1, name: 'Miguel Gonzalez', date: '2025-10-08', entry: '09:00', exit: '18:00' },
    { id: 2, name: 'Ana Carvajal', date: '2025-10-08', entry: '08:30', exit: '17:30' },
    { id: 3, name: 'Carlos Mendoza', date: '2025-10-08', entry: '10:00', exit: '19:00' },
    { id: 4, name: 'Laura Pérez', date: '2025-10-08', entry: '09:15', exit: '18:15' },
    { id: 5, name: 'Diego López', date: '2025-10-08', entry: '08:00', exit: '17:00' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    entry: '',
    exit: ''
  });

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name,
      date: entry.date,
      entry: entry.entry,
      exit: entry.exit
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta entrada?')) {
      setAttendance(prev => prev.filter(e => e.id !== id));
      toast.success('Entrada eliminada');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.date || !formData.entry || !formData.exit) {
      toast.error('Completa todos los campos');
      return;
    }

    if (editingEntry) {
      setAttendance(prev => prev.map(e =>
        e.id === editingEntry.id ? { ...e, ...formData } : e
      ));
      toast.success('Entrada actualizada');
    } else {
      const newEntry = {
        id: Date.now(),
        ...formData
      };
      setAttendance(prev => [...prev, newEntry]);
      toast.success('Nueva entrada agregada');
    }

    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({ name: '', date: '', entry: '', exit: '' });
  };

  const handleExport = () => {
    console.log('Exportar datos');
    toast.success('Datos exportados (simulado)');
  };

  const handleImport = () => {
    console.log('Importar datos');
    toast.info('Función de importación (placeholder)');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Asistencia</h1>
        <p className="text-gray-600">Control de asistencia del personal • {attendance.length} registros hoy</p>
      </div>

      {/* Botones de acción */}
      <Card className="mb-6">
        <CardContent className="p-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2">
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button onClick={handleImport} variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importar
            </Button>
          </div>
          <Button onClick={() => { setEditingEntry(null); setFormData({ name: '', date: '', entry: '', exit: '' }); setIsModalOpen(true); }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Entrada
          </Button>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Nombre</th>
                  <th className="text-left p-4 font-medium">Fecha</th>
                  <th className="text-left p-4 font-medium">Hora Entrada</th>
                  <th className="text-left p-4 font-medium">Hora Salida</th>
                  <th className="text-left p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{entry.name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{entry.entry}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{entry.exit}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(entry)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingEntry ? 'Editar Entrada' : 'Nueva Entrada'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fecha</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hora Entrada</label>
                <Input
                  type="time"
                  value={formData.entry}
                  onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hora Salida</label>
                <Input
                  type="time"
                  value={formData.exit}
                  onChange={(e) => setFormData({ ...formData, exit: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingEntry ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
