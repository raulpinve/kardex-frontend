import GraficaComportamientoStock from "../../shared/components/GraficaComportamientoStock";
import TarjetasStockProducto from "./components/producto/TarjetasStockProducto";
import SubirImagenProducto from "./components/producto/SubirImagenProducto";
import SkeletonElement from "@/shared/components/SkeletonElement";
import { obtenerProducto } from "./services/productoServices";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Lotes from "./components/lotes/Lotes";
import { useSelector } from "react-redux";
import Movimientos from "./components/movimientos/Movimientos";

const ProductoPagina = ({ tipo }) => {
    const {productoId} = useParams();
    const [producto, setProducto] = useState();
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);

    // Obtener la información del producto
    useEffect(() => {
        const fecthProducto = async () => {
            try {
                setLoading(true);
                const res = await obtenerProducto(token, productoId);
                setProducto(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if(!productoId) return;
        fecthProducto()
    }, [productoId, token])


    return (<>
        <div className="mt-4">
            {/* Encabezado */}
            <div className="">
                {loading && !producto && (<>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-200 flex gap-4 items-center my-6">
                        <SkeletonElement className="w-12 h-12 rounded-full"/>
                        <div className="grid gap-2">
                            <SkeletonElement className="w-[120px] h-[20px]"/>
                            <SkeletonElement className="w-[80px] h-[16px]"/>
                        </div>
                    </h1>
                </>)}
                {!loading && producto && (<>
                    {/* Titulo */}
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-200 flex gap-4 items-center my-6">
                        <SubirImagenProducto 
                            producto={producto}
                            setProducto={setProducto}
                            tipo = {producto?.tipo + "s"}
                        />
                        <div>
                            <span> {producto?.nombre?.charAt(0).toUpperCase() + producto?.nombre?.slice(1)}</span>
                            <p className="text-sm font-normal text-gray-600 capitalize -mt-[3px]">{producto.tipo}</p>
                        </div>
                    </h1>
                </>)}
                <div>
                    {loading && !producto && (<div className="grid rounded-2xl border border-gray-200 bg-white mt-3 dark:border-gray-800 dark:bg-white/[0.01] grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                    </div>)}

                    {!loading && producto && (<>
                        <div className={`grid rounded-2xl border border-gray-200 bg-white mt-3 dark:border-gray-800 dark:bg-white/[0.01] ${
                            producto?.tipo === 'dispositivo' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-5'
                        }`}>
                            
                            {/* Forma farmacéutica (solo si NO es dispositivo) */}
                            {producto?.formaFarmaceutica && producto?.tipo !== 'dispositivo' && (
                                <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Forma farmacéutica</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.formaFarmaceutica}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {/* Categoría */}
                            {/* {producto?.categoriaNombre && ( */}
                                <div className="border-b border-gray-200 px-6 py-5 md:border-r xl:border-b-0 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Categoria</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto?.categoriaNombre ? producto.categoriaNombre : "N/A"}
                                        </h4>
                                    </div>
                                </div>
                            {/* )} */}

                            {/* Presentación comercial */}
                            {producto?.presentacionComercial && (
                                <div className="border-b border-gray-200 px-6 py-5 md:border-r xl:border-b-0 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Presentación comercial</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.presentacionComercial}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {/* Concentración (solo si NO es dispositivo) */}
                            {producto?.concentracion && producto?.tipo !== 'dispositivo' && (
                                <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Concentración</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.concentracion}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {/* Unidad medida (solo si NO es dispositivo) */}
                            {producto?.unidadMedida && producto?.tipo !== 'dispositivo' && (
                                <div className="px-6 py-5">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Unidad medida</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.unidadMedida}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {/* Serie (solo si es dispositivo) */}
                            {producto?.serie && producto?.tipo === 'dispositivo' && (
                                <div className="border-b border-gray-200 px-6 py-5 md:border-r dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Serie</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.serie}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {/* Riesgo (solo si es dispositivo) */}
                            {producto?.riesgo && producto?.tipo === 'dispositivo' && (
                                <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Riesgo</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.riesgo}
                                        </h4>
                                    </div>
                                </div>
                            )}

                        </div>
                    </>)}
                </div>
            </div>
        </div>
        <div className="mt-4">
            <TarjetasStockProducto productoId={productoId}/>
        </div>
        <div className="grid gap-6 mt-6">
            <GraficaComportamientoStock />
            <Lotes tipo={tipo} productoId={productoId} />
            <Movimientos productoId={productoId} tipoMovimiento="producto"/>
        </div>
    </>);
};

export default ProductoPagina;