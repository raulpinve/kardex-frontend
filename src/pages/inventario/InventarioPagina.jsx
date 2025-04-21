import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout";
import Card from "../../shared/components/Card";
import CardTitulo from "../../shared/components/CardTitulo";
import Button from "../../shared/components/Button";
import { LuBadgeCheck, LuChevronDown, LuCircleAlert, LuCircleCheck, LuSettings } from "react-icons/lu";
import CorteMedicamentos from "./components/medicamentos/CorteMedicamentos";
import ModalCrearCorte from "./components/cortes/ModalCrearCorte";
import ModalSeleccionarCorte from "./components/cortes/ModalSeleccionarCorte";
import { formatDateCorte } from "../../utils/utilities";

const InventarioPagina = () => {
    const [modalActivo, setModalActivo] = useState(null);
    const [corteSeleccionado, setCorteSeleccionado] = useState(null);

    const [cortes, setCortes] = useState([
        { id: 1, mes: "2024-01-31T00:00:00.000Z", cerrado: true },
        { id: 2, mes: "2024-02-29T00:00:00.000Z", cerrado: false }, // 2024 es bisiesto
        { id: 3, mes: "2024-03-31T00:00:00.000Z", cerrado: false },
        { id: 4, mes: "2024-04-30T00:00:00.000Z", cerrado: false },
        { id: 5, mes: "2024-05-31T00:00:00.000Z", cerrado: false },
        { id: 6, mes: "2024-06-30T00:00:00.000Z", cerrado: false },
        // { id: 7, mes: "2024-07-31T00:00:00.000Z", cerrado: false },
        // { id: 8, mes: "2024-08-31T00:00:00.000Z", cerrado: false },
        // { id: 9, mes: "2024-09-30T00:00:00.000Z", cerrado: false },
        // { id: 10, mes: "2024-10-31T00:00:00.000Z", cerrado: false },
        // { id: 11, mes: "2024-11-30T00:00:00.000Z", cerrado: false },
        // { id: 12, mes: "2024-12-31T00:00:00.000Z", cerrado: false }
    ]);

    useEffect(() => {
        if (cortes.length === 0) return;
        const corteMasReciente = cortes.reduce((acc, curr) =>
            curr.id > acc.id ? curr : acc
        );
    
        setCorteSeleccionado(corteMasReciente);
    }, [cortes]);

    return (
        <Layout>
            <Card>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            <CardTitulo>Inventarios / 
                                {corteSeleccionado?.mes && (
                                    <span 
                                        className="text-blue-600 cursor-pointer ml-1"
                                        onClick={() => {setModalActivo("seleccionar-corte")}}
                                    >{formatDateCorte(corteSeleccionado?.mes)}</span>
                                )}
                            </CardTitulo>
                            {/* <span className="ml-2 text-gray-500 font-semibold text-md"></span> */}
                        </div>
                        
                        {/* Badge activo */}
                        <span className="flex items-center gap-1 rounded-full bg-green-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                            <LuCircleCheck /> Corte activo
                        </span>
                        {/* Badge cerrado */}
                        <span className="flex items-center hidden gap-1 rounded-full bg-red-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
                            Corte cerrado
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            textButton={`Crear corte`}
                            colorButton={`primary`}
                            className="min-w-[120px]"
                            onClick={() => setModalActivo("crear")}
                        />

                        {/* Seleccionar tipo */}
                        <div className="relative">
                            <select name="" id="" className="select-form">
                                <option value="">Medicamentos</option>
                                <option value="">Dispositivos</option>
                            </select>   
                            <LuChevronDown className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
                        </div>
                        
                        <Button 
                            colorButton={`secondary`}
                            className="h-[42px]"
                            title="Configuración"
                        > 
                            <LuSettings />
                        </Button>
                    </div>
                </div>
                {/* Medicamentos */}
                <CorteMedicamentos corteSeleccionado = {corteSeleccionado} />
            </Card>

            {modalActivo === "crear" && (
                <ModalCrearCorte 
                    cerrarModal={() => setModalActivo(null)} 
                    corteSeleccionado = {corteSeleccionado}
                    setCortes = {setCortes}
                />
            )}

            {modalActivo === "seleccionar-corte" && (
                <ModalSeleccionarCorte 
                    cerrarModal={() => setModalActivo(null)} 
                    corteSeleccionado = {corteSeleccionado}
                    cortes = {cortes}
                    setCortes = {setCortes}
                />
            )}
        </Layout>
    );
};

export default InventarioPagina;