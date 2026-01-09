import { useState } from "react";

export default function ReminderForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    dueDate: initialData?.dueDate
  ? initialData.dueDate.slice(0, 16)
  : "",

    priority: initialData?.priority || "MEDIUM",
    status: initialData?.status || "PENDING",
  });

  const [errors, setErrors] = useState({});

  // ✅ VALIDACIÓN
  function validate() {
  const newErrors = {};
  
  // Validar título
  if (!formData.title.trim()) {
    newErrors.title = 'El título es requerido';
  } else if (formData.title.length < 3) {
    newErrors.title = 'El título debe tener al menos 3 caracteres';
  } else if (formData.title.length > 80) {
    newErrors.title = 'El título no puede exceder 80 caracteres';
  }
  
  // Validar descripción (opcional pero con límite)
  if (formData.description && formData.description.length > 300) {
    newErrors.description = 'La descripción no puede exceder 300 caracteres';
  }
  
  // Validar fecha
  if (!formData.due_at) {
    newErrors.due_at = 'La fecha de vencimiento es requerida';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
  // 🔘 SUBMIT
 const handleSubmit = (e) => {
  e.preventDefault()
  console.log('Submitting form with data:', formData)
  if (!validate()) return

  const formattedData = {
    ...formData,
    dueDate: formData.dueDate
      ? new Date(formData.dueDate).toISOString()
      : null,

      
  }

  onSubmit(formattedData)
}



  return (
    <div className="p-6 bg-white rounded-xl shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-indigo-600">
          {initialData ? "Editar recordatorio" : "Nuevo recordatorio"}
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TÍTULO */}
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            maxLength={80}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500
              ${errors.title ? "border-red-500" : "border-gray-300"}`}
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-red-600">{errors.title}</span>
            <span className="text-gray-500">
              {formData.title.length}/80
            </span>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            rows={3}
            maxLength={300}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500
              ${errors.description ? "border-red-500" : "border-gray-300"}`}
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-red-600">{errors.description}</span>
            <span className="text-gray-500">
              {formData.description.length}/300
            </span>
          </div>
        </div>

        {/* FECHA */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha y hora de vencimiento
          </label>
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg
              ${errors.dueDate ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.dueDate && (
            <p className="text-red-600 text-xs mt-1">
              {errors.dueDate}
            </p>
          )}
        </div>

        {/* PRIORIDAD Y ESTADO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prioridad</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="PENDING">Pendiente</option>
              <option value="DONE">Completado</option>
              <option value="CANCELED">Cancelado</option>
            </select>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
