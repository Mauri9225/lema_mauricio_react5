const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* El círculo animado */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      
      {/* Texto de carga opcional */}
      <p className="text-indigo-600 font-medium animate-pulse">
        Cargando recordatorios...
      </p>
    </div>
  );
};

export default LoadingSpinner;