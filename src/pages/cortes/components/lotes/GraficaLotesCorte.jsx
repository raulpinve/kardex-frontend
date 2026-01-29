import Card from '@/shared/components/Card';
import CardTitulo from '@/shared/components/CardTitulo';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerEvolucionLoteCorte } from '../../services/cortesServices';
import { handleErrorsBasic } from '@/utils/handleErrors';
import GraficaStock from '@/shared/components/GraficaStock';
import { dateColombiaFormat } from '@/utils/utilities';
import { LuLoaderCircle } from 'react-icons/lu';

const GraficaLotesCorte = ({refreshKey}) => {
    const {corteId, loteId} = useParams();
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [stock, setStock] = useState([]);

    // Obtener la evolución del lote en el corte
    useEffect(() => {
        const fetchEvolucionLote = async () => {
            setLoading(true);
            try {
                const res = await obtenerEvolucionLoteCorte(corteId , loteId);
                setStock(res.data);
            } catch (error) {
                handleErrorsBasic(error, setMessageError)
            } finally {
                setLoading(false);
            }
        }
        if(corteId, loteId) fetchEvolucionLote()
    }, [refreshKey, corteId, loteId])

    if(messageError){
        return 
    }

    return (
        <Card>
            <CardTitulo>Evolución de stock del lote en el corte</CardTitulo>
            {loading && !stock && (<>
                <LuLoaderCircle />
            </>)}

            {/* Información general */}
            <div className="dark:text-gray-200 text-sm mt-2">
                <span> {`Desde ${dateColombiaFormat(stock?.fechaInicio)} hasta ${dateColombiaFormat(stock?.fechaFin)}`}  </span>
                <div className='flex gap-2'>
                    <span>Stock inicial: {stock.stockInicial}</span> 
                    <span>•</span> 
                    <span>Stock final: {stock.stockFinal}</span>
                </div>
            </div>
            <div className="mt-8">
                <GraficaStock 
                    tipoGrafica='line'
                    data={stock?.evolucion}
                />
            </div>
        </Card>
    );
};

export default GraficaLotesCorte;