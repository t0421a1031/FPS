import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env ファイル読み込み
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
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;

const API_BASE = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601';
const ORIGIN = 'https://t0421a1031.github.io';
const REFERER = 'https://t0421a1031.github.io/FPS/';

// 商品名 → 楽天検索に適したキーワードに変換
const KEYWORD_MAP = {
    'Logicool G PRO X SUPERLIGHT 2': 'SUPERLIGHT2 マウス',
    'Razer Viper V3 Pro': 'Viper V3 Pro マウス',
    'Finalmouse UltralightX': 'Finalmouse UltralightX マウス',
    'Wooting 60HE': 'Wooting 60HE',
    'Razer Huntsman V3 Pro': 'Huntsman V3 Pro',
    'DrunkDeer A75': 'DrunkDeer A75',
    'BenQ ZOWIE XL2546K': 'XL2546K',
    'ASUS ROG Swift PG27AQN': 'ROG PG27AQN',
    'BenQ ZOWIE XL2566K': 'XL2566K',
    'Shure MV7+': 'Shure MV7 マイク',
    'HyperX QuadCast S': 'QuadCast マイク',
    'Elgato Wave:3': 'Elgato Wave3',
    'HyperX Cloud III Wireless': 'Cloud III Wireless',
    'Logicool G PRO X 2 LIGHTSPEED': 'PRO X2 ヘッドセット',
    'SteelSeries Arctis Nova Pro': 'Arctis Nova Pro'
};

// カテゴリ別の最低価格フィルター（アクセサリを除外するため）
const MIN_PRICE_MAP = {
    'mouse': 10000,
    'keyboard': 10000,
    'monitor': 30000,
    'mic': 10000,
    'headset': 10000
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGadgetPrices() {
    if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
        console.warn("⚠️  RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY is not set. Skipping.");
        return;
    }

    console.log("🏷️  Fetching latest prices from Rakuten API...\n");

    const dataPath = path.join(__dirname, '../public/data/gadgets.json');
    let gadgetData;

    try {
        gadgetData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        console.error("❌ Failed to read gadgets.json:", err.message);
        return;
    }

    let updateCount = 0;
    let errorCount = 0;

    for (const [categoryKey, category] of Object.entries(gadgetData)) {
        console.log(`\n📦 [${category.label}]`);
        const minPrice = MIN_PRICE_MAP[categoryKey] || 3000;

        for (const item of category.items) {
            try {
                const searchKeyword = KEYWORD_MAP[item.name] || item.name;
                const keyword = encodeURIComponent(searchKeyword);
                const url = `${API_BASE}?format=json&keyword=${keyword}&hits=5&sort=-reviewCount&minPrice=${minPrice}&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}`;

                const response = await fetch(url, {
                    headers: { 'Origin': ORIGIN, 'Referer': REFERER }
                });
                const data = await response.json();

                if (data.Items && data.Items.length > 0) {
                    // 価格を収集してソート
                    const prices = data.Items
                        .map(e => e.Item.itemPrice)
                        .filter(p => p >= minPrice)
                        .sort((a, b) => a - b);

                    if (prices.length > 0) {
                        // 最安値を採用（ただしminPrice以上の商品のみ）
                        const bestPrice = prices[0];
                        const oldPrice = item.price;
                        item.price = `¥${bestPrice.toLocaleString()}`;
                        updateCount++;

                        if (oldPrice !== item.price) {
                            console.log(`  ✅ ${item.name}: ${oldPrice} → ${item.price}`);
                        } else {
                            console.log(`  ⏸️  ${item.name}: ${item.price} (変更なし)`);
                        }
                    } else {
                        console.log(`  ⚠️  ${item.name}: 適正価格の商品なし（スキップ）`);
                    }
                } else if (data.error || data.errors) {
                    const msg = data.error_description || data.errors?.errorMessage || 'Unknown';
                    console.log(`  ❌ ${item.name}: API Error - ${msg}`);
                    errorCount++;
                } else {
                    console.log(`  ❌ ${item.name}: 商品が見つかりません`);
                    errorCount++;
                }

                await sleep(1200);

            } catch (error) {
                console.error(`  ❌ ${item.name}: エラー - ${error.message}`);
                errorCount++;
            }
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(gadgetData, null, 4) + '\n', 'utf8');
    console.log(`\n🎉 価格更新完了! 更新: ${updateCount}件, エラー: ${errorCount}件`);
}

fetchGadgetPrices();
