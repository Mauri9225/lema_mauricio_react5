/*import reminderService from "./services/mockReminderService"*/
import { useEffect, useState } from "react";
import { reminderService } from "./services/api";

import ReminderForm from "./components/ReminderForm";
import Alert from "./components/Alert";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // 🔄 Cargar recordatorios
  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const response = await reminderService.getAll();
      setReminders(response.data || []);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Error al cargar los recordatorios",
      });
    } finally {
      setLoading(false);
    }
  };

  // 💾 Crear / actualizar
  const handleSaveReminder = async (data) => {
    try {
      if (selectedReminder) {
        await reminderService.update(selectedReminder.id, data);
        setAlert({ type: "success", message: "Recordatorio actualizado" });
      } else {
        await reminderService.create(data);
        setAlert({ type: "success", message: "Recordatorio creado" });
      }

      setShowForm(false);
      setSelectedReminder(null);
      loadReminders();
    } catch (error) {
      setAlert({
        type: "error",
        message: "No se pudo guardar el recordatorio",
      });
    }
  };

  // ✏️ Editar
  const handleEdit = (reminder) => {
    setSelectedReminder(reminder);
    setShowForm(true);
  };

  // 🗑️ Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este recordatorio?")) return;

    try {
      await reminderService.delete(id);
      setAlert({ type: "success", message: "Recordatorio eliminado" });
      loadReminders();
    } catch (error) {
      setAlert({
        type: "error",
        message: "No se pudo eliminar el recordatorio",
      });
    }
  };

  // ❌ Cancelar formulario
  const handleCancel = () => {
    setShowForm(false);
    setSelectedReminder(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* ALERTA */}
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />

        {/* HEADER */}
        <header className="flex justify-between items-center mb-6 bg-white px-6 py-4 rounded-xl shadow">
  <h1 className="text-xl font-bold text-purple-700">
    Gestión de Recordatorios
  </h1>

  {!showForm && (
    <button
      onClick={() => setShowForm(true)}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      + Nuevo Recordatorio
    </button>
  )}
</header>


        {/* CONTENIDO */}
        <main>
          {loading && <LoadingSpinner />}

          {/* FORMULARIO */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
    
    {/* Fondo oscuro */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={handleCancel}
    ></div>

    {/* Formulario centrado */}
    <div className="relative z-10 w-full max-w-lg">
              <ReminderForm
                onSubmit={handleSaveReminder}
                onCancel={handleCancel}
                initialData={selectedReminder}
              />
            </div>
            </div>
          )}

          {/* LISTA */}
          {!loading && reminders.length === 0 && (
            <p className="text-center text-gray-500">
              No hay recordatorios registrados
            </p>
          )}
  {/* ENCABEZADOS */}
<div className="grid grid-cols-6 gap-4 bg-gray-100 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 mb-2">
  <span>Título</span>
  <span>Descripción</span>
  <span>Vencimiento</span>
  <span>Prioridad</span>
  <span>Estado</span>
  <span>Acción</span>
</div>
          <ul className="space-y-4">
            {reminders.map((reminder) => (
              
                <li className="grid grid-cols-6 gap-4 bg-white p-4 rounded-lg shadow items-center text-sm">

      
                  {/* DATOS */}
  <span className="font-medium">{reminder.title}</span>
  <span>{reminder.description}</span>
  <span>
  {reminder.dueDate && !isNaN(new Date(reminder.dueDate))
    ? new Date(reminder.dueDate).toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sin fecha"}
</span>



  <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">
    {reminder.priority}
  </span>

  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
    {reminder.status}
  </span>

  <div className="flex gap-2">
    <button onClick={() => handleEdit(reminder)}>✏️</button>
    <button onClick={() => handleDelete(reminder.id)}>🗑️</button>
  </div>
</li>

            ))}
          </ul>
        </main>

        {/* FOOTER */}
        <footer className="mt-10 border-t pt-4 text-center text-sm text-gray-500">
          © 2026 Pontificia Universidad Católica del Ecuador
        </footer>
      </div>
    </div>
  );
}

export default App;
