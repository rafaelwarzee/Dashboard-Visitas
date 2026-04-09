import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#f43f5e', '#10b981', '#fbbf24', '#a78bfa', '#f472b6'];

export default function CategoryMixChart({ data, metricKey, metricName, formatter }) {
    if (!data || data.length === 0) return <div className="loader">Sem dados de categorias...</div>;
    
    // Sort by metricKey descending
    const sortedData = [...data].sort((a, b) => (b[metricKey] || 0) - (a[metricKey] || 0)).slice(0, 10);

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                    <XAxis type="number" stroke="#cbd5e1" tick={{fontSize: 11}} tickFormatter={formatter} />
                    <YAxis type="category" dataKey="Categoria" stroke="#cbd5e1" tick={{fontSize: 12}} width={100} />
                    <Tooltip 
                        contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}}
                        formatter={(val) => formatter ? formatter(val) : val.toLocaleString('pt-BR')}
                    />
                    <Bar dataKey={metricKey} name={metricName} radius={[0, 4, 4, 0]}>
                        {sortedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
