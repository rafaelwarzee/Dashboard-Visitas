import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useMemo } from 'react';

export default function TrendChart({ data }) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        // Group by Date for comparison
        // Data1 structure: Divisão,Categoria,Mês,Canal,Data,Exibições da página,Visitas...
        const grouped = {};
        data.forEach(row => {
            const date = row.Data;
            if (!date) return;
            if (!grouped[date]) {
                grouped[date] = { Data: date, VisitasPagos: 0, VisitasOrganico: 0 };
            }
            let vis = 0;
            if (row.Visitas) {
                vis = typeof row.Visitas === 'number' ? row.Visitas : parseInt(row.Visitas.toString().replace(/\./g, ''));
            }
            if (row.Canal === 'Canais Pagos') {
                grouped[date].VisitasPagos += vis;
            } else if (row.Canal === 'Canais Orgânicos') {
                grouped[date].VisitasOrganico += vis;
            }
        });
        const arr = Object.values(grouped).sort((a,b) => {
            // Split dd/MM/yyyy to yyyy-MM-dd to compare dates accurately
            const [da, ma, ya] = a.Data.split('/');
            const [db, mb, yb] = b.Data.split('/');
            return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);
        });
        return arr;
    }, [data]);

    return (
        <div style={{ width: '100%', height: 350 }}>
            <h3>Tendência Visitas vs Canal (Source 1)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="Data" stroke="#cbd5e1" tick={{fontSize: 12}} />
                    <YAxis stroke="#cbd5e1" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                    <Legend />
                    <Line type="monotone" name="Pagos" dataKey="VisitasPagos" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} />
                    <Line type="monotone" name="Orgânicos" dataKey="VisitasOrganico" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
