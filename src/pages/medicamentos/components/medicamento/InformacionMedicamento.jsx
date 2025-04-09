import React, { useEffect, useState } from "react";
import Card from "../../../../shared/components/Card";
import CardTitulo from "../../../../shared/components/CardTitulo";
import { obtenerMedicamento } from "../../services/medicamentosServices";
import { useSelector } from "react-redux";
import { handleErrorsBasic } from "../../../../utils/handleErrors";
import MessageError from "../../../../shared/components/MessageError";

const InformacionMedicamento = ({medicamentoId}) => {
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [medicamento, setMedicamento] = useState(null);
    const [error, setError] = useState(null);

    // Obtener información del medicamento 
    useEffect(() => {
        const fetchMedicamento = async() => {
            setLoading(true);
            setError(false);
            try {
                const res = await obtenerMedicamento(token, medicamentoId);
                setMedicamento(res.data);
            } catch (error) {
                handleErrorsBasic(error, setError);                
            } finally {
                setLoading(false);
            }
        }

        if(medicamentoId){
            fetchMedicamento();
        }
    },[medicamentoId])

    return (
        <div className="text-sm text-gray-700 dark:text-gray-400">
            <Card>
                {/* Loading */}
                <div>
                    {loading && (<>
                        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] mb-3"></div>
                        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg w-44 h-32 mx-auto my-5"></div>
                            {   
                                [...Array(5)].map((_,index) => <div key={index} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] mb-3"></div>)
                            }
                        </>)
                    }
                </div>

                {!loading && error && <MessageError>{error}</MessageError>}
                {!loading && medicamento && ( <>
                    <CardTitulo>{medicamento.nombre}</CardTitulo>
                    <div className="flex justify-center items-center">
                        <img 
                            src="https://admision.udp.cl/cms/wp-content/themes/portable_udp/images/default.png" 
                            alt="" 
                            className="w-24 h-24 object-cover rounded-full"
                        />
                    </div>
                    <div className="mt-5">
                        {/* Forma farmacéutica */}
                        <div>
                            <p>Forma farmacéutica</p>
                            <p className="font-semibold">{medicamento.formaFarmaceutica}</p>
                        </div>

                        {/* Concentración */}
                        <div className="mt-4">
                            <p>Concentración</p>
                            <p className="font-semibold">{medicamento.concentracion}</p>
                        </div>

                        {/* Presentación */}
                        <div className="mt-4">
                            <p>Presentación</p>
                            <p className="font-semibold">{medicamento.presentacionComercial}</p>
                        </div>

                        {/* Unidad de médica */}
                        <div className="mt-4">
                            <p>Unidad médica</p>
                            <p className="font-semibold">{medicamento.unidadMedida}</p>
                        </div>

                        {/* Stock requerido */}
                        <div className="mt-4">
                            <p>Stock requerido</p>
                            <p className="font-semibold">{medicamento.stockRequerido}</p>
                        </div>
                        
                    </div>
                </>
                )}

               
            </Card>
        </div>
    );
};

export default InformacionMedicamento;