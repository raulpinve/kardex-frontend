import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout";
import CardTitulo from "../../shared/components/CardTitulo";
import Button from "../../shared/components/Button";
import { LuEraser, LuPencil, LuRefreshCcw, LuSearch } from "react-icons/lu";
import Card from "../../shared/components/Card";
import useDebounce from "../../shared/hooks/useDebounce";
import { obtenerDispositivos } from "./services/dispositivosServices";
import { useSelector } from "react-redux";
import SkeletonTable from "../../shared/components/SkeletonTable";
import { useNavigate } from "react-router-dom";
import Pagination from "../../shared/components/Pagination";
import ModalCrearDispositivo from "./components/dispositivos/ModalCrearDispositivo";
import ModalEditarDispositivo from "./components/dispositivos/ModalEditarDispositivo";
import ModalEliminarDispositivo from "./components/dispositivos/ModalEliminarDispositivo";

const DispositivosListaPagina = () => {
    const [modalActivo, setModalActivo] = useState(); // Establece la modal que estará activa
    const [consulta, setConsulta] = useState("");
    const [loading, setLoading] = useState(null);
    const token = useSelector(state => state.auth.token);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [dispositivos, setDispositivos] = useState([]);
    const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
    const [refresh, setRefresh] = useState(0); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const almacen = useSelector(state => state.almacen.almacen);
    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); 
            
            try {
                const respuesta = await obtenerDispositivos(token, almacen.id, paginaActual, debouncedConsulta)
                setDispositivos(respuesta.data)
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);

            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            } finally {
                setLoading(false);
            }
        }
        if(almacen){
            fetchUsuarios();
        }
    }, [debouncedConsulta, almacen, token, refresh, paginaActual]);

    // Redireccionar   
    const irADispositivo = (id) => {
        navigate(`/dispositivos/${id}`);
    };

    return (
        <>
            <Layout>
                <div className="mt-4">
                    <Card>
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <CardTitulo>Dispositivos </CardTitulo>
                            <div className="flex gap-1 items-center justify-between">
                                <Button
                                    type="button"
                                    colorButton="secondary"
                                    onClick={() => {
                                        setModalActivo("crear")
                                    }}
                                >   
                                    Crear
                                </Button>
                                <div className="relative hidden md:block">
                                    <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar medicamento..." 
                                        className="input-form pl-10 dark:bg-gray-900"
                                        value={consulta}
                                        onChange={(e) => {
                                            setConsulta(e.currentTarget.value);
                                        }}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    colorButton="secondary"
                                    onClick={() => {
                                        setPaginaActual(1)
                                        setRefresh((prev) => prev + 1)
                                    }}
                                >
                                    <LuRefreshCcw />
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full  mt-3">
                                <thead>
                                    <tr className="border-gray-100 border-y  text-sm dark:border-gray-800 text-left">
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Nombre</p>
                                        </th>
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Serie</p>
                                        </th>
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Presentación comercial</p>
                                        </th>
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Riesgo</p>
                                        </th>
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Stock requerido</p>
                                        </th>
                                        <th className="py-3 px-4 w-[100px]">
                                            <p className="font-medium text-gray-700 dark:text-gray-400 ">Acciones</p>
                                        </th>
                                    </tr>
                                </thead>

                                {loading ? <SkeletonTable rows={7} columns={5}/>: 
                                    <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                                        {error ? <tr>
                                            <td colSpan="5" className="py-3">
                                                <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                            </td>
                                        </tr> : 
                                        <>
                                            {dispositivos.length === 0 ? 
                                                <tr>
                                                    <td colSpan="5" className="py-3">
                                                        <p className="text-gray-700 dark:text-gray-400 text-center"> No hay dispositivos por mostrar</p>
                                                    </td>
                                                </tr>: 
                                                <>
                                                    {dispositivos.map(dispositivo => {
                                                        return <tr 
                                                            key={dispositivo.id}
                                                            onClick={() => irADispositivo(dispositivo.id)}
                                                            className="cursor-pointer"
                                                        >
                                                            <td className="py-3 px-4">
                                                                <p className="text-gray-700 dark:text-gray-400"> {dispositivo.nombre}</p>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <p className="text-gray-700 dark:text-gray-400"> {dispositivo.serie} </p>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <p className="text-gray-700 dark:text-gray-400"> {dispositivo.presentacionComercial} </p>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <p className="text-gray-700 dark:text-gray-400"> {dispositivo.riesgo} </p>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <p className="text-gray-700 dark:text-gray-400"> {dispositivo.stockRequerido} </p>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="text-gray-700 dark:text-gray-400 flex">
                                                                    <button 
                                                                        className="cursor-pointer p-2"
                                                                        title="Editar dispositivo"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                            setModalActivo("editar"); 
                                                                            setDispositivoSeleccionado(dispositivo);
                                                                        }}    
                                                                    >
                                                                        <LuPencil />
                                                                    </button>
                                                                    <button 
                                                                        className="cursor-pointer p-2"
                                                                        title="Eliminar dispositivo"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                            setModalActivo("eliminar"); 
                                                                            setDispositivoSeleccionado(dispositivo);
                                                                        }} 
                                                                    >
                                                                        <LuEraser />
                                                                    </button> 
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    })}
                                                </>
                                                }
                                            </>}
                                    </tbody>}
                            </table>
                        </div>
                        <Pagination
                            paginaActual={paginaActual}
                            totalPaginas={totalPaginas}
                            onPageChange={setPaginaActual}
                        />
                    </Card>
                </div>
            </Layout>

            {modalActivo === "crear" && almacen && (
                <ModalCrearDispositivo
                    cerrarModal={() => setModalActivo(null)} 
                    setDispositivos = {setDispositivos}
                    almacenId = {almacen.id}
                />
            )}

            {modalActivo === "editar" && (
                <ModalEditarDispositivo 
                    cerrarModal={() => setModalActivo(null)} 
                    setDispositivos = {setDispositivos}
                    dispositivoSeleccionado = {dispositivoSeleccionado}
                />
            )}
            
            {modalActivo === "eliminar" && (
                <ModalEliminarDispositivo 
                    cerrarModal={() => setModalActivo(null)} 
                    setDispositivos = {setDispositivos}
                    dispositivoSeleccionado = {dispositivoSeleccionado}
                />
            )} 
        </>
    );
};

export default DispositivosListaPagina;