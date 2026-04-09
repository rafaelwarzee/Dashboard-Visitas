const fs = require('fs');

async function fetchCSV(url, name) {
    console.log(`Fetching ${name}...`);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        console.log(`--- ${name} (First 500 chars) ---`);
        console.log(text.substring(0, 500));
        console.log('--------------------------------\n');
    } catch (e) {
        console.error(`Error fetching ${name}: ${e.message}`);
    }
}

async function run() {
    await fetchCSV('https://docs.google.com/spreadsheets/d/1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk/export?format=csv&gid=0', 'URL 1');
    await fetchCSV('https://docs.google.com/spreadsheets/d/1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108/export?format=csv&gid=0', 'URL 2');
}

run();
