import React, { useState } from 'react';
import Card from '../../shared/components/Card';
import DrawerPlan from './components/DrawerPlan';
import { useSelector } from 'react-redux';

const NOMBRES_PLANES_PARSEADOS = {
  "Básico": "basico",
  "Estándar": "estandar",
  "Premium": "premium",
  "Gold": "gold"
};

const NIVELES_PLANES = {
  basico: 1,
  estandar: 2,
  premium: 3,
  gold: 4
};

const PlanCard = ({
  name,
  description,
  companies,
  auditors,
  setDrawerOpen,
  setPlanSeleccionado
}) => {
  const {
    plan: planActual,
    estado
  } = useSelector(
    state => state?.suscripcion?.suscripcion || {}
  );

  const planKey = NOMBRES_PLANES_PARSEADOS[name];
  const nivelActual = planActual ? NIVELES_PLANES[planActual] : 0;
  const nivelPlan = NIVELES_PLANES[planKey];

  const isCurrent =
    planActual === planKey &&
    estado === "activo";

  const isUpgrade =
    nivelPlan > nivelActual;

  const isDowngrade =
    nivelPlan < nivelActual;

  let botonTexto;

  if (isCurrent) {
    botonTexto = "Actual";
  } else if (isUpgrade) {
    botonTexto = "Cambiar plan";
  } else if (isDowngrade) {
    botonTexto = "Cambiar plan";
  } else {
    botonTexto = "Seleccionar";
  }

  return (
    <div className="
      flex flex-col h-full
      p-6 xl:p-8
      mx-auto w-full max-w-lg
      text-center text-gray-900
      bg-white
      rounded-lg
      border border-gray-100
      dark:border-gray-800
      shadow
      dark:bg-gray-900
      dark:text-white
      relative
    ">

      {isCurrent && (
        <span className="
          absolute top-4 right-4
          bg-green-500
          text-white
          text-xs
          font-semibold
          px-2 py-1
          rounded-full
        ">
          Actual
        </span>
      )}

      <h3 className="mb-4 text-2xl font-semibold">
        {name}
      </h3>

      <p className="
        font-light
        text-gray-500
        sm:text-lg
        dark:text-gray-400
        min-h-[84px]
      ">
        {description}
      </p>

      <div className="
        flex
        justify-center
        items-baseline
        my-8
        whitespace-nowrap
      ">
        <span className="
          mr-2
          text-4xl
          sm:text-5xl
          font-extrabold
        ">
          ${PLANES[planKey]?.mensual?.toLocaleString("es-CO")}
        </span>

        <span className="
          text-gray-500
          dark:text-gray-400
        ">
          /mes
        </span>
      </div>

      <ul
        role="list"
        className="
          mb-8
          space-y-4
          text-left
          flex-1
        "
      >
        <li className="flex items-center space-x-3">
          <svg
            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>

          <span>{companies}</span>
        </li>

        <li className="flex items-center space-x-3">
          <svg
            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293 7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>

          <span>{auditors}</span>
        </li>
      </ul>

      <button
        className={`
          w-full
          text-white
          font-medium
          rounded-lg
          text-sm
          px-5
          py-2.5
          text-center
          cursor-pointer
          transition-colors
          ${
            isCurrent
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-primary-200"
          }
        `}
        onClick={() => {
          if (!isCurrent) {
            setDrawerOpen(true);
            setPlanSeleccionado(name);
          }
        }}
        disabled={isCurrent}
      >
        {botonTexto}
      </button>
    </div>
  );
};

const infoPlanes = [
  {
    name: "Básico",
    description:
      "Ideal para pequeñas empresas que buscan un control simple y ordenado de su kardex.",
    price: "99.900",
    companies: "1 almacén",
    auditors: "3 usuarios",
  },
  {
    name: "Estándar",
    description:
      "Perfecto para organizaciones en crecimiento que necesitan más control y flexibilidad.",
    price: "169.900",
    companies: "3 almacenes",
    auditors: "10 usuarios",
  },
  {
    name: "Premium",
    description:
      "Pensado para entidades con alta demanda y gestión avanzada de auditorías e inventario.",
    price: "229.000",
    companies: "10 almacenes",
    auditors: "30 usuarios",
  },
  {
    name: "Gold",
    description:
      "Pensado para entidades con alta demanda y mayor capacidad de gestión de auditorías e inventario.",
    price: "299.000",
    companies: "Almacenes ilimitados",
    auditors: "Usuarios ilimitados",
  },
];

const PLANES = {
  basico: {
    mensual: 99900,
    trimestral: 99900 * 3 * 0.90,
    semestral: 99900 * 6 * 0.85,
    anual: 99900 * 12 * 0.80
  },

  estandar: {
    mensual: 169900,
    trimestral: 169900 * 3 * 0.90,
    semestral: 169900 * 6 * 0.85,
    anual: 169900 * 12 * 0.80
  },

  premium: {
    mensual: 229000,
    trimestral: 229000 * 3 * 0.90,
    semestral: 229000 * 6 * 0.85,
    anual: 229000 * 12 * 0.80
  },

  gold: {
    mensual: 299000,
    trimestral: 299000 * 3 * 0.90,
    semestral: 299000 * 6 * 0.85,
    anual: 299000 * 12 * 0.80
  }
};

const MiPlanPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  const suscripcion = useSelector(
    state => state?.suscripcion?.suscripcion
  );

  const planActual = useSelector(
    state => state.suscripcion.suscripcion.plan
  );

  const fechaFin = suscripcion?.fechaFin
    ? new Date(suscripcion.fechaFin)
    : null;

  return (
    <Card>
      <div className="py-8 px-4 mx-auto max-w-screen-xl">

        {suscripcion?.plan && suscripcion?.fechaFin && (
          <div className="
            mb-8
            px-4 py-3
            rounded-lg
            bg-gray-50 dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            text-sm
            text-gray-700 dark:text-gray-200
          ">
            <span className="font-medium capitalize">
              Mi plan actual: {suscripcion.plan}
            </span>

            <span className="mx-2 text-gray-400">
              ·
            </span>

            <span className="capitalize">
              {suscripcion.estado}
            </span>

            {fechaFin && !isNaN(fechaFin) && (
              <div className="mt-1 text-gray-500 dark:text-gray-400">
                Válido hasta el{" "}
                {fechaFin.toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
              </div>
            )}
          </div>
        )}

        <div className="
          mx-auto
          max-w-screen-md
          text-center
          mb-8
          lg:mb-12
        ">
          <h2 className="
            mb-4
            text-3xl
            sm:text-4xl
            tracking-tight
            font-extrabold
            text-gray-900
            dark:text-white
          ">
            La solución ideal para gestionar tu kardex de medicamentos y dispositivos médicos.
          </h2>

          <p className="
            mb-5
            font-light
            text-gray-500
            sm:text-xl
            dark:text-gray-400
          ">
            Elige tu plan y mantén tu inventario siempre bajo control.
          </p>
        </div>

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
          xl:gap-8
          items-stretch
        ">
          {infoPlanes.map((plan) => (
            <PlanCard
              setDrawerOpen={setDrawerOpen}
              key={NOMBRES_PLANES_PARSEADOS[plan.name]}
              {...plan}
              isCurrent={
                NOMBRES_PLANES_PARSEADOS[plan.name] === planActual
              }
              setPlanSeleccionado={setPlanSeleccionado}
            />
          ))}
        </div>

        <DrawerPlan
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          planSeleccionado={planSeleccionado}
          PLANES={PLANES}
        />

      </div>
    </Card>
  );
};

export default MiPlanPage;