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

// ゲームタイトルに基づいてタグを自動判定
function detectTag(title) {
    const lower = title.toLowerCase();
    if (/キル集|montage|highlight/i.test(title)) return 'キル集';
    if (/大会|ALGS|FNCS|VCT|EWC|ディビジョン|予選|決勝|世界大会|championship/i.test(title)) return '大会';
    if (/ハイライト|クラッチ|ビクロイ|優勝|1位/i.test(title)) return 'ハイライト';
    if (/デバイス|マウス|キーボード|モニター|ヘッドセット|デスク|手元/i.test(title)) return 'デバイス紹介';
    if (/設定|感度|解説|コーチング|立ち回り|練習/i.test(title)) return '解説';
    return '解説';
}

// streamers.json からYouTubeチャンネル情報を読み込む
function loadStreamers() {
    const streamersPath = path.join(__dirname, '../public/data/streamers.json');
    if (!fs.existsSync(streamersPath)) {
        console.error('❌ streamers.json not found');
        return [];
    }
    const data = JSON.parse(fs.readFileSync(streamersPath, 'utf8'));
    return data.streamers || [];
}

// チャンネルハンドルからチャンネルIDとアップロードプレイリストIDを取得
async function getChannelInfo(handle) {
    // @付きハンドルの場合
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(cleanHandle)}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.error(`  ❌ API Error for ${handle}: ${data.error.message}`);
        return null;
    }

    if (!data.items || data.items.length === 0) {
        // ハンドルで見つからない場合、channelIdとして直接試す
        const url2 = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${encodeURIComponent(handle)}&key=${API_KEY}`;
        const response2 = await fetch(url2);
        const data2 = await response2.json();
        if (!data2.items || data2.items.length === 0) {
            console.warn(`  ⚠️  Channel not found: ${handle}`);
            return null;
        }
        return {
            channelId: data2.items[0].id,
            channelTitle: data2.items[0].snippet.title,
            uploadsPlaylistId: data2.items[0].contentDetails.relatedPlaylists.uploads
        };
    }

    return {
        channelId: data.items[0].id,
        channelTitle: data.items[0].snippet.title,
        uploadsPlaylistId: data.items[0].contentDetails.relatedPlaylists.uploads
    };
}

// アップロードプレイリストから最新動画を取得
async function getLatestVideos(playlistId, maxResults = 3) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.error(`  ❌ Playlist error: ${data.error.message}`);
        return [];
    }

    return (data.items || [])
        .filter(item => item.snippet.resourceId.kind === 'youtube#video')
        .map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt
        }));
}

async function fetchYouTubeData() {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
        console.warn("⚠️  YOUTUBE_API_KEY is not set. Skipping API fetch.");
        return;
    }

    // streamers.json からチャンネル情報を読み込む
    const streamers = loadStreamers();
    // YouTubeプラットフォームのストリーマーのみ + Twitch等のストリーマーも含む（YouTube URLがあれば）
    const youtubeStreamers = streamers.filter(s =>
        s.platform === 'youtube' || s.url?.includes('youtube.com')
    );

    console.log(`📺 Found ${youtubeStreamers.length} YouTube channels in streamers.json`);

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

    console.log(`   Existing videos: ${existingData.videos.length}`);
    let newCount = 0;

    for (const streamer of youtubeStreamers) {
        const displayName = streamer.team
            ? `${streamer.name} (${streamer.team})`
            : streamer.name;

        console.log(`\n🔍 Processing: ${displayName} [${streamer.game}]`);

        try {
            // チャンネルハンドルを取得（URLから抽出）
            let handle = streamer.channelId;
            if (streamer.url && streamer.url.includes('youtube.com/@')) {
                handle = streamer.url.split('/@')[1].split('/')[0];
            }

            const channelInfo = await getChannelInfo(handle);
            if (!channelInfo) continue;

            console.log(`   Channel: ${channelInfo.channelTitle}`);

            // 最新3件の動画を取得
            const videos = await getLatestVideos(channelInfo.uploadsPlaylistId, 3);

            for (const video of videos) {
                // 重複チェック
                if (existingIds.has(video.videoId)) {
                    console.log(`   ⏭️  Skip (exists): ${video.title.substring(0, 50)}...`);
                    continue;
                }

                // Shorts（60秒未満の縦動画）はタイトルで簡易判定
                const isShort = video.title.includes('#shorts') || video.title.includes('#Shorts');

                const newVideo = {
                    id: `v_auto_${video.videoId}`,
                    title: `${displayName}: ${video.title}`,
                    pro: displayName,
                    game: streamer.game,
                    tag: detectTag(video.title),
                    platform: 'youtube',
                    url: `https://www.youtube.com/watch?v=${video.videoId}`,
                    youtubeId: video.videoId
                };

                existingData.videos.push(newVideo);
                existingIds.add(video.videoId);
                newCount++;
                console.log(`   ✅ New: ${video.title.substring(0, 60)}...`);
            }

            // API レート制限を避けるため少し待つ
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    // 結果を保存
    fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 4) + '\n', 'utf8');
    console.log(`\n🎉 Done! Added ${newCount} new videos. Total: ${existingData.videos.length}`);
}

fetchYouTubeData();
