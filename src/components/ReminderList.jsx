import Button from "./Button"

export default function ReminderList({ reminders, onEdit, onDelete }) {
  if (!reminders || reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mt-6 text-center">
        <h2 className="text-gray-600 text-lg">
          No hay recordatorios registrados
        </h2>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Título</th>
            <th className="p-3 text-left">Vencimiento</th>
            <th className="p-3 text-center">Prioridad</th>
            <th className="p-3 text-center">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {reminders.map((reminder) => (
            <tr
              key={reminder.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3">{reminder.title}</td>

              <td className="p-3">
                {new Date(reminder.dueDate).toLocaleString()}
              </td>

              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      reminder.priority === "Alta"
                        ? "bg-red-100 text-red-700"
                        : reminder.priority === "Media"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {reminder.priority}
                </span>
              </td>

              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      reminder.status === "Completado"
                        ? "bg-green-100 text-green-700"
                        : reminder.status === "Cancelado"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {reminder.status}
                </span>
              </td>

              {/* ACCIONES */}
              <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    text="Editar"
                    type="primary"
                    onClick={() => onEdit(reminder)}
                  />

                  <Button
                    text="Eliminar"
                    type="danger"
                    onClick={() => onDelete(reminder.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
