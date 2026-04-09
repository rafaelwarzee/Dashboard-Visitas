import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ComposedChart2026({ data, metricKey, metricName, formatter }) {
    if (!data || data.length === 0) return <div className="loader">Sem dados...</div>;

    // Formatting tooltip accurately
    const customTooltipFormatter = (value, name) => {
        if (name === "Visitas 2026") return value.toLocaleString('pt-BR');
        if (formatter) return formatter(value);
        return value;
    };

    const formatVisitas = (value) => {
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
        return value;
    };

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#000000ff" tick={{ fontSize: 12 }} />

                    <YAxis yAxisId="left" stroke="#000000ff" tick={{ fontSize: 11 }} tickFormatter={formatVisitas} width={50} />
                    <YAxis yAxisId="right" orientation="right" stroke="#000000ff" tick={{ fontSize: 11 }} tickFormatter={formatter} width={60} />

                    <Tooltip
                        contentStyle={{ backgroundColor: '#96D653', border: '1px solid #334155', borderRadius: '8px' }}
                        formatter={customTooltipFormatter}
                    />
                    <Legend verticalAlign="top" height={36} />

                    <Bar yAxisId="left" dataKey="Visitas" barSize={20} fill="#12239E" name="Visitas 2026" />
                    <Line yAxisId="right" type="monotone" dataKey={metricKey} stroke="#ff0037ff" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 8 }} name={metricName} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
