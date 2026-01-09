/*import reminderService from "./services/mockReminderService"*/
import { useState, useEffect } from 'react';
import { reminderService } from './services/api';
import ReminderForm from './components/ReminderForm';
import Alert from './components/Alert';
import LoadingSpinner from './components/LoadingSpinner';

// --- HELPERS PARA BADGES (Lo que te envié antes) ---

const getTemporalBadge = (dueAt, status) => {
  if (status !== 'PENDING') return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">Normal</span>;

  const dueDate = new Date(dueAt);
  const now = new Date();
  const diffDays = (dueDate - now) / (1000 * 60 * 60 * 24);

  if (dueDate < now) {
    return <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 font-bold">Vencido</span>;
  } else if (diffDays <= 7) {
    return <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 font-bold">Próximo</span>;
  }
  return <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">Normal</span>;
};

const priorityStyles = {
  LOW: 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200',
  HIGH: 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200',
};

const statusStyles = {
  PENDING: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200',
  DONE: 'bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200',
  CANCELED: 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200',
};

// --- COMPONENTE PRINCIPAL ---

const App = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadReminders();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const loadReminders = async () => {
    setLoading(true);
    try {
      const { data } = await reminderService.getAll();
      setReminders(data);
    } catch (err) {
      showAlert('error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este recordatorio?')) return;
    try {
      await reminderService.delete(id);
      showAlert('success', 'Recordatorio eliminado');
      loadReminders();
    } catch (err) {
      showAlert('error', 'No se pudo eliminar');
    }
  };

const handleSubmit = async (formData) => {
  setLoading(true);
  try {
    // FORMATEO DE DATOS: El backend exige ISO 8601
    const payload = {
      title: formData.title,
      description: formData.description,
      due_at: new Date(formData.due_at).toISOString(), // Formato requerido
      priority: formData.priority,
      status: formData.status
    };

    if (editingReminder) {
      await reminderService.update(editingReminder.id, payload);
      showAlert('success', '¡Recordatorio actualizado con éxito!');
    } else {
      await reminderService.create(payload);
      showAlert('success', '¡Recordatorio creado con éxito!');
    }
    
    setIsModalOpen(false);
    setEditingReminder(null);
    loadReminders(); // Recargar la lista
    
  } catch (err) {
    // Capturamos el error 400 y mostramos el mensaje del servidor
    const serverMessage = err.response?.data?.message || 'Error en los datos. Revisa el formato.';
    showAlert('error', serverMessage);
    console.error("Detalles del error 400:", err.response?.data);
  } finally {
    setLoading(false);
  }
};

const handleEdit = (reminder) => {
  setEditingReminder(reminder);
  setIsModalOpen(true);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <Alert {...alert} onClose={() => setAlert({ type: '', message: '' })} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Gestor de Recordatorios</h1>
            
          </div>
          <button 
            onClick={() => { setEditingReminder(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            + Nuevo Recordatorio
          </button>
        </header>

        {/* Tabla de Datos */}
        <main className="bg-white rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="py-20"><LoadingSpinner /></div>
          ) : reminders.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 mb-4 text-lg">No hay recordatorios pendientes</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Crea el primero ahora
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <table className="w-full text-left border-collapse">
   
   {/*Enunciados*/}
    <thead>
      <tr className="bg-gray-50 border-b border-gray-100">
        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Título</th>
        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Descripción</th>
        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vencimiento</th>
        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prioridad</th>
        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {reminders.map(r => (
        <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
          <td className="p-4">{getTemporalBadge(r.due_at, r.status)}</td>
          <td className="p-4 font-bold text-gray-700 text-sm">{r.title}</td>
          <td className="p-4 text-gray-500 text-sm truncate max-w-[200px]">{r.description || '-'}</td>
          <td className="p-4 text-gray-600 text-sm">{new Date(r.due_at).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          <td className="p-4"><span className={priorityStyles[r.priority]}>{r.priority}</span></td>
          <td className="p-4"><span className={statusStyles[r.status]}>{r.status}</span></td>
          <td className="p-4">
            <div className="flex gap-2">

              {/*Botones de edición y eliminación*/}
              <button onClick={() => handleEdit(r)} className="text-indigo-400 hover:text-indigo-600">✎</button>
              <button onClick={() => handleDelete(r.id)} className="text-red-300 hover:text-red-500">✕</button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          )}
        </main>

        {/* FOOTER*/}
        <footer className="mt-16 text-center text-gray-400 text-xs font-medium pb-10">
          © 2026 PUCE - Mauricio Lema
        </footer>
      
      </div>

      

      {/* Modal de Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-8 text-gray-400 hover:text-indigo-600 transition-colors text-2xl font-light"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingReminder ? 'Actualizar' : 'Recordatorio'}
            </h2>
            <ReminderForm 
              reminder={editingReminder} 
              onSubmit={handleSubmit} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;