const dataService = require('./backend/src/dataService');

async function test() {
    console.log("Fetching Source 2...");
    const data = await dataService.getSource2();
    console.log("Tabs found:", Object.keys(data));
    if (data["Total CE_MX 2026"]) {
        console.log("Total CE_MX 2026 found! First row:", data["Total CE_MX 2026"][0]);
    } else {
        console.log("Total CE_MX 2026 NOT FOUND");
    }
}

test();
