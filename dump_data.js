const dataService = require('./backend/src/dataService');

async function dump() {
    try {
        const data = await dataService.getSource2();
        console.log("--- SOURCE 2 TABS ---");
        for (const tab in data) {
            console.log(`Tab: ${tab}, Rows: ${data[tab].length}`);
            if (data[tab].length > 0) {
                console.log("Columns:", Object.keys(data[tab][0]));
                console.log("First row snippet:", JSON.stringify(data[tab][0]).substring(0, 200));
            }
        }
    } catch (e) {
        console.error(e);
    }
}

dump();
