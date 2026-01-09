const Alert = ({ type, message, onClose }) => {
  if (!message) return null;

  const colors = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  return (
    <div className={`fixed top-4 right-4 p-4 border-l-4 rounded shadow-md z-50 flex justify-between items-center ${colors[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg">&times;</button>
    </div>
  );
};

export default Alert;

