const axios = require('axios');
const xlsx = require('xlsx');
const fs = require('fs');

async function analyze() {
    const doc_id = '1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108';
    const url = `https://docs.google.com/spreadsheets/d/${doc_id}/export?format=xlsx`;
    const results = {};
    
    try {
        console.log('Fetching spreadsheet...');
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const workbook = xlsx.read(response.data, { type: 'buffer' });
        const sheetName = 'Semana';
        
        if (workbook.SheetNames.includes(sheetName)) {
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            const columns = data[0];
            results.columns = columns;
            
            const targetCols = ['Receita / Visitas', 'Order', 'Visitas', 'Revenue'];
            results.analysis = {};
            targetCols.forEach(tc => {
                const matches = columns.filter(col => col && col.toString().toLowerCase().includes(tc.toLowerCase()));
                results.analysis[tc] = {
                    found: matches.length > 0,
                    matches: matches
                };
            });
            
            results.sample = xlsx.utils.sheet_to_json(sheet).slice(0, 2);
        } else {
            results.error = `Sheet '${sheetName}' not found. Available: ${workbook.SheetNames}`;
        }
    } catch (e) {
        results.error = e.message;
    }
    
    fs.writeFileSync('column_analysis.json', JSON.stringify(results, null, 2));
    console.log('Done.');
}

analyze();
