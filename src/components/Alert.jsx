export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null

  const styles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  }

  return (
    <div
      className={`border px-4 py-3 rounded-lg flex justify-between items-center mb-4 ${styles[type]}`}
    >
      <span className="text-sm">{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 font-bold hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  )
}
