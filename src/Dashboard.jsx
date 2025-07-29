import { useEffect, useState } from "react";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/dados_vendas_simulados.csv")
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data);
          }
        });
      });
  }, []);

  const filteredData = filter
    ? data.filter(item => item.region?.toLowerCase().includes(filter.toLowerCase()))
    : data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard de Vendas</h1>
      <input
        placeholder="Filtrar por região (ex: Sudeste)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-sm"
      />

      <div className="bg-white rounded p-4 shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData.slice(0, 100)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="access_count" stroke="#8884d8" name="Acessos" />
            <Line type="monotone" dataKey="purchases" stroke="#82ca9d" name="Compras" />
            <Line type="monotone" dataKey="errors_500" stroke="#ff4d4f" name="Erros 500" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}