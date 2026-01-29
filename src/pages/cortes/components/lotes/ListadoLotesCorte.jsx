import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { LuSearch } from 'react-icons/lu';
import Pagination from '../../../../shared/components/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import useDebounce from '../../../../shared/hooks/useDebounce';
import { dateColombiaFormat, formatCantidad, obtenerEstadoVencimiento } from '@/utils/utilities';
import TableThead from '@/shared/components/TableThead';
import TableTh from '@/shared/components/TableTh';
import Table from '@/shared/components/Table';
import TableTr from '@/shared/components/TableTr';
import TableTbody from '@/shared/components/TableTbody';
import TableTd from '@/shared/components/TableTd';
import { obtenerListadoCorteLotes } from '../../services/lotesServices';

const ListadoLotesCorte = ({ corteId }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [paginaActual, setPaginaActual] = useState(1);
	const [totalPaginas, setTotalPaginas] = useState(1);
	const [consulta, setConsulta] = useState("");
	const [lotes, setLotes] = useState([]);
	const navigate = useNavigate();
	const { productoId } = useParams();
	const debouncedConsulta = useDebounce(consulta, 500);

	useEffect(() => {
		const fetchCorteLote = async () => {
		setLoading(true);
			try {
				const respuesta = await obtenerListadoCorteLotes(corteId, productoId, paginaActual, consulta);
				if (respuesta.data) {
					setLotes(respuesta.data);
					setPaginaActual(respuesta.paginacion.paginaActual);
					setTotalPaginas(respuesta.paginacion.totalPaginas);
				}
			} catch (error) {
				setError(error?.response?.data?.message || "Ha ocurrido un error interno. Por favor, inténtalo nuevamente.");
			} finally {
				setLoading(false);
			}
		};
		if (corteId && productoId) {
			fetchCorteLote();
		}
	}, [corteId, productoId, debouncedConsulta, consulta, paginaActual]);

	const redireccionar = (loteId) => {
		navigate(`/cortes/${corteId}/${loteId}/lote`);
	};

	return (
		<Card className={`h-full flex flex-col`}>
			{/* Header */}
			<div className="flex justify-between items-center">
				<CardTitulo>Lotes</CardTitulo>
				<div className="flex gap-1 items-center justify-between">
					<div className="relative hidden md:block">
						<LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
						<input
							type="text"
							placeholder="Buscar..."
							className="input-form pl-10 dark:bg-gray-900"
							value={consulta}
							onChange={(e) => setConsulta(e.currentTarget.value)}
						/>
					</div>
				</div>
			</div>

			<div className="mt-4">
				<Table>
					<TableThead>
						<TableTr>
							<TableTh>Número de lote</TableTh>
							<TableTh>Registro sanitario</TableTh>
							<TableTh>Fecha de vencimiento</TableTh>
							<TableTh>Stock inicial</TableTh>
							<TableTh>Ingresos</TableTh>
							<TableTh>Salidas</TableTh>
							<TableTh>Stock final</TableTh>
						</TableTr>
					</TableThead>
					{loading && <SkeletonTable rows={7} columns={8} />}
					<TableTbody>
						{!loading && error && (
							<TableTr>
								<TableTd colSpan={8}>
									{error}
								</TableTd>
							</TableTr>
						)}

						{!loading && !error && lotes.length === 0 && (
							<TableTr>
								<TableTd colSpan={8}>
									No hay lotes en el inventario por mostrar.
								</TableTd>
							</TableTr>
						)}
						{!loading && !error && lotes.length > 0 && lotes.map((lote) => {
							const { estado, color } = obtenerEstadoVencimiento(lote.fechaVencimiento);
							return (
								<TableTr
									key={lote.loteId}
									className="cursor-pointer text-sm"
									onClick={() => redireccionar(lote.loteId)}
								>
									<TableTd>{lote.numeroLote ?? "---"} {lote?.eliminado === true ? <span className='text-gray-500 text-xs font-medium'>(Eliminado)</span>: null }</TableTd>
									<TableTd>{lote.registroSanitario ?? "---"}</TableTd>
									<TableTd>
										<div className="py-3 px-4 lg:flex lg:gap-2 items-center">
											<p>{dateColombiaFormat(lote.fechaVencimiento)}</p>
											<p className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color}`}>
												{estado}
											</p>
										</div>
									</TableTd>
									<TableTd>{formatCantidad(lote.stockInicial)}</TableTd>
									<TableTd>{formatCantidad(lote.ingresos)}</TableTd>
									<TableTd>{formatCantidad(lote.salidas)}</TableTd>
									<TableTd>{formatCantidad(lote.stockFinal)}</TableTd>
								</TableTr>
							)
						})}
					</TableTbody>
				</Table>
			</div>

			{/* Paginación */}
			<Pagination
				paginaActual={paginaActual}
				totalPaginas={totalPaginas}
				onPageChange={setPaginaActual}
			/>
		</Card>
	);
};

export default ListadoLotesCorte;
