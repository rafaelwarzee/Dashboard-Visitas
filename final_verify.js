const dataService = require('./backend/src/dataService');

async function finalVerify() {
    try {
        const data = await dataService.getSource2();
        const tabs = Object.keys(data);
        console.log("--- FINAL VERIFICATION ---");
        console.log("Tabs in Source 2:", tabs);
        
        const testTabs = ["Total CE_MX 2024", "Total CE_MX_Organico2024", "Categorias"];
        testTabs.forEach(t => {
            if (data[t]) {
                console.log(`Tab [${t}] found with ${data[t].length} rows.`);
                if (data[t].length > 0) {
                    console.log(`  Sample keys for [${t}]:`, Object.keys(data[t][0]));
                }
            } else {
                console.log(`Tab [${t}] NOT FOUND.`);
            }
        });
    } catch (e) {
        console.error(e);
    }
}

finalVerify();
