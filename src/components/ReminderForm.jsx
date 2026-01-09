import { useState, useEffect } from 'react';

const ReminderForm = ({ reminder, onSubmit, onCancel }) => {
  // Estado inicial del formulario según el modelo de datos
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_at: '',
    priority: 'MEDIUM',
    status: 'PENDING'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efecto para prellenar datos al editar
  useEffect(() => {
    if (reminder) {
      // Ajustamos la fecha para el input datetime-local (YYYY-MM-DDTHH:mm)
      const formattedDate = reminder.due_at ? new Date(reminder.due_at).toISOString().slice(0, 16) : '';
      setFormData({
        ...reminder,
        due_at: formattedDate
      });
    }
  }, [reminder]);

  // Función de validación requerida por el enunciado
  const validate = () => {
    const newErrors = {};
    const now = new Date();
    const selectedDate = new Date(formData.due_at);
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.length > 80) {
      newErrors.title = 'El título no puede exceder 80 caracteres';
    }
    
    if (formData.description && formData.description.length > 300) {
      newErrors.description = 'La descripción no puede exceder 300 caracteres';
    }
    
    if (!formData.due_at) {
      newErrors.due_at = 'La fecha de vencimiento es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Error al enviar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Título *</label>
        <input 
          type="text" 
          placeholder="Ej: Estudiar para el examen"
          className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 transition-all ${
            errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'
          }`}
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-red-500 font-medium">{errors.title}</span>
          <span className="text-[10px] text-gray-400">{formData.title.length}/80 caracteres</span>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Descripción (opcional)</label>
        <textarea 
          rows="3"
          placeholder="Detalles adicionales del recordatorio..."
          className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-red-500 font-medium">{errors.description}</span>
          <span className="text-[10px] text-gray-400">{(formData.description || '').length}/300 caracteres</span>
        </div>
      </div>

      {/* Fecha y Hora */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Fecha y Hora de Vencimiento *</label>
        <input 
          type="datetime-local" 
          className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 transition-all ${
            errors.due_at ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'
          }`}
          value={formData.due_at}
          onChange={(e) => setFormData({...formData, due_at: e.target.value})}
        />
        {errors.due_at && <span className="text-[10px] text-red-500 font-medium mt-1">{errors.due_at}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Prioridad */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Prioridad *</label>
          <select 
            className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Estado *</label>
          <select 
            className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="PENDING">Pendiente</option>
            <option value="DONE">Completado</option>
            <option value="CANCELED">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : reminder ? 'Actualizar' : 'Guardar'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ReminderForm;