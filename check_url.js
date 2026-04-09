const axios = require('axios');
const xlsx = require('xlsx');

async function analyze() {
    const doc_id = '1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108';
    const url = `https://docs.google.com/spreadsheets/d/${doc_id}/export?format=xlsx`;
    
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const workbook = xlsx.read(response.data, { type: 'buffer' });
        const sheetName = 'Semana';
        
        if (workbook.SheetNames.includes(sheetName)) {
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            const columns = data[0];
            const sample = xlsx.utils.sheet_to_json(sheet).slice(0, 1);
            
            console.log('---JSON_START---');
            console.log(JSON.stringify({
                columns: columns,
                sample: sample
            }, null, 2));
            console.log('---JSON_END---');
        } else {
            console.log('Error: Sheet Semana not found');
        }
    } catch (e) {
        console.log('Error: ' + e.message);
    }
}

analyze();
