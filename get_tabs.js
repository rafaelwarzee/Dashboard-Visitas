async function getSheets(documentId) {
    const url = `https://docs.google.com/spreadsheets/d/${documentId}/edit`;
    try {
        const response = await fetch(url);
        const data = await response.text();
        
        let found = [];
        // A known pattern is grid properties: [gid, "Title", ...] or ["Title",gid,...]
        // Let's just catch ["String", NUMBER] or [NUMBER, "String"]
        const matches = [...data.matchAll(/\[(\d+),"([^"]+)"/g)];
        for (let match of matches) {
            if (match[1].length > 5 || match[1] === "0") {
                found.push({gid: match[1], name: match[2]});
            }
        }
        const matches2 = [...data.matchAll(/\["([^"]+)",(\d+)/g)];
        for (let match of matches2) {
            if (match[2].length > 5 || match[2] === "0") {
                found.push({gid: match[2], name: match[1]});
            }
        }

        console.log("Candidate GIDs:");
        const unique = Array.from(new Set(found.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));
        // Filter out obviously wrong ones
        console.log(JSON.stringify(unique.filter(u => u.name.length > 2 && u.name.length < 50), null, 2));

    } catch (e) {
        console.error(e.message);
    }
}

async function run() {
    console.log("--- TABS FOR 1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108 (URL Planilha) ---");
    await getSheets('1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108');
    console.log("\n--- TABS FOR 1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk (URL Scraping) ---");
    await getSheets('1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk');
}

run();
