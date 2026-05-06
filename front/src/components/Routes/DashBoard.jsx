import React, { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../config/api";
import { authFetch } from "../authFetch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./DashBoard.css";

export default function Dashboard({ gyms = [] }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGym, setSelectedGym] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = selectedGym ? `${API_URL}/gyms/dashboard/analytics?gymName=${encodeURIComponent(selectedGym)}` : `${API_URL}/gyms/dashboard/analytics`;
        const res = await authFetch(url);
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedGym]);

  const lineChartData = useMemo(() => {
    if (!data?.evolucao_hora) return [];
    const grouped = {};
    data.evolucao_hora.forEach((item) => {
      if (!grouped[item.hora]) grouped[item.hora] = { hora: item.hora };
      grouped[item.hora][item.gymName] = item.checkins;
    });
    return Object.values(grouped).sort((a, b) => a.hora - b.hora);
  }, [data]);

  const barChartData = useMemo(() => {
    if (!data?.volume_dia) return [];
    const grouped = {};
    data.volume_dia.forEach((item) => {
      if (!grouped[item.dia_semana]) grouped[item.dia_semana] = { dia_semana: item.dia_semana };
      grouped[item.dia_semana][item.gymName] = item.checkins;
    });
    const order = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return Object.values(grouped).sort(
      (a, b) => order.indexOf(a.dia_semana) - order.indexOf(b.dia_semana)
    );
  }, [data]);

  const chartGyms = useMemo(() => {
    if (!data?.evolucao_hora) return [];
    const g = new Set();
    data.evolucao_hora.forEach((item) => g.add(item.gymName));
    return Array.from(g);
  }, [data]);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];

  if (loading) return <div className="dashboard-loading">Carregando dashboard...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;
  if (!data) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏋️‍♂️ Dashboard de Acessos IoT - GymRadar</h1>
        <p>
          Análise estatística e acompanhamento de fluxo de alunos em tempo real usando dados reais dos
          dispositivos de catraca IoT.
        </p>
        <div className="gym-filter" style={{ marginTop: '16px' }}>
          <label htmlFor="gym-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Gym:</label>
          <select 
            id="gym-select"
            value={selectedGym} 
            onChange={(e) => setSelectedGym(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          >
            <option value="">All Gyms</option>
            {gyms.map((g) => (
              <option key={g._id || g.id || g.name} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Total de Check-ins</h3>
          <div className="kpi-value">{data.total_checkins}</div>
        </div>
        <div className="kpi-card">
          <h3>Média de Check-ins/Hora</h3>
          <div className="kpi-value">{Number(data.media_hora).toFixed(1)}</div>
        </div>
        <div className="kpi-card">
          <h3>Mediana/Hora</h3>
          <div className="kpi-value">{Number(data.mediana_hora).toFixed(1)}</div>
        </div>
        <div className="kpi-card">
          <h3>% Acessos no Horário de Pico</h3>
          <div className="kpi-value">{Number(data.pct_pico).toFixed(1)}%</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3>📈 Evolução da Média de Check-ins por Hora do Dia</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hora" tickFormatter={(v) => `${v}h`} />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartGyms.map((gym, idx) => (
                <Line
                  key={gym}
                  type="monotone"
                  dataKey={gym}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>📅 Volume Total de Acessos por Dia da Semana</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dia_semana" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartGyms.map((gym, idx) => (
                <Bar key={gym} dataKey={gym} fill={colors[idx % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}