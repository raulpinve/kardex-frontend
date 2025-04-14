import { useNavigate } from "react-router-dom";

export default function ErrorPage({ code = 404, message = "Página no encontrada" }) {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
        <img src="/src/assets/images/shape/grid-01.svg" alt="" />
      </div>
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
        <img src="/src/assets/images/shape/grid-01.svg" alt="" />
      </div>
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-6 text-xl font-bold text-gray-800 dark:text-white/90 xl:text-6xl">
            ERROR
          </h1>
          { code === 404 ? (<>
            <img src="/src/assets/images/error/404.svg" alt="404" className="dark:hidden" />
            <img src="/src/assets/images/error/404-dark.svg" alt="404" className="hidden dark:block" />
          </>) :(
            <p className="text-2xl xl:text-9xl mb-8 font-bold text-blue-600 dark:text-white/90 ">403</p>
          )}

          <p className="mb-6 mt-10 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            {message}
          </p>

          <button 
            href="index.html" 
            className="inline-flex items-center cursor-pointer justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={handleGoHome}
          >
            Regresar a inicio
          </button>
      </div>
    </div>
  );
}
