    import React, { useMemo, useState } from 'react';
    import Drawer from '../../../shared/components/Drawer';
    import Button from '../../../shared/components/Button';
    import { LuChevronDown } from 'react-icons/lu';
    import { crearReferenciaPago } from '../services/pagosService';
    import { useSelector } from 'react-redux';
    import { loadWompi } from '../helper/loadWompi';
    import { toast } from 'sonner';

    const PERIODOS = {
        mes: "mensual",
        trimestre: "trimestral",
        semestre: "semestral",
        anio: "anual"
    };

    const MESES = {
        mes: 1,
        trimestre: 3,
        semestre: 6,
        anio: 12
    };

    const NOMBRES_PLANES_PARSEADOS = {
        "Básico": "basico",
        "Estándar": "estandar",
        "Premium": "premium"
    };

    const NIVELES_PLANES = {
        basico: 1,
        estandar: 2,
        premium: 3
    };

    const DrawerPlan = ({ drawerOpen, setDrawerOpen, planSeleccionado, PLANES }) => {
        const [periodo, setPeriodo] = useState("");
        const [loading, setLoading] = useState(false);

        const { suscripcion } = useSelector(state => state?.suscripcion);
        const { usuario } = useSelector(state => state?.auth);

        const nivelActual = suscripcion?.plan
            ? NIVELES_PLANES[suscripcion.plan]
            : 0;

        const nivelSeleccionado = planSeleccionado
            ? NIVELES_PLANES[NOMBRES_PLANES_PARSEADOS[planSeleccionado]]
            : 0;

        const hayCambioDePlan =
            suscripcion?.plan &&
            NOMBRES_PLANES_PARSEADOS[planSeleccionado] !== suscripcion.plan;

        const mostrarNotaCuotas =
            hayCambioDePlan && nivelSeleccionado <= nivelActual;

        const {
            precioOriginal,
            precioConDescuento,
            ahorro,
            precioMensualOriginal,
            precioMensualConDescuento,
            ahorroMensual
        } = useMemo(() => {
            if (!periodo) {
            return {
                precioOriginal: 0,
                precioConDescuento: 0,
                ahorro: 0,
                precioMensualOriginal: 0,
                precioMensualConDescuento: 0,
                ahorroMensual: 0
            };
            }

            const plan = NOMBRES_PLANES_PARSEADOS[planSeleccionado];
            const meses = MESES[periodo];
            const precioBase = PLANES[plan].mensual;
            const aliasPeriodo = PERIODOS[periodo];

            const totalSinDescuento = precioBase * meses;
            const totalConDescuento = PLANES[plan][aliasPeriodo];

            const mensualConDescuento = Math.round(totalConDescuento / meses);

            return {
                precioOriginal: totalSinDescuento,
                precioConDescuento: totalConDescuento,
                ahorro: totalSinDescuento - totalConDescuento,
                precioMensualOriginal: precioBase,
                precioMensualConDescuento: mensualConDescuento,
                ahorroMensual: precioBase - mensualConDescuento
            };
        }, [periodo, planSeleccionado, PLANES]);

        const handlePagar = async () => {
            if (!periodo) return;

            try {
                setLoading(true);

                const data = await crearReferenciaPago(
                    NOMBRES_PLANES_PARSEADOS[planSeleccionado],
                    periodo
                );
                const WidgetCheckout = await loadWompi();

                const checkout = new WidgetCheckout({
                    currency: "COP",
                    amountInCents: data.monto,
                    reference: data.referencia,
                    publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
                    signature: { integrity: data.firmaIntegridad },
                    customerData: {
                        email: usuario?.email,
                        fullName: `${usuario?.primerNombre} ${usuario?.apellidos}`
                    }
                });

                checkout.open(({ transaction }) => {
                    const { status } = transaction;

                    if (status === "APPROVED") {
                        toast.success("Pago aprobado. Estamos procesando tu suscripción.");
                    } else if (status === "DECLINED") {
                        toast.error("El pago fue rechazado.");
                    } else {
                        toast.info("Pago en proceso.");
                    }
                });

            } catch (error) {
                console.log(error)
                toast.error("Error iniciando pago. Contacte a soporte.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <h2 className="text-2xl font-bold text-center">Tu carrito</h2>

            <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg mt-4">
                <h2 className="font-semibold text-xl">
                Plan {planSeleccionado}
                </h2>

                {/* Nota informativa sobre cuotas */}
                {mostrarNotaCuotas && (
                    <div className="mt-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 text-sm space-y-2">
                        <p className="font-semibold">Nota importante</p>
                        <p>
                            Si el plan seleccionado no cubre la cantidad actual de empresas o
                            usuarios, solo se desactivarán aquellos que excedan las cuotas del plan.
                        </p>
                        <p>
                            Podrás elegir qué empresas y usuarios mantener activos.
                            <strong> Ninguna información será eliminada.</strong>
                        </p>
                    </div>
                )}

                {/* Selector de período */}
                <div className="mt-4 grid grid-cols-3 gap-4 items-center text-sm">
                <div>
                    <label>Período <span className="input-required">*</span></label>
                    <div className="relative">
                    <select
                        className="select-form"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                    >
                        <option value="" disabled>Seleccionar...</option>
                        <option value="mes">1 mes</option>
                        <option value="trimestre">3 meses</option>
                        <option value="semestre">6 meses</option>
                        <option value="anio">12 meses</option>
                    </select>
                    <LuChevronDown className="absolute right-2 top-3" />
                    </div>
                </div>

                <div className="flex justify-center">
                    {periodo && ahorroMensual > 0 && (
                        <span className="p-2 bg-blue-200 dark:bg-blue-900 rounded-lg text-center font-semibold">
                            Ahorras ${ahorroMensual.toLocaleString("es-CO")}/mes
                        </span>
                    )}
                </div>

                <div className="text-right">
                    {periodo && periodo !== "mes" && (
                    <>
                        <p className="line-through text-gray-600">
                        ${precioMensualOriginal.toLocaleString("es-CO")}/mes
                        </p>
                        <p className="font-bold text-xl">
                        ${precioMensualConDescuento.toLocaleString("es-CO")}/mes
                        </p>
                    </>
                    )}
                </div>
                </div>

                {periodo && (
                <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg mt-6">
                    <div className="flex justify-between px-4">
                    <h2 className="font-semibold text-xl">Total</h2>
                    <p className="text-2xl font-bold">
                        ${precioConDescuento.toLocaleString("es-CO")}
                    </p>
                    </div>

                    <Button
                        colorButton="primary"
                        textButton="Comprar"
                        className="w-full mt-4"
                        loading={loading}
                        onClick={handlePagar}
                    />
                </div>
                )}
            </div>
            </Drawer>
        );
    };

    export default DrawerPlan;
