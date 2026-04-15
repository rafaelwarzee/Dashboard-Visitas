const axios = require('axios');
const Papa = require('papaparse');
const xlsx = require('xlsx');

const URL1 = 'https://docs.google.com/spreadsheets/d/1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk/export?format=csv&gid=0';
const URL2_XLSX = 'https://docs.google.com/spreadsheets/d/1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108/export?format=xlsx';

let cacheSource1 = null;
let cacheSource2Workbook = null;
let isFetching1 = false;
let isFetching2 = false;

async function fetchAndParseCSV(url) {
    const response = await axios.get(url);
    const parsed = Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });
    return parsed.data;
}

async function fetchAndParseXLSX(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const workbook = xlsx.read(response.data, { type: 'buffer', cellDates: true, dateNF: 'yyyy-mm-dd' });
    
    const parsedTabs = {};
    for (const sheetName of workbook.SheetNames) {
        parsedTabs[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null, raw: true });
    }
    return parsedTabs;
}

function normalizeKey(key) {
    if (!key) return key;
    return key.trim()
        .replace(/Ticket Mdio/g, 'Ticket Médio')
        .replace(/Ticket Médio/g, 'Ticket Médio')
        .replace(/Indice de Conversao/g, 'Indice de Conversao')
        .replace(/Índice de Conversão \(Visitante UNICO\)/g, 'Indice de Conversao VU')
        .replace(/Índice de Conversão/g, 'Indice de Conversao')
        .replace(/Índice de conversão/g, 'Indice de Conversao')
        .replace(/ndice de converso/g, 'Indice de Conversao')
        .replace(/Receita \/ Visitas/g, 'Receita / Visitas')
        .replace(/Receita \/ Visitante/g, 'Receita / Visitante')
        .replace(/Visitantes únicos/g, 'Visitantes unicos')
        .replace(/Revenue \(purchase event\)/g, 'Revenue')
        .replace(/Divisão/g, 'Divisao')
        .replace(/Mês/g, 'Mes');
}

function parseVal(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    let s = val.toString().replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(s) || 0;
}

function processData() {
    console.log("Processing Data... normalizing keys and metrics.");
    const processed = {};
    
    // Normalize and clean ALL tabs
    for (const sheetName in cacheSource2Workbook) {
        const normSheetName = normalizeKey(sheetName);
        processed[normSheetName] = cacheSource2Workbook[sheetName].map(row => {
            const newRow = {};
            for (let k in row) {
                const normK = normalizeKey(k);
                // We parse numeric values for known metric columns
                if (['Visitas', 'Revenue', 'Order', 'Receita / Visitas', 'Ticket Médio', 'Indice de Conversao', 'Visitantes unicos', 'Indice de Conversao VU', 'Receita / Visitante'].includes(normK)) {
                    newRow[normK] = parseVal(row[k]);
                } else {
                    newRow[normK] = row[k];
                }
            }
            return newRow;
        });
    }

    cacheSource2Workbook = processed;
}

async function refreshData() {
    try {
        if (!isFetching1) {
            isFetching1 = true;
            console.log('Fetching Source 1 (CSV)...');
            cacheSource1 = await fetchAndParseCSV(URL1);
            isFetching1 = false;
        }
    } catch (e) {
        console.error('Error fetching Source 1:', e.message);
        isFetching1 = false;
    }

    try {
        if (!isFetching2) {
            isFetching2 = true;
            console.log('Fetching Source 2 (XLSX)...');
            cacheSource2Workbook = await fetchAndParseXLSX(URL2_XLSX);
            processData();
            isFetching2 = false;
        }
    } catch (e) {
        console.error('Error fetching Source 2:', e.message);
        isFetching2 = false;
    }
}

async function getSource1() {
    if (!cacheSource1) await refreshData();
    return cacheSource1 || [];
}

async function getSource2() {
    if (!cacheSource2Workbook) await refreshData();
    return cacheSource2Workbook || {};
}

module.exports = {
    refreshData,
    getSource1,
    getSource2
};
