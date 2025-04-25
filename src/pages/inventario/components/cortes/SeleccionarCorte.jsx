import React, { useState } from "react";
import CardTitulo from "../../../../shared/components/CardTitulo";
import { formatDateCorte } from "../../../../utils/utilities";
import ModalSeleccionarCorte from "./ModalSeleccionarCorte";
import { LuChevronRight } from "react-icons/lu";
import Badge from "../../../../shared/components/Badge";

const SeleccionarCorte = ({corteSeleccionado, producto, lote}) => {
    const [ modalActivo, setModalActivo ] = useState("");
    return (
        <div className="flex">
            <CardTitulo className={`flex items-center`}>Inventarios 
                {corteSeleccionado?.mes && (<>
                    <LuChevronRight /> 
                    <span 
                        className="text-blue-600 cursor-pointer ml-1"
                        onClick={() => {setModalActivo("seleccionar-corte")}}
                    >
                        {formatDateCorte(corteSeleccionado?.mes)}
                    </span>
                    {corteSeleccionado?.cerrado ? 
                        <Badge tipo="danger"> Cerrado</Badge>:
                        <Badge> Activo </Badge>                                    
                    }
                    {producto?.nombre && (<>
                        <LuChevronRight /> 
                        <span className="ml-1">{producto.nombre}</span>
                    </>)}
                </>)}
            </CardTitulo>
            
            {modalActivo === "seleccionar-corte" && (
                <ModalSeleccionarCorte 
                    cerrarModal={() => setModalActivo(null)} 
                    corteSeleccionado = {corteSeleccionado}
                    producto = {producto}
                    lote = {lote}
                />
            )}
        </div>
    );
};

export default SeleccionarCorte;