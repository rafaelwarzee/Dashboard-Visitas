import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function DualTrendChart({ data, title, keyTotal, keyOrg, formatter }) {
    if (!data || data.length === 0) return <div className="loader">Sem dados...</div>;
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#cbd5e1" tick={{fontSize: 10}} angle={-45} textAnchor="end" />
                    <YAxis stroke="#cbd5e1" tick={{fontSize: 11}} tickFormatter={formatter} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}} formatter={formatter} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" name="Total (CE+MX)" dataKey={keyTotal} stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                    <Line type="monotone" name="Orgânico (CE+MX)" dataKey={keyOrg} stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
