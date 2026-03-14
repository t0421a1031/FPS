import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const YAHOO_BASE = 'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3765175&pid=892563175&vc_url=';

function createYahooUrl(name) {
    const searchUrl = 'https://shopping.yahoo.co.jp/search?p=' + name.replace(/ /g, '+');
    return YAHOO_BASE + encodeURIComponent(searchUrl);
}

// 1. Process usage_rates.json
const usagePath = path.join(__dirname, '../public/data/usage_rates.json');
let usageData = JSON.parse(fs.readFileSync(usagePath, 'utf8'));

for (const catKey in usageData) {
    const cat = usageData[catKey];
    for (const gameKey in cat.games) {
        cat.games[gameKey].forEach(item => {
            item.yahooUrl = createYahooUrl(item.name);
        });
    }
}
fs.writeFileSync(usagePath, JSON.stringify(usageData, null, 4));

// 2. Process guides.json
const guidesPath = path.join(__dirname, '../public/data/guides.json');
let guidesData = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));

guidesData.forEach(guide => {
    guide.items.forEach(item => {
        item.yahooUrl = createYahooUrl(item.name);
    });
});
fs.writeFileSync(guidesPath, JSON.stringify(guidesData, null, 4));

// 3. Process gadgets.json
const gadgetsPath = path.join(__dirname, '../public/data/gadgets.json');
let gadgetsData = JSON.parse(fs.readFileSync(gadgetsPath, 'utf8'));

for (const catKey in gadgetsData) {
    const cat = gadgetsData[catKey];
    cat.items.forEach(item => {
        item.yahooUrl = createYahooUrl(item.name);
    });
}
fs.writeFileSync(gadgetsPath, JSON.stringify(gadgetsData, null, 4));

console.log('Yahoo URLs strictly overwritten successfully.');
