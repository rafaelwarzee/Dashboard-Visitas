import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Formata numeros grandes no Eixo Y (K, M)
const yAxisFormatter = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
    return value;
};

export default function OverlapChart({ data, formatter, yAxisFormat }) {
    if (!data || data.length === 0) return <div className="loader">Sem dados...</div>;
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#000000ff" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#000000ff" tick={{ fontSize: 11 }} tickFormatter={yAxisFormat ? yAxisFormat : yAxisFormatter} width={50} />
                    <Tooltip contentStyle={{ backgroundColor: '#96D653', border: '1px solid #334155', borderRadius: '8px' }} formatter={formatter ? formatter : (val) => val.toLocaleString('pt-BR')} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" name="2024" dataKey="2024" stroke="#f43f5e" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                    <Line type="monotone" name="2025" dataKey="2025" stroke="#118DFF" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                    <Line type="monotone" name="2026" dataKey="2026" stroke="#12239E" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
