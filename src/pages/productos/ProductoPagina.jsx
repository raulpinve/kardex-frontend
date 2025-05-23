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
            {/* <TituloProductos productoId={productoId}/> */}
            <div className="mt-4">
                {/* Encabezado */}
                <div>
                    {loading && (<div>
                        <SkeletonElement className={`max-w-[250px]`} />
                        <SkeletonElement className={`max-w-[500px] mt-3`} />
                    </div>)}

                    {!loading && producto && (<>
                        {/* Titulo */}
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 flex gap-3 items-center my-4">
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

                        {/* Información del producto */}
                        {producto && (() => {
                            const campos = [];

                            // if (producto.tipo) {
                            //     campos.push(<>
                            //         <span className="font-semibold">Tipo: </span>
                            //         {producto.tipo}
                            //     </>);
                            // }
                            if (producto.formaFarmaceutica) {
                                campos.push(<>
                                    <span className="font-semibold">Forma farmacéutica: </span>
                                    {producto.formaFarmaceutica}
                                </>);
                            }
                            if (producto.presentacion) {
                                campos.push(<>
                                    <span className="font-semibold">Presentación: </span>
                                    {producto.presentacion}
                                </>);
                            }
                            if (producto.concentracion) {
                                campos.push(<>
                                    <span className="font-semibold">Concentración: </span>
                                    {producto.concentracion}
                                </>);
                            }
                            if (producto.unidadMedica) {
                                campos.push(<>
                                    <span className="font-semibold">Unidad médica: </span>
                                    {producto.unidadMedica}
                                </>);
                            }
                            if (producto.presentacionComercial) {
                                campos.push(<>
                                    <span className="font-semibold">Presentación comercial: </span>
                                    {producto.presentacionComercial}
                                </>);
                            }
                            if (producto.serie) {
                                campos.push(<>
                                    <span className="font-semibold">Serie: </span>
                                    {producto.serie}
                                </>);
                            }
                            if (producto.riesgo) {
                                campos.push(<>
                                    <span className="font-semibold">Riesgo: </span>
                                    {producto.riesgo}
                                </>);
                            }
                            return (
                                <p className="text-sm text-muted-foreground my-2">
                                    {campos.map((campo, index) => (
                                        <span key={index}>
                                            {index > 0 && " • "}
                                            {campo}
                                        </span>
                                    ))}
                                </p>
                            );
                        })()}
                    </>)}
                </div>
            </div>
            <TarjetasStockProducto productoId={productoId}/>
            <div className="mt-4 grid gap-4">
                <GraficaComportamientoStock />
                <Lotes tipo={tipo} productoId={productoId} />
            </div>
        </Layout>
    );
};

export default ProductoPagina;