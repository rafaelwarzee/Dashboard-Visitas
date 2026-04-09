import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useMemo } from 'react';

export default function ChartWoW({ data }) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        // format data for chart: Semana, Visitas (parsed)
        return data.slice().sort((a,b) => new Date(a.Semana) - new Date(b.Semana)).map(row => {
            let vis = 0;
            if (row.Visitas) {
                vis = typeof row.Visitas === 'number' ? row.Visitas : parseInt(row.Visitas.replace(/\./g, ''));
            }
            return {
                Semana: row.Semana,
                Visitas: vis
            }
        });
    }, [data]);

    return (
        <div style={{ width: '100%', height: 350 }}>
            <h3>Tendência Visitas - Planilha Geral (Source 2)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="Semana" stroke="#cbd5e1" tick={{fontSize: 12}} />
                    <YAxis stroke="#cbd5e1" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                    <Legend />
                    <Line type="monotone" dataKey="Visitas" stroke="#38bdf8" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
