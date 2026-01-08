import { useEffect, useState } from "react"
import reminderService from "./services/mockReminderService"
/*import reminderService from "./services/reminderService"*/
import ReminderForm from "./components/ReminderForm"
import ReminderList from "./components/ReminderList"
import Button from "./components/Button"
import Modal from "./components/Modal"

function App() {
  const [reminders, setReminders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 🔄 Cargar recordatorios al iniciar
  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await reminderService.getAll()
      setReminders(response.data)
    } catch (err) {
      setError("Error al cargar los recordatorios")
    } finally {
      setLoading(false)
    }
  }

  // 💾 Crear o actualizar recordatorio
  const handleSaveReminder = async (data) => {
    try {
      if (selectedReminder) {
        await reminderService.update(selectedReminder.id, data)
      } else {
        await reminderService.create(data)
      }

      await loadReminders()
      setShowForm(false)
      setSelectedReminder(null)
    } catch (err) {
      setError("No se pudo guardar el recordatorio")
    }
  }

  // ✏️ Editar
  const handleEdit = (reminder) => {
    setSelectedReminder(reminder)
    setShowForm(true)
  }

  // 🗑️ Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este recordatorio?")) return

    try {
      await reminderService.delete(id)
      await loadReminders()
    } catch (err) {
      setError("No se pudo eliminar el recordatorio")
    }
  }

  // ❌ Cancelar formulario
  const handleCancel = () => {
    setShowForm(false)
    setSelectedReminder(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">

      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          Gestión de Recordatorios
        </h1>

        {!showForm && (
          <Button
            text="+ Nuevo recordatorio"
            type="primary"
            onClick={() => setShowForm(true)}
          />
        )}
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto">

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-center text-gray-600">
            Cargando recordatorios...
          </p>
        )}

        {/* FORMULARIO */}
        {showForm && (
  <Modal onClose={handleCancel}>
    <ReminderForm
      onSubmit={handleSaveReminder}
      onCancel={handleCancel}
      initialData={selectedReminder}
    />
  </Modal>
)}


        {/* LISTA */}
        {!loading && (
          <ReminderList
            reminders={reminders}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

      </main>
    </div>
  )
}

export default App
