import GraficaComportamientoStock from "../../shared/components/GraficaComportamientoStock";
import TarjetasStockProducto from "./components/producto/TarjetasStockProducto";
import SubirImagenProducto from "./components/producto/SubirImagenProducto";
import SkeletonElement from "@/shared/components/SkeletonElement";
import { obtenerProducto } from "./services/productoServices";
import Layout from "../../shared/components/Layout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Lotes from "./components/lotes/Lotes";
import { useSelector } from "react-redux";
import CardTitulo from "@/shared/components/CardTitulo";
import InformacionProducto from "./components/producto/InformacionProducto";

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

    return (
        <Layout>
            <div className="mt-4">
                {/* Encabezado */}
                <div className="hidden">
                    {loading && (<div>
                        <SkeletonElement className={`max-w-[250px]`} />
                        <SkeletonElement className={`max-w-[500px] mt-3`} />
                    </div>)}
                    {!loading && producto && (<>
                            {/* Titulo */}
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 flex gap-4 items-center my-4">
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
                        <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900 mt-3">
                            {/* Forma farmaceutica */}
                            {producto?.formaFarmaceutica && (
                                <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Forma farmacéutica</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.formaFarmaceutica}
                                        </h4>
                                    </div>
                                </div>
                            )}
                            {/* Presentacion */}
                            {producto?.presentacionComercial && (
                                <div className="border-b border-gray-200 px-6 py-5 xl:border-r xl:border-b-0 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Presentación comercial</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.presentacionComercial}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {/* Concentración */}
                            {producto?.concentracion && (
                                <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Concentración</span>
                                        <div className="mt-2 flex items-end gap-3">
                                            <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                                {producto.concentracion}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Unidad de medida */}
                            {producto?.unidadMedida && (
                                <div className="px-6 py-5">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Unidad medida</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            {producto.unidadMedida}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {/* Serie */}
                            {producto?.serie && (
                                <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Serie</span>
                                        <div className="mt-2 flex items-end gap-3">
                                            <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                                {producto.serie}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Riesgo */}
                            {producto?.riesgo && (
                                <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Riesgo</span>
                                        <div className="mt-2 flex items-end gap-3">
                                            <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                                {producto.riesgo}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                           
                        </div>
                    </div>        
                </div>
            </div>
            <TarjetasStockProducto productoId={productoId}/>
            <div className="grid w-full md:grid-cols-12 gap-6 mt-4 ">
                <div className='col-span-12 xl:col-span-4'>
                    <InformacionProducto />
                </div>
                <div className="min-w-0 col-span-12 xl:col-span-8 grid xl:gap-4">
                    <Lotes tipo={tipo} productoId={productoId} />
                </div>
            </div>
            <div className="mt-4">
                <GraficaComportamientoStock />
            </div>
        </Layout>
    );
};

export default ProductoPagina;