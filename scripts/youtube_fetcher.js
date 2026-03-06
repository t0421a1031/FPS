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

const API_KEY = process.env.YOUTUBE_API_KEY;

// List of target channels/queries for automation
const targetChannels = [
    {
        pro: 'まうふぃん (Riddle)',
        channelId: 'UCe1y_qgA-I6N0-oO1GqX2Mw', // Maui's channel ID (example/actual)
        game: 'fortnite',
        tag: 'キル集',
        query: 'キル集'
    },
    {
        pro: 'ネフライト',
        channelId: 'UCFkncwHQ5KAWEVGcB-WIwNw', // Nephrite's channel ID
        game: 'fortnite',
        tag: '解説',
        query: '解説 OR 講座'
    },
    {
        pro: 'Ras (Crazy Raccoon)',
        channelId: 'UCLx13Hj52_DudlZ-n5vH5_Q', // Ras's channel ID
        game: 'apex',
        tag: 'キル集',
        query: 'キル集 OR montage'
    },
    {
        pro: 'ありさか',
        channelId: 'UC3WvQ8H34L9aW1tTiwv196A', // Arisaka
        game: 'apex',
        tag: '解説',
        query: '解説'
    }
    // You can expand this list easily
];

async function fetchYouTubeData() {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
        console.warn("⚠️  YOUTUBE_API_KEY is not set in .env file. Skipping API fetch for now.");
        console.warn("Please get an API key from Google Cloud Console and add it to .env");
        return;
    }

    console.log("Fetching latest videos from YouTube...");
    const newVideos = [];

    for (const target of targetChannels) {
        try {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${target.channelId}&q=${encodeURIComponent(target.query)}&order=date&maxResults=1&type=video&key=${API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                const videoId = item.id.videoId;

                newVideos.push({
                    id: videoId,
                    title: item.snippet.title,
                    pro: target.pro,
                    game: target.game,
                    tag: target.tag,
                    platform: 'youtube',
                    url: `https://www.youtube.com/watch?v=${videoId}`
                });
                console.log(`✅  Found video for ${target.pro}: ${item.snippet.title}`);
            } else {
                console.log(`❌  No recent videos found for ${target.pro} under query "${target.query}"`);
            }
        } catch (error) {
            console.error(`Error fetching data for ${target.pro}:`, error.message);
        }
    }

    // Write the results if any new videos found
    if (newVideos.length > 0) {
        const dataPath = path.join(__dirname, '../data/videos.json');
        fs.writeFileSync(dataPath, JSON.stringify({ videos: newVideos }, null, 2));
        console.log(`\n🎉  Successfully updated data/videos.json with ${newVideos.length} new videos!`);
    }
}

fetchYouTubeData();
