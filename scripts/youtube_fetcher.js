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

const API_KEY = process.env.YOUTUBE_API_KEY;

// 検索対象チャンネル・クエリの定義
const targetChannels = [
    // === FORTNITE ===
    {
        pro: 'まうふぃん (Riddle)',
        game: 'fortnite',
        tag: 'キル集',
        query: 'まうふぃん フォートナイト キル集',
        maxResults: 1
    },
    {
        pro: 'ネフライト',
        game: 'fortnite',
        tag: '解説',
        query: 'ネフライト フォートナイト 解説',
        maxResults: 1
    },
    {
        pro: 'ぼぶくん',
        game: 'fortnite',
        tag: 'ハイライト',
        query: 'ぼぶくん フォートナイト ハイライト',
        maxResults: 1
    },
    {
        pro: 'ネフライト',
        game: 'fortnite',
        tag: 'デバイス紹介',
        query: 'ネフライト デバイス紹介 ゲーミング',
        maxResults: 1
    },
    // === APEX LEGENDS ===
    {
        pro: 'Ras (Crazy Raccoon)',
        game: 'apex',
        tag: 'キル集',
        query: 'Ras Apex キル集 montage',
        maxResults: 1
    },
    {
        pro: 'ありさか',
        game: 'apex',
        tag: '解説',
        query: 'ありさか Apex 解説',
        maxResults: 1
    },
    {
        pro: 'Selly',
        game: 'apex',
        tag: 'デバイス紹介',
        query: 'Selly デバイス紹介 Apex ゲーミング',
        maxResults: 1
    },
    // === VALORANT ===
    {
        pro: 'Laz (ZETA DIVISION)',
        game: 'valorant',
        tag: 'ハイライト',
        query: 'Laz VALORANT VCT ハイライト',
        maxResults: 1
    },
    {
        pro: 'Dep (ZETA DIVISION)',
        game: 'valorant',
        tag: 'キル集',
        query: 'Dep VALORANT キル集',
        maxResults: 1
    },
    {
        pro: 'Laz (ZETA DIVISION)',
        game: 'valorant',
        tag: 'デバイス紹介',
        query: 'Laz ZETA デバイス紹介 ゲーミング',
        maxResults: 1
    }
];

async function fetchYouTubeData() {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
        console.warn("⚠️  YOUTUBE_API_KEY is not set. Skipping API fetch.");
        return;
    }

    // 既存の動画データを読み込み
    const dataPath = path.join(__dirname, '../public/data/videos.json');
    let existingData = { videos: [] };
    if (fs.existsSync(dataPath)) {
        existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    // 既存のYouTube IDセット（重複防止用）
    const existingIds = new Set(
        existingData.videos
            .filter(v => v.youtubeId)
            .map(v => v.youtubeId)
    );

    console.log(`📺 Fetching latest videos from YouTube...`);
    console.log(`   Existing videos: ${existingData.videos.length}`);
    let newCount = 0;

    for (const target of targetChannels) {
        try {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(target.query)}&order=date&maxResults=${target.maxResults}&type=video&regionCode=JP&relevanceLanguage=ja&key=${API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error(`❌ API Error: ${data.error.message}`);
                continue;
            }

            if (data.items && data.items.length > 0) {
                for (const item of data.items) {
                    const videoId = item.id.videoId;

                    // 重複チェック
                    if (existingIds.has(videoId)) {
                        console.log(`⏭️  Skip (already exists): ${item.snippet.title}`);
                        continue;
                    }

                    const newVideo = {
                        id: `v_auto_${videoId}`,
                        title: `${target.pro}: ${item.snippet.title}`,
                        pro: target.pro,
                        game: target.game,
                        tag: target.tag,
                        platform: 'youtube',
                        url: `https://www.youtube.com/watch?v=${videoId}`,
                        youtubeId: videoId
                    };

                    existingData.videos.push(newVideo);
                    existingIds.add(videoId);
                    newCount++;
                    console.log(`✅ New: [${target.game}/${target.tag}] ${item.snippet.title}`);
                }
            } else {
                console.log(`❌ No results for: ${target.query}`);
            }
        } catch (error) {
            console.error(`Error fetching ${target.pro}:`, error.message);
        }
    }

    // 結果を保存
    fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 4) + '\n', 'utf8');
    console.log(`\n🎉 Done! Added ${newCount} new videos. Total: ${existingData.videos.length}`);
}

fetchYouTubeData();
