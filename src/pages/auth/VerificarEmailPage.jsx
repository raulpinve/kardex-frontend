import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verificarEmail } from "../services/verificarEmailPage";
// import { verificarEmail } from "../../services/authService"; // Asegúrate de que exista esta función

const VerificarEmailPage = () => {
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const {token: tokenVerificacion} = useParams();

    // Establece el modo nocturno en caso de que esté activado
    useEffect(() => {
        const sidebarMode = localStorage.getItem("sidebarMode");
        if (sidebarMode === "dark") {
            document.body.classList.add("dark");
        }
    }, []);

    useEffect(() => {
        const verificar = async () => {
            try {
                await verificarEmail({
                    token: tokenVerificacion
                });
                setMensaje("¡Listo! Verificamos tu correo 🎉 Gracias por confirmar tu dirección. Ahora tienes acceso completo a tu cuenta.");
                setError(false);
            } catch (err) {
                const msg = err?.response?.data?.message || "Hubo un error al verificar tu correo electrónico.";
                setMensaje(msg);
                setError(true);
            }
        };

        if (tokenVerificacion) {
            verificar();
        }
    }, [tokenVerificacion]);

    return (
        <div className="w-screen h-screen bg-slate-100 dark:bg-slate-900 px-6 flex items-center">
            <div className="bg-white dark:bg-slate-800 dark:text-white p-8 w-full md:w-[400px] rounded-xl mx-auto border-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-3">
                    Verificar correo electrónico
                </h2>
                <p className={`text-sm ${error ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-200"}`}>
                    {mensaje}
                </p>
            </div>
        </div>
    );
};

export default VerificarEmailPage;
