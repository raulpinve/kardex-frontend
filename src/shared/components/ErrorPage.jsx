import { useNavigate } from 'react-router-dom';

export default function ErrorPage({ code = 404, message = 'Página no encontrada' }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-6xl font-bold text-red-600">{code}</h1>
        <p className="text-lg mt-4 text-gray-800">{message}</p>
        <button
          onClick={handleGoHome}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
