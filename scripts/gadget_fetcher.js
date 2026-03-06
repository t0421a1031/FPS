import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env ファイル読み込み（dotenvパッケージ不要の簡易パーサー）
function loadEnv() {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8');
        raw.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
                if (match && match[2]) {
                    process.env[match[1]] = match[2];
                }
            }
        });
    }
}
loadEnv();

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;

/**
 * 1. Read existing gadgets.json which serves as our master database
 *    of "What pros are currently using".
 * 2. Hit the affiliate API to update the latest pricing in real-time.
 * 3. Write back to data/gadgets.json so the frontend can display fresh data.
 */

async function fetchGadgetPrices() {
    console.log("Starting Gadget Price Update Batch...");

    const dataPath = path.join(__dirname, '../data/gadgets.json');
    let gadgetCategories;

    try {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        gadgetCategories = JSON.parse(rawData);
    } catch (err) {
        console.error("❌ Failed to read data/gadgets.json. Run node script from root or ensure file exists.", err);
        return;
    }

    // Iterate over all categories and their items
    let updateCount = 0;
    for (const [key, category] of Object.entries(gadgetCategories)) {
        for (const item of category.items) {
            console.log(`Checking price for: ${item.name}`);

            // ==========================================
            // TODO: Implement actual API fetch here.
            // E.g., const res = await fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&keyword=${encodeURIComponent(item.name)}&applicationId=${RAKUTEN_APP_ID}`);
            // const apiData = await res.json();
            // const latestPrice = apiData.Items[0].Item.itemPrice;
            // ==========================================

            // Simulation of a price update for proof-of-concept
            // We randomly update the price text slightly to show the script working
            const mockBasePrice = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 20000;
            const variation = Math.floor(Math.random() * 2000) - 1000; // Fluctuation +/- 1000 yen
            const newPrice = mockBasePrice + variation;

            item.price = `¥${newPrice.toLocaleString()}`;
            updateCount++;
        }
    }

    // Write updated prices back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(gadgetCategories, null, 2));
    console.log(`\n🎉 Scheduled job finished! Updated prices for ${updateCount} gadgets in data/gadgets.json`);
}

fetchGadgetPrices();
