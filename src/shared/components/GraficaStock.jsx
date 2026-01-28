import { dateColombiaFormat } from "@/utils/utilities";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const GraficaStock = ({ data = [] }) => {

  /* 🔢 Normalizar números */
  const dataNormalizada = data.map(d => ({
    ...d,
    ingresos: Number(d.ingresos),
    salidas: Number(d.salidas),
    stockInicial: Number(d.stockInicial),
    stockFinal: Number(d.stockFinal),
  }));

  return (
    <div style={{ fontSize: "13px" }}>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={dataNormalizada}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="fecha"
            tickFormatter={dateColombiaFormat}
            // interval="preserveStartEnd"
            // angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip
              labelFormatter={(fecha) => dateColombiaFormat(fecha)}
          />
          <Legend />

          {/* 📈 INGRESOS */}
          <Line
            type="monotone"
            dataKey="ingresos"
            name="Ingresos"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />

          {/* 📉 SALIDAS */}
          <Line
            type="monotone"
            dataKey="salidas"
            name="Salidas"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />

          {/* 🟡 STOCK INICIAL */}
          {/* <Line
            type="monotone"
            dataKey="stockInicial"
            name="Stock inicial"
            stroke="#64748b"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          /> */}

          {/* 🔵 STOCK FINAL */}
          {/* <Line
            type="monotone"
            dataKey="stockFinal"
            name="Stock final"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
          /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaStock;
