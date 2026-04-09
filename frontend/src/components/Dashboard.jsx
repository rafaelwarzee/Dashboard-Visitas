import { useState, useEffect, useMemo } from 'react';
import { fetchSource2, fetchInsights, saveInsights, deleteInsights } from '../services/api';
import OverlapChart from './OverlapChart';
import ComposedChart2026 from './ComposedChart2026';
import './Dashboard.css';

const formatNum = (val) => parseFloat(val).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
const formatDec = (val) => parseFloat(val).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const formatMon = (val) => parseFloat(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatPct = (val) => (parseFloat(val) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '%';
const formatShortNum = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
    return val;
};

const parseNumber = (val) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    let s = val.toString().trim();
    if (s.startsWith('R$')) s = s.replace('R$', '').trim();
    s = s.replace(/\./g, '').replace(',', '.');
    return parseFloat(s) || 0;
};

function forecastNext(arr) {
    if (arr.length < 2) return arr[arr.length - 1] || 0;
    const n = arr.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        const x = i + 1;
        const y = arr[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    return Math.max(0, m * (n + 1) + b);
}

const ALL_WEEKS = Array.from({ length: 53 }, (_, i) => `W${String(i + 1).padStart(2, '0')}`);
const YEARS = ['2024', '2025', '2026'];

export default function Dashboard() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [startWeek, setStartWeek] = useState('0');
    const [endWeek, setEndWeek] = useState('52');
    const [selectedYears, setSelectedYears] = useState(new Set(YEARS));

    // Insights state
    const [note, setNote] = useState('');
    const [isEditingNote, setIsEditingNote] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [dashRes, insightRes] = await Promise.all([
                    fetchSource2(),
                    fetchInsights()
                ]);
                setData(dashRes);
                setNote(insightRes.note || '');
            } catch (e) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const toggleYear = (yr) => {
        const next = new Set(selectedYears);
        if (next.has(yr)) next.delete(yr); else next.add(yr);
        setSelectedYears(next);
    };

    const isWeekInRange = (index) => {
        return index >= parseInt(startWeek) && index <= parseInt(endWeek);
    };

    const getTabName = (base, year) => {
        if (currentPage === 3) return `Total CE_MX_Organico${year}`;
        return `${base}${year}`;
    };

    const stats = useMemo(() => {
        const tab26 = getTabName('Total CE_MX ', '2026');
        const tab25 = getTabName('Total CE_MX ', '2025');
        const arr26 = data[tab26] || [];
        const arr25 = data[tab25] || [];
        
        let sum26 = 0, sum25 = 0;
        let totalOrder = 0;
        let totalRevenue = 0;
        
        let actualStart = parseInt(startWeek);
        let actualEnd = parseInt(endWeek);
        
        for(let i=actualStart; i<=actualEnd; i++) {
            sum26 += parseNumber(arr26[i]?.Visitas);
            sum25 += parseNumber(arr25[i]?.Visitas);
            totalOrder += parseNumber(arr26[i]?.Order);
            totalRevenue += parseNumber(arr26[i]?.Revenue);
        }
        
        const diff = sum26 - sum25;
        const pct = sum25 > 0 ? (diff / sum25) * 100 : 0;
        const ticketMedio = totalOrder > 0 ? totalRevenue / totalOrder : 0;

        const validRows = arr26.filter(row => parseNumber(row?.Visitas) > 0);
        let forecast = null;
        if (validRows.length >= 2) {
            const visArr = validRows.map(r => parseNumber(r.Visitas));
            const crArr = validRows.map(r => parseNumber(r['Indice de Conversao']));
            const rpcArr = validRows.map(r => parseNumber(r['Receita / Visitas']));
            
            const nextVis = forecastNext(visArr);
            const nextCr = forecastNext(crArr);
            const nextRpc = forecastNext(rpcArr);

            const lastRow = validRows[validRows.length - 1];
            const lastVis = parseNumber(lastRow.Visitas);
            const lastCr = parseNumber(lastRow['Indice de Conversao']);
            const lastRpc = parseNumber(lastRow['Receita / Visitas']);

            forecast = {
                nextWeekLabel: `W${String(validRows.length + 1).padStart(2,'0')}`,
                visitas: nextVis,
                cr: nextCr,
                rpc: nextRpc,
                trends: {
                    visitas: nextVis >= lastVis ? 'up' : 'down',
                    cr: nextCr >= lastCr ? 'up' : 'down',
                    rpc: nextRpc >= lastRpc ? 'up' : 'down'
                }
            };
        }

        return { sum25, sum26, diff, pct, totalOrder, ticketMedio, forecast, startCoverage: actualStart + 1, endCoverage: actualEnd + 1 };
    }, [data, startWeek, endWeek, currentPage]);

    const generateOverlap = (metricField, weightedByVisits = false) => {
        const result = [];
        const aggResult = { '2024': 0, '2025': 0, '2026': 0 };
        const visitWeights = { '2024': 0, '2025': 0, '2026': 0 };
        const weightedSums = { '2024': 0, '2025': 0, '2026': 0 };

        let maxLen = 0;
        YEARS.forEach(y => { maxLen = Math.max(maxLen, (data[getTabName('Total CE_MX ', y)]||[]).length); });
        
        for(let i=0; i<maxLen; i++) {
            if (!isWeekInRange(i)) continue;
            const row = { name: `W${String(i+1).padStart(2, '0')}` };
            
            YEARS.forEach(y => {
                if (selectedYears.has(y)) {
                    const arr = data[getTabName('Total CE_MX ', y)] || [];
                    const val = parseNumber(arr[i]?.[metricField]);
                    row[y] = val;
                    
                    if (weightedByVisits) {
                        const v = parseNumber(arr[i]?.Visitas);
                        weightedSums[y] += (val * v);
                        visitWeights[y] += v;
                    } else {
                        aggResult[y] += val;
                    }
                }
            });
            result.push(row);
        }

        if (weightedByVisits) {
            YEARS.forEach(y => { aggResult[y] = visitWeights[y] > 0 ? weightedSums[y] / visitWeights[y] : 0; });
        }
        
        return { chart: result, agg: aggResult };
    };

    const composedData = useMemo(() => {
        const tab = getTabName('Total CE_MX ', '2026');
        const arr = data[tab] || [];
        return arr.filter((_, i) => isWeekInRange(i)).map((row, i) => ({
            name: `W${String(i + 1 + parseInt(startWeek)).padStart(2, '0')}`,
            Visitas: parseNumber(row.Visitas),
            CR: parseNumber(row['Indice de Conversao']),
            Revenue: parseNumber(row.Revenue),
            RPC: parseNumber(row['Receita / Visitas']),
            Order: parseNumber(row.Order)
        }));
    }, [data, startWeek, endWeek, currentPage]);

    const handleSaveNote = async () => {
        try {
            await saveInsights(note);
            setIsEditingNote(false);
        } catch (e) {
            alert('Erro ao salvar insights no servidor.');
        }
    };

    const handleDeleteNote = async () => {
        const password = window.prompt('Para excluir permanentemente, digite a senha de autorização:');
        if (password === null) return; 
        
        try {
            console.log('Solicitando exclusão com senha...');
            await deleteInsights(password);
            console.log('Exclusão concluída com sucesso.');
            setNote('');
            setIsEditingNote(false);
        } catch (e) {
            console.error('Falha na exclusão:', e);
            if (e.response && e.response.status === 401) {
                alert('Senha incorreta! A exclusão não foi autorizada.');
            } else {
                alert('Erro ao excluir insights no servidor. Verifique o console.');
            }
        }
    };

    if (loading) return <div className="loader">Carregando Analytics...</div>;
    if (error) return <div className="error">{error}</div>;

    const renderKPIs = () => {
        if (currentPage === 1 || currentPage === 3) {
            return (
                <div className="cards-row">
                    <div className="ytd-card glass">
                        <div>
                            <h3>Total Visitas YTD 25</h3>
                            <div className="val">{formatNum(stats.sum25)}</div>
                            <span>(W{String(stats.startCoverage).padStart(2,'0')} à W{String(stats.endCoverage).padStart(2,'0')})</span>
                        </div>
                        <div>
                            <h3>VS YTD 26 Variation</h3>
                            <div className={`diff ${stats.diff >= 0 ? 'positive' : 'negative'}`}>
                                {stats.diff > 0 ? '+' : ''}{formatNum(stats.diff)} ({formatDec(stats.pct)}%)
                            </div>
                        </div>
                        <div>
                            <h3>Total Visitas YTD 26</h3>
                            <div className="val">{formatNum(stats.sum26)}</div>
                            <span>(W{String(stats.startCoverage).padStart(2,'0')} à W{String(stats.endCoverage).padStart(2,'0')})</span>
                        </div>
                    </div>
                    {stats.forecast && (
                        <div className="ytd-card forecast glass">
                            <h3 className="accent-label">🔥 Tendência 2026 (Próxima: {stats.forecast.nextWeekLabel})</h3>
                            <div className="forecast-grid">
                                <div>
                                    <span className="label">VISITAS</span>
                                    <div className="val">{formatNum(stats.forecast.visitas)}</div>
                                    <div className={`trend-status ${stats.forecast.trends.visitas}`}>
                                        <span className="bullet">{stats.forecast.trends.visitas === 'up' ? '▲' : '▼'}</span>
                                        <span className="w-comp">(W-1)</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="label">CONVERSÃO</span>
                                    <div className="val">{formatPct(stats.forecast.cr)}</div>
                                    <div className={`trend-status ${stats.forecast.trends.cr}`}>
                                        <span className="bullet">{stats.forecast.trends.cr === 'up' ? '▲' : '▼'}</span>
                                        <span className="w-comp">(W-1)</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="label">RECEITA / VISITAS</span>
                                    <div className="val">{formatMon(stats.forecast.rpc)}</div>
                                    <div className={`trend-status ${stats.forecast.trends.rpc}`}>
                                        <span className="bullet">{stats.forecast.trends.rpc === 'up' ? '▲' : '▼'}</span>
                                        <span className="w-comp">(W-1)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div className="cards-row">
                    <div className="ytd-card glass single-val">
                        <div>
                            <h3>Total de Pedidos</h3>
                            <div className="val">{formatNum(stats.totalOrder)}</div>
                            <span>Período selecionado (2026)</span>
                        </div>
                    </div>
                    <div className="ytd-card glass single-val">
                        <div>
                            <h3>Total de Ticket Médio</h3>
                            <div className="val">{formatMon(stats.ticketMedio)}</div>
                            <span>Ticket Médio Geral (2026)</span>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="dashboard">
            <header className="dash-header">
                <h1>Dashboard Análise de Visitas</h1>
                <nav className="page-nav">
                    <button className={currentPage === 1 ? 'active' : ''} onClick={() => setCurrentPage(1)}>Página 1: Geral</button>
                    <button className={currentPage === 2 ? 'active' : ''} onClick={() => setCurrentPage(2)}>Página 2: Pedidos</button>
                    <button className={currentPage === 3 ? 'active' : ''} onClick={() => setCurrentPage(3)}>Página 3: Orgânico</button>
                </nav>
            </header>

            {renderKPIs()}

            <div className="main-controls-row">
                <div className="slicer-container glass">
                    <div className="slicer-row">
                        <div className="slicer-col">
                            <label>Slicer: Anos</label>
                            <div className="btn-group">
                                {YEARS.map(y => (
                                    <button key={y} onClick={() => toggleYear(y)} className={selectedYears.has(y) ? 'active' : ''}>{y}</button>
                                ))}
                            </div>
                        </div>
                        <div className="slicer-col">
                            <label>Range (Semana Inicial)</label>
                            <select className="custom-select" value={startWeek} onChange={(e) => setStartWeek(e.target.value)}>
                                {ALL_WEEKS.map((w, i) => <option key={`s-${i}`} value={i}>{w}</option>)}
                            </select>
                        </div>
                        <div className="slicer-col">
                            <label>Range (Semana Final)</label>
                            <select className="custom-select" value={endWeek} onChange={(e) => setEndWeek(e.target.value)}>
                                {ALL_WEEKS.map((w, i) => <option key={`e-${i}`} value={i}>{w}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="notes-container glass">
                    <div className="notes-header">
                        <h3>📋 Insights</h3>
                        <div className="notes-actions">
                            {!isEditingNote ? (
                                <button onClick={() => setIsEditingNote(true)} className="btn-blue">Adicionar/Editar</button>
                            ) : (
                                <button onClick={handleSaveNote} className="btn-green">Salvar</button>
                            )}
                            <button onClick={handleDeleteNote} className="btn-red">Excluir</button>
                        </div>
                    </div>
                    {isEditingNote ? (
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Digite suas observações aqui..." className="notes-textarea" />
                    ) : (
                        <div className="notes-display">{note || <span className="placeholder">Nenhum insight...</span>}</div>
                    )}
                </div>
            </div>

            <div className="charts-grid-container">
                {currentPage === 1 && (
                    <>
                        <ChartCard title="1. Visitas (TOTAL CE+MX)" data={generateOverlap('Visitas')} />
                        <ChartCard title="2. Índice de Conversão (TOTAL CE+MX)" data={generateOverlap('Indice de Conversao', true)} formatter={formatPct} />
                        <ChartCard title="3. Receita (TOTAL CE+MX)" data={generateOverlap('Revenue')} formatter={formatMon} />
                        <ChartCard title="4. Receita / Visitas (Total CE+MX)" data={generateOverlap('Receita / Visitas', true)} formatter={formatMon} />
                    </>
                )}
                {currentPage === 2 && (
                    <>
                        <ComposedCard title="1. Análise 2026: Visitas vs Índice de Conversão" data={composedData} metricKey="CR" metricName="Conversão" formatter={formatPct} />
                        <ComposedCard title="2. Análise 2026: Visitas vs Receita" data={composedData} metricKey="Revenue" metricName="Receita" formatter={formatMon} />
                        <ComposedCard title="3. Análise 2026: Visitas vs Receita / Visitas" data={composedData} metricKey="RPC" metricName="Receita / Visitas" formatter={formatMon} />
                        <ComposedCard title="4. Análise 2026: Visitas vs Pedidos" data={composedData} metricKey="Order" metricName="Pedidos" formatter={formatNum} />
                    </>
                )}
                {currentPage === 3 && (
                    <>
                        <ChartCard title="1. Visitas (ORGÂNICOS CE+MX)" data={generateOverlap('Visitas')} />
                        <ChartCard title="2. Índice de Conversão (ORGÂNICOS CE+MX)" data={generateOverlap('Indice de Conversao', true)} formatter={formatPct} />
                        <ChartCard title="3. Receita (ORGÂNICOS CE+MX)" data={generateOverlap('Revenue')} formatter={formatMon} />
                        <ChartCard title="4. Receita / Visitas (ORGÂNICOS CE+MX)" data={generateOverlap('Receita / Visitas', true)} formatter={formatMon} />
                        <ComposedCard title="5. Análise 2026: Visitas vs Índice de Conversão (Orgânico)" data={composedData} metricKey="CR" metricName="Conversão" formatter={formatPct} />
                        <ComposedCard title="6. Análise 2026: Visitas vs Receita / Visitas (Orgânico)" data={composedData} metricKey="RPC" metricName="Receita / Visitas" formatter={formatMon} />
                        <ComposedCard title="7. Análise 2026: Visitas vs Receita (Orgânico)" data={composedData} metricKey="Revenue" metricName="Receita" formatter={formatMon} />
                        <ComposedCard title="8. Análise 2026: Visitas vs Pedidos (Orgânico)" data={composedData} metricKey="Order" metricName="Pedidos" formatter={formatNum} />
                    </>
                )}
            </div>
        </div>
    );
}

function ChartCard({ title, data, formatter }) {
    return (
        <div className="chart-wrapper glass">
            <div className="chart-header">
                <h3>{title}</h3>
                <div className="mini-kpi-group">
                    {YEARS.map(y => data.agg[y] > 0 && (
                        <div className="mini-kpi" key={y}><span className="label">{y}</span><span className="value">{formatter ? formatter(data.agg[y]) : formatShortNum(data.agg[y])}</span></div>
                    ))}
                </div>
            </div>
            <OverlapChart data={data.chart} formatter={formatter} yAxisFormat={formatShortNum} />
        </div>
    );
}

function ComposedCard({ title, data, metricKey, metricName, formatter }) {
    return (
        <div className="chart-wrapper glass">
            <div className="chart-header"><h3>{title}</h3></div>
            <ComposedChart2026 data={data} metricKey={metricKey} metricName={metricName} formatter={formatter} />
        </div>
    );
}
