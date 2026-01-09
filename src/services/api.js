
// URL base de la API - usando proxy de Vite
const API_BASE_URL = '/api/v1';

/**
 * Helper para manejar las respuestas del servidor
 */
const handleResponse = async (response) => {
  // Si la respuesta es 204 (No Content), no hay datos
  if (response.status === 204) {
    return { data: null };
  }

  // Convertir a JSON
  const data = await response.json();

  // Si hay error (4xx o 5xx)
  if (!response.ok) {
    throw {
      response: {
        status: response.status,
        data: data,
      },
    };
  }

  return { data };
};

/**
 * Helper para hacer peticiones HTTP
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    // Si el error tiene respuesta del servidor
    if (error.response) {
      throw error;
    }
    // Error de red o conexión
    throw {
      response: {
        status: 500,
        data: { message: 'Error de conexión con el servidor' },
      },
    };
  }
};

/**
 * Servicio de Recordatorios
 */
export const reminderService = {
  // Obtener todos
  getAll: () => request('/reminders'),
  
  // Obtener por ID
  getById: (id) => request(`/reminders/${id}`),
  
  // Crear nuevo
  create: (reminder) => request('/reminders', {
    method: 'POST',
    body: JSON.stringify(reminder)
  }),
  
  // Actualizar
  update: (id, reminder) => request(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reminder)
  }),
  
  // Eliminar
  delete: (id) => request(`/reminders/${id}`, {
    method: 'DELETE'
  }),
  
  // Filtrar por estado
  findByStatus: (status) => request(`/reminders/status/${status}`),
  
  // Filtrar por prioridad
  findByPriority: (priority) => request(`/reminders/priority/${priority}`),
  
  // Buscar por título
  searchByTitle: (title) => request(`/reminders/search?title=${encodeURIComponent(title)}`),
};

export default { reminderService };
