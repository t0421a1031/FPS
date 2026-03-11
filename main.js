// ============================================================
// Platform SVG Icons (Generic, copyright-safe)
// ============================================================
const platformIcons = {
  youtube: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="12" fill="#FF0000" fill-opacity="0.15"/><path d="M38 18.6c-.3-1.2-1.2-2.1-2.4-2.4C33.4 15.6 24 15.6 24 15.6s-9.4 0-11.6.6c-1.2.3-2.1 1.2-2.4 2.4C9.4 20.8 9.4 24 9.4 24s0 3.2.6 5.4c.3 1.2 1.2 2.1 2.4 2.4 2.2.6 11.6.6 11.6.6s9.4 0 11.6-.6c1.2-.3 2.1-1.2 2.4-2.4.6-2.2.6-5.4.6-5.4s0-3.2-.6-5.4zM21.2 28.2v-8.4l7.8 4.2-7.8 4.2z" fill="#FF4444"/></svg>`,
  twitch: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="12" fill="#9146FF" fill-opacity="0.15"/><path d="M13 10l-3 7v21h8v4h4l4-4h6l8-8V10H13zm22 17l-5 5h-6l-4 4v-4h-5V13h20v14z" fill="#9146FF"/><path d="M29 17h3v8h-3zM22 17h3v8h-3z" fill="#9146FF"/></svg>`,
  x: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="12" fill="#ffffff" fill-opacity="0.08"/><path d="M28.7 12h4.2l-9.2 10.5L34 36h-8.5l-6.6-8.6L11.7 36H7.5l9.8-11.2L7 12h8.7l6 7.9L28.7 12zm-1.5 21.6h2.3L15.9 14.3h-2.5l13.8 19.3z" fill="#e0e0e0"/></svg>`,
};

// Gradient backgrounds for each game
const gameGradients = {
  fortnite: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #6c3bbf 100%)',
  apex: 'linear-gradient(135deg, #1a0000 0%, #6b1010 40%, #cc2828 100%)'
};

// ============================================================
// VIDEO DATA - Japanese Pro / Streamer Kill Montages & Commentary
// ============================================================
let videos = [];

// ============================================================
// GADGET DATA - 5 Categories with 3 Ranked Items Each
// ============================================================
let gadgetCategories = {};


// ============================================================
// PRIZE MONEY RANKINGS - Japanese Focus
// ============================================================
let rankings = [];
let usageRates = {};
let guides = [];
let salesData = {};

// ============================================================
// RENDER: VIDEOS (YouTube embedded + SNS cards)
// ============================================================
let currentVideoFilter = 'all';
let currentVideoTag = 'all';
let currentVideoPlatform = 'youtube'; // 'youtube' or 'sns'

// Avatar color generator (unique per player name)
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue}, 60%, 45%)`,
    light: `hsl(${hue}, 70%, 65%)`,
    dark: `hsl(${hue}, 50%, 25%)`
  };
}

function getInitial(name) {
  const clean = name.replace(/\s*\(.*\)\s*/g, '').replace(/\s*\/.*/, '').trim();
  return clean.charAt(0).toUpperCase();
}

function getPlatformSmallIcon(platform) {
  if (platform === 'youtube') return `<svg width="16" height="16" viewBox="0 0 24 24" fill="#FF4444"><path d="M19.6 3.2c-.3-.6-.9-1-1.6-1.2C16.4 1.6 12 1.6 12 1.6s-4.4 0-6 .4c-.7.2-1.3.6-1.6 1.2C4 4.8 4 8 4 8s0 3.2.4 4.8c.3.6.9 1 1.6 1.2 1.6.4 6 .4 6 .4s4.4 0 6-.4c.7-.2 1.3-.6 1.6-1.2.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 10.8V5.2l5.2 2.8-5.2 2.8z"/></svg>`;
  if (platform === 'twitch') return `<svg width="16" height="16" viewBox="0 0 24 24" fill="#9146FF"><path d="M4 2L2 6v14h5v3h3l3-3h4l5-5V2H4zm17 11l-4 4h-5l-3 3v-3H5V4h16v9z"/><path d="M15 7h2v5h-2zM11 7h2v5h-2z"/></svg>`;
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="#aaa"><path d="M14.3 2h2.1L11 8.5 17 16h-4.3l-3.3-4.3L5.9 16H3.8l5-5.6L3.5 2h4.4l3 4L14.3 2zm-.8 12.6h1.2L7.6 3.3H6.3l7.2 11.3z"/></svg>`;
}

function renderYouTubeVideos() {
  const grid = document.getElementById('youtube-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let filtered = videos.filter(v => v.platform === 'youtube' && v.youtubeId);
  if (currentVideoFilter !== 'all') {
    filtered = filtered.filter(v => v.game === currentVideoFilter);
  }
  if (currentVideoTag !== 'all') {
    filtered = filtered.filter(v => v.tag === currentVideoTag);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-results">該当するYouTube動画が見つかりません。</p>';
    return;
  }

  filtered.forEach((video, index) => {
    const card = document.createElement('div');
    card.className = 'youtube-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.style.cursor = 'pointer';

    const gameLabel = video.game === 'fortnite' ? 'FORTNITE' : video.game === 'valorant' ? 'VALORANT' : 'APEX';
    const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;

    card.innerHTML = `
      <div class="youtube-thumb-wrapper">
        <img src="${thumbUrl}" alt="${video.title}" class="youtube-thumb-img" loading="lazy">
        <div class="youtube-play-overlay">
          <svg class="youtube-play-icon" viewBox="0 0 68 48">
            <path d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.5C4 2.3 2.3 4.8 1.5 7.7.1 13 0 24 0 24s.1 11 1.5 16.3c.8 2.9 2.5 5.4 5.4 6.2C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.5c2.9-.8 4.6-3.3 5.4-6.2C67.9 35 68 24 68 24s-.1-11-1.5-16.3z" fill="#FF0000"/>
            <path d="M27 34V14l18 10-18 10z" fill="#fff"/>
          </svg>
        </div>
      </div>
      <div class="youtube-card-info">
        <div class="youtube-card-badges">
          <span class="channel-game-badge">${gameLabel}</span>
          <span class="video-tag-badge">${video.tag}</span>
        </div>
        <div class="youtube-card-pro">${video.pro}</div>
        <h3 class="youtube-card-title">${video.title}</h3>
      </div>
    `;
    card.addEventListener('click', () => window.open(video.url, '_blank'));
    grid.appendChild(card);
  });
}

function renderSNSVideos() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let filtered = videos.filter(v => v.platform !== 'youtube');
  if (currentVideoFilter !== 'all') {
    filtered = filtered.filter(v => v.game === currentVideoFilter);
  }
  if (currentVideoTag !== 'all') {
    filtered = filtered.filter(v => v.tag === currentVideoTag);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-results">該当するSNS動画が見つかりません。</p>';
    return;
  }

  filtered.forEach((video, index) => {
    const card = document.createElement('div');
    card.className = 'video-card channel-card';
    card.style.animationDelay = `${index * 0.08}s`;

    const colors = getAvatarColor(video.pro);
    const initial = getInitial(video.pro);
    const platformIcon = getPlatformSmallIcon(video.platform);
    const platformName = video.platform === 'twitch' ? 'Twitch' : 'X';
    const gameLabel = video.game === 'fortnite' ? 'FORTNITE' : video.game === 'valorant' ? 'VALORANT' : 'APEX';
    const platformColor = video.platform === 'twitch' ? '#9146FF' : '#e0e0e0';

    card.innerHTML = `
      <div class="channel-header" style="background: linear-gradient(135deg, ${colors.dark}, ${colors.bg})">
        <span class="channel-game-badge">${gameLabel}</span>
        <span class="video-tag-badge">${video.tag}</span>
      </div>
      <div class="channel-body">
        <div class="channel-avatar" style="background: linear-gradient(135deg, ${colors.bg}, ${colors.light})">
          <span class="avatar-initial">${initial}</span>
        </div>
        <div class="channel-name">${video.pro}</div>
        <div class="channel-platform">
          ${platformIcon}
          <span style="color:${platformColor}">${platformName}</span>
        </div>
        <h3 class="channel-title">${video.title}</h3>
      </div>
    `;
    card.addEventListener('click', () => window.open(video.url, '_blank'));
    grid.appendChild(card);
  });
}

function renderVideos() {
  if (currentVideoPlatform === 'youtube') {
    renderYouTubeVideos();
  } else if (currentVideoPlatform === 'sns') {
    renderSNSVideos();
  } else if (currentVideoPlatform === 'live') {
    renderLiveStreamers();
  }
}

// Platform sub-tab switching
function initVideoPlatformTabs() {
  const btns = document.querySelectorAll('.video-platform-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentVideoPlatform = btn.getAttribute('data-vplatform');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const ytView = document.getElementById('video-sub-youtube');
      const snsView = document.getElementById('video-sub-sns');
      const liveView = document.getElementById('video-sub-live');
      ytView.style.display = 'none';
      snsView.style.display = 'none';
      liveView.style.display = 'none';

      if (currentVideoPlatform === 'youtube') {
        ytView.style.display = 'block';
      } else if (currentVideoPlatform === 'sns') {
        snsView.style.display = 'block';
      } else if (currentVideoPlatform === 'live') {
        liveView.style.display = 'block';
        renderLiveStreamers();
      }
      renderVideos();
    });
  });
}


// ============================================================
// RENDER: LIVE STREAMERS
// ============================================================
let streamersData = [];
let liveStreamersRendered = false;
let liveChannelSet = new Set(); // 現在LIVE中のチャンネルIDを追跡

async function loadStreamers() {
  try {
    const res = await fetch('./data/streamers.json');
    const data = await res.json();
    streamersData = data.streamers || [];
  } catch (e) {
    console.warn('Failed to load streamers data:', e);
  }
}

function renderLiveStreamers() {
  const grid = document.getElementById('live-grid');
  if (!grid) return;

  const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';

  let filtered = streamersData;
  if (currentFilter !== 'all') {
    filtered = streamersData.filter(s => s.game === currentFilter);
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">配信者が見つかりません</p>';
    return;
  }

  // ライブステータスサマリーバナー
  const liveCount = filtered.filter(s => liveChannelSet.has(s.channelId)).length;
  const summaryDiv = document.createElement('div');
  summaryDiv.style.gridColumn = '1 / -1';
  if (liveCount > 0) {
    summaryDiv.className = 'live-status-summary';
    summaryDiv.innerHTML = `🔴 現在 <span class="live-count-highlight">${liveCount}名</span> が配信中！`;
  } else {
    summaryDiv.className = 'live-status-summary no-live';
    summaryDiv.innerHTML = `⏳ 配信状況を確認中...`;
  }
  grid.appendChild(summaryDiv);

  // LIVE中のストリーマーを先頭にソート
  const sorted = [...filtered].sort((a, b) => {
    const aLive = liveChannelSet.has(a.channelId) ? 0 : 1;
    const bLive = liveChannelSet.has(b.channelId) ? 0 : 1;
    return aLive - bLive;
  });

  sorted.forEach((streamer, index) => {
    const card = document.createElement('div');
    const isLive = liveChannelSet.has(streamer.channelId);
    card.className = `live-streamer-card${isLive ? ' is-live' : ''}`;
    card.style.animationDelay = `${index * 0.08}s`;
    card.setAttribute('data-channel-id', streamer.channelId);

    const gameLabel = streamer.game === 'fortnite' ? 'FORTNITE' : streamer.game === 'valorant' ? 'VALORANT' : 'APEX';
    const gameColor = streamer.game === 'fortnite' ? '#00d4ff' : streamer.game === 'valorant' ? '#ff4655' : '#ff3d3d';
    const initial = streamer.name.charAt(0).toUpperCase();

    // Twitch preview image (auto-detects live status)
    const previewUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer.channelId}-440x248.jpg`;
    const statusId = `live-status-${streamer.channelId}`;
    const previewId = `live-preview-${streamer.channelId}`;

    card.innerHTML = `
      <div class="live-card-preview" id="${previewId}">
        <div class="live-card-placeholder">
          <div class="live-card-initial">${initial}</div>
          <div class="live-card-checking">配信状況を確認中...</div>
        </div>
      </div>
      <div class="live-card-info">
        <div class="live-card-header">
          <span class="live-card-name">${streamer.name}</span>
          <span id="${statusId}" class="live-badge live-badge-checking">確認中</span>
        </div>
        ${streamer.team ? `<div class="live-card-team">${streamer.team}</div>` : ''}
        <div class="live-card-meta">
          <span class="channel-game-badge" style="background:${gameColor};">${gameLabel}</span>
          <span class="live-card-platform">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
            Twitch
          </span>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      const embed = card.querySelector('.live-preview-embed');
      if (embed && embed.style.pointerEvents !== 'auto') {
        // 1回目のクリック: 埋め込みプレイヤーを操作可能に
        embed.style.pointerEvents = 'auto';
        card.style.cursor = 'default';
        e.stopPropagation();
      } else if (!embed) {
        // オフラインの場合はTwitchページを開く
        window.open(streamer.url, '_blank');
      }
    });
    card.style.cursor = 'pointer';

    grid.appendChild(card);

    // Check live status via Twitch preview image
    checkTwitchLive(streamer.channelId, statusId, previewId, previewUrl, card);
  });
}

function checkTwitchLive(channelId, statusId, previewId, previewUrl, cardEl) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  const cacheBuster = Date.now();
  img.src = `${previewUrl}?cb=${cacheBuster}`;

  img.onload = function () {
    const statusEl = document.getElementById(statusId);
    const previewEl = document.getElementById(previewId);

    if (img.naturalWidth > 1 && img.naturalHeight > 1) {
      // Canvas で画像を解析し、プレースホルダー（カメラアイコン）かリアルプレビューか判別
      let isRealPreview = true;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // 複数地点のピクセルをサンプリング（プレースホルダーは単色背景）
        const samples = [
          ctx.getImageData(10, 10, 1, 1).data,
          ctx.getImageData(img.naturalWidth - 10, 10, 1, 1).data,
          ctx.getImageData(10, img.naturalHeight - 10, 1, 1).data,
          ctx.getImageData(img.naturalWidth - 10, img.naturalHeight - 10, 1, 1).data,
          ctx.getImageData(Math.floor(img.naturalWidth / 4), 10, 1, 1).data
        ];
        // 全サンプルが同じ色（差が小さい）ならプレースホルダーの可能性が高い
        const ref = samples[0];
        const allSame = samples.every(s =>
          Math.abs(s[0] - ref[0]) < 15 &&
          Math.abs(s[1] - ref[1]) < 15 &&
          Math.abs(s[2] - ref[2]) < 15
        );
        if (allSame) isRealPreview = false;
      } catch (e) {
        // CORS等でCanvas取得できない場合はリアルプレビューとして扱う
        isRealPreview = true;
      }

      if (!isRealPreview) {
        // プレースホルダー画像 = オフライン
        if (cardEl) cardEl.style.display = 'none';
        liveChannelSet.delete(channelId);
        updateLiveTabIndicator();
        updateLiveSummary();
        return;
      }

      // ストリーマーはLIVE中
      if (statusEl) {
        statusEl.textContent = '🔴 LIVE';
        statusEl.className = 'live-badge live-badge-on';
      }
      if (previewEl) {
        // Twitch埋め込みプレイヤーを表示（ミュート・自動再生）
        const hostname = window.location.hostname || 'localhost';
        previewEl.innerHTML = `
          <iframe
            src="https://player.twitch.tv/?channel=${channelId}&parent=${hostname}&muted=true&autoplay=true"
            class="live-preview-embed"
            allowfullscreen
            frameborder="0">
          </iframe>
          <div class="live-now-banner">配信中</div>
        `;
      }
      // カードにLIVEクラスを追加
      if (cardEl) {
        cardEl.classList.add('is-live');
        cardEl.classList.remove('is-offline');
      }
      // グローバルLIVEセットに追加
      liveChannelSet.add(channelId);
      updateLiveTabIndicator();
      updateLiveSummary();
    }
  };

  img.onerror = function () {
    // オフラインのカードを非表示にする
    if (cardEl) {
      cardEl.style.display = 'none';
    }
    liveChannelSet.delete(channelId);
    updateLiveTabIndicator();
    updateLiveSummary();
  };

  // Timeout fallback - チェック中のままのカードも非表示にする
  setTimeout(() => {
    const statusEl = document.getElementById(statusId);
    if (statusEl && statusEl.classList.contains('live-badge-checking')) {
      if (cardEl) {
        cardEl.style.display = 'none';
      }
      updateLiveSummary();
    }
  }, 5000);
}

// LIVEタブボタンのインジケーターを更新
function updateLiveTabIndicator() {
  const liveBtn = document.querySelector('.video-platform-btn[data-vplatform="live"]');
  if (!liveBtn) return;

  // 既存のインジケーターを削除
  const existingIndicator = liveBtn.querySelector('.live-indicator-dot, .live-indicator-count');
  if (existingIndicator) existingIndicator.remove();

  const count = liveChannelSet.size;
  if (count > 0) {
    const indicator = document.createElement('span');
    indicator.className = 'live-indicator-count';
    indicator.textContent = count;
    liveBtn.appendChild(indicator);

    // ヘッダーのプレイ動画ボタンにもインジケーターを追加
    const videoNavBtn = document.querySelector('.nav-btn[data-section="videos"]');
    if (videoNavBtn) {
      let navIndicator = videoNavBtn.querySelector('.live-indicator-dot');
      if (!navIndicator) {
        navIndicator = document.createElement('span');
        navIndicator.className = 'live-indicator-dot';
        videoNavBtn.style.position = 'relative';
        videoNavBtn.appendChild(navIndicator);
      }
    }
  } else {
    // ヘッダーからもインジケーターを削除
    const videoNavBtn = document.querySelector('.nav-btn[data-section="videos"]');
    if (videoNavBtn) {
      const navIndicator = videoNavBtn.querySelector('.live-indicator-dot');
      if (navIndicator) navIndicator.remove();
    }
  }
}

// ライブサマリーバナーを更新
function updateLiveSummary() {
  const summary = document.querySelector('.live-status-summary');
  if (!summary) return;

  const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
  let filtered = streamersData;
  if (currentFilter !== 'all') {
    filtered = streamersData.filter(s => s.game === currentFilter);
  }
  const liveCount = filtered.filter(s => liveChannelSet.has(s.channelId)).length;

  if (liveCount > 0) {
    summary.className = 'live-status-summary';
    summary.innerHTML = `🔴 現在 <span class="live-count-highlight">${liveCount}名</span> が配信中！`;
  } else {
    summary.className = 'live-status-summary no-live';
    summary.innerHTML = `配信中のストリーマーはいません`;
  }
}

// バックグラウンドでLIVEチェック（初回ページ読み込み時用）
function backgroundLiveCheck() {
  if (streamersData.length === 0) return;

  streamersData.forEach(streamer => {
    const previewUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer.channelId}-440x248.jpg`;
    const img = new Image();
    const cacheBuster = Date.now();
    img.src = `${previewUrl}?cb=${cacheBuster}`;

    img.onload = function () {
      if (img.naturalWidth > 1 && img.naturalHeight > 1) {
        liveChannelSet.add(streamer.channelId);
        updateLiveTabIndicator();
      }
    };

    img.onerror = function () {
      liveChannelSet.delete(streamer.channelId);
    };
  });

  // タイムアウト後にインジケーターを更新
  setTimeout(() => {
    updateLiveTabIndicator();
  }, 6000);
}

// ============================================================
// RENDER: GADGETS (Tabbed by category)
// ============================================================
let currentGadgetCategory = 'mouse';

function renderGadgetTabs() {
  const tabContainer = document.getElementById('gadget-tabs');
  if (!tabContainer) return;
  tabContainer.innerHTML = '';

  Object.keys(gadgetCategories).forEach(key => {
    const cat = gadgetCategories[key];
    const btn = document.createElement('button');
    btn.className = `gadget-tab-btn${key === currentGadgetCategory ? ' active' : ''}`;
    btn.textContent = `${cat.icon} ${cat.label}`;
    btn.addEventListener('click', () => {
      currentGadgetCategory = key;
      renderGadgetTabs();
      renderGadgetItems();
    });
    tabContainer.appendChild(btn);
  });
}

function renderGadgetItems() {
  const grid = document.getElementById('gadget-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const items = gadgetCategories[currentGadgetCategory].items;
  items.forEach((g, index) => {
    const card = document.createElement('div');
    card.className = 'gadget-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    const medalLabel = ['1st', '2nd', '3rd'];

    card.innerHTML = `
      <div class="gadget-medal" style="color: ${medalColors[g.rank - 1]}">
        <span class="medal-icon">${g.rank === 1 ? '🥇' : g.rank === 2 ? '🥈' : '🥉'}</span>
        <span class="medal-label">${medalLabel[g.rank - 1]}</span>
      </div>
      <img src="${g.img}" alt="${g.name}" class="gadget-img" loading="lazy">
      <div class="gadget-name">${g.name}</div>
      <div class="gadget-desc">${g.desc}</div>
      ${g.price ? `<div class="gadget-price" style="margin-top:0.75rem; font-weight:800; color:var(--primary);">${g.price} <span style="font-size:0.65rem; font-weight:400; color:var(--text-muted);">参考価格</span></div>` : ''}
      <div class="gadget-buy-links">
        ${g.amazonUrl ? `<a href="${g.amazonUrl}" target="_blank" rel="nofollow noopener noreferrer" class="usage-link-btn amazon" onclick="event.stopPropagation()">Amazon</a>` : ''}
        ${g.rakutenUrl ? `<a href="${g.rakutenUrl}" target="_blank" rel="nofollow noopener noreferrer" class="usage-link-btn rakuten" onclick="event.stopPropagation()">楽天</a>` : ''}
        ${g.yahooUrl ? `<a href="${g.yahooUrl}" target="_blank" rel="nofollow noopener noreferrer" class="usage-link-btn yahoo" onclick="event.stopPropagation()">Yahoo!</a>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderGadgets() {
  renderGadgetTabs();
  renderGadgetItems();
  renderUsage();
  renderSpecComparison();
  initGadgetSubTabs();
}

let currentGadgetSub = 'ranking';
let currentSpecCategory = 'mouse';

function initGadgetSubTabs() {
  const subBtns = document.querySelectorAll('.gadget-sub-btn');
  subBtns.forEach(btn => {
    btn.onclick = () => {
      currentGadgetSub = btn.getAttribute('data-sub');
      subBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const rankingView = document.getElementById('gadget-sub-ranking');
      const usageView = document.getElementById('gadget-sub-usage');
      const specsView = document.getElementById('gadget-sub-specs');

      rankingView.style.display = 'none';
      usageView.style.display = 'none';
      specsView.style.display = 'none';

      if (currentGadgetSub === 'ranking') {
        rankingView.style.display = 'block';
      } else if (currentGadgetSub === 'usage') {
        usageView.style.display = 'block';
        renderUsage();
      } else if (currentGadgetSub === 'specs') {
        specsView.style.display = 'block';
        renderSpecComparison();
      }
    };
  });
}

// ============================================================
// RENDER: SPEC COMPARISON TABLE
// ============================================================
function renderSpecCategoryTabs() {
  const container = document.getElementById('spec-category-tabs');
  if (!container) return;
  container.innerHTML = '';
  const keys = Object.keys(gadgetCategories);
  if (keys.length === 0) return;

  keys.forEach(key => {
    const cat = gadgetCategories[key];
    const btn = document.createElement('button');
    btn.className = `gadget-tab-btn${key === currentSpecCategory ? ' active' : ''}`;
    btn.textContent = `${cat.icon} ${cat.label}`;
    btn.addEventListener('click', () => {
      currentSpecCategory = key;
      renderSpecComparison();
    });
    container.appendChild(btn);
  });
}

function renderSpecTable() {
  const wrapper = document.getElementById('spec-table-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';

  const cat = gadgetCategories[currentSpecCategory];
  if (!cat || !cat.items || cat.items.length === 0) return;

  const specLabels = cat.specLabels || [];
  const items = cat.items;

  // Build table
  const table = document.createElement('table');
  table.className = 'spec-compare-table';

  // Header row: empty cell + product names
  let headerRow = '<thead><tr><th class="spec-label-col"></th>';
  items.forEach((item, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
    headerRow += `<th class="spec-product-col">
      <div class="spec-product-medal">${medal}</div>
      <div class="spec-product-name">${item.name}</div>
      <div class="spec-product-price">${item.price}</div>
    </th>`;
  });
  headerRow += '</tr></thead>';

  // Spec rows
  let bodyRows = '<tbody>';
  specLabels.forEach((label, ri) => {
    bodyRows += `<tr class="spec-row${ri % 2 === 0 ? ' spec-row-even' : ''}">`;
    bodyRows += `<td class="spec-label-cell">${label}</td>`;

    // Find best value for highlighting
    items.forEach(item => {
      const val = item.specs ? (item.specs[label] || '—') : '—';
      const isHighlight = val.includes('✅') || val.includes('最');
      bodyRows += `<td class="spec-value-cell${isHighlight ? ' spec-highlight' : ''}">${val}</td>`;
    });
    bodyRows += '</tr>';
  });
  bodyRows += '</tbody>';

  table.innerHTML = headerRow + bodyRows;
  wrapper.appendChild(table);
}

function renderSpecComparison() {
  renderSpecCategoryTabs();
  renderSpecTable();
}


// ============================================================
// RENDER: RANKINGS
// ============================================================
let currentRankingGame = 'all';

const rankingGameMap = {
  'all': { label: 'ALL', icon: '🏆' },
  'Fortnite': { label: 'FORTNITE', icon: '🔫' },
  'Apex Legends': { label: 'APEX LEGENDS', icon: '🎯' },
  'VALORANT': { label: 'VALORANT', icon: '💜' }
};

function renderRankingGameTabs() {
  const container = document.getElementById('ranking-game-tabs');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(rankingGameMap).forEach(key => {
    const btn = document.createElement('button');
    btn.className = `ranking-game-btn${key === currentRankingGame ? ' active' : ''}`;
    btn.textContent = `${rankingGameMap[key].icon} ${rankingGameMap[key].label}`;
    btn.addEventListener('click', () => {
      currentRankingGame = key;
      renderRankings();
    });
    container.appendChild(btn);
  });
}

function renderRankings() {
  renderRankingGameTabs();

  const container = document.getElementById('ranking-container');
  if (!container) return;

  // フィルタリング
  let filtered = [...rankings];
  if (currentRankingGame !== 'all') {
    filtered = rankings.filter(r => r.game === currentRankingGame);
  } else {
    // ALL表示時は賞金額で降順ソート（ドル額を抽出）
    filtered.sort((a, b) => {
      const getAmount = (prize) => {
        const dollarMatch = prize.match(/\$([0-9,]+)/);
        if (dollarMatch) return parseInt(dollarMatch[1].replace(/,/g, ''), 10);
        const yenMatch = prize.match(/約([0-9,]+)万円/);
        if (yenMatch) return parseInt(yenMatch[1].replace(/,/g, ''), 10);
        return 0;
      };
      return getAmount(b) - getAmount(a);
    });
  }

  // デバイス紹介動画があるプレイヤーのマップを構築
  const deviceVideoMap = {};
  if (videos && videos.length > 0) {
    videos.filter(v => v.tag === 'デバイス紹介').forEach(v => {
      // プロ名からキーワードを抽出（括弧内を除く短い名前）
      const proName = v.pro;
      deviceVideoMap[proName] = v.url;
    });
  }

  // ランキングプレイヤー名とデバイス動画のマッチング関数
  function findDeviceVideo(playerName) {
    for (const [proName, url] of Object.entries(deviceVideoMap)) {
      // プレイヤー名がプロ名に含まれるか、プロ名がプレイヤー名に含まれるかチェック
      const cleanPlayer = playerName.replace(/[（()）]/g, '').toLowerCase();
      const cleanPro = proName.replace(/[（()）]/g, '').toLowerCase();
      // 部分一致チェック（各単語で照合）
      const playerParts = cleanPlayer.split(/[\s,/]+/);
      const proParts = cleanPro.split(/[\s,/]+/);
      for (const pp of playerParts) {
        if (pp.length < 2) continue;
        for (const pr of proParts) {
          if (pr.length < 2) continue;
          if (pp.includes(pr) || pr.includes(pp)) {
            return url;
          }
        }
      }
    }
    return null;
  }

  // ゲーム別選択時はゲーム列を非表示
  const showGameCol = currentRankingGame === 'all';

  container.innerHTML = `
    <table class="ranking-table">
      <thead>
        <tr>
          <th>順位</th>
          <th>プレイヤー</th>
          <th>チーム</th>
          ${showGameCol ? '<th>メインタイトル</th>' : ''}
          <th>概算獲得賞金</th>
        </tr>
      </thead>
      <tbody id="ranking-body"></tbody>
    </table>
  `;

  const tbody = document.getElementById('ranking-body');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:2rem;">該当するデータがありません</td></tr>';
    return;
  }

  filtered.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${i * 0.05}s`;
    tr.className = 'ranking-row';

    // ゲーム別の場合はデータのrank、ALL表示では通し番号
    const displayRank = currentRankingGame === 'all' ? i + 1 : r.rank;
    let rankDisplay = displayRank;
    if (displayRank === 1) rankDisplay = '🥇';
    else if (displayRank === 2) rankDisplay = '🥈';
    else if (displayRank === 3) rankDisplay = '🥉';

    // ゲーム名に応じた色
    const gameColor = r.game === 'Fortnite' ? '#00d4ff' : r.game === 'VALORANT' ? '#ff4655' : '#ff3d3d';

    // デバイス紹介動画があるかチェック
    const deviceUrl = findDeviceVideo(r.name);
    const deviceBadge = deviceUrl
      ? `<a href="${deviceUrl}" target="_blank" rel="noopener" class="ranking-device-badge" title="デバイス紹介動画を見る" onclick="event.stopPropagation()">🖱️ デバイス</a>`
      : '';

    tr.innerHTML = `
      <td class="rank-num">${rankDisplay}</td>
      <td class="player-name">${r.name} ${deviceBadge}</td>
      <td class="team-name">${r.team}</td>
      ${showGameCol ? `<td class="game-title" style="color:${gameColor}">${r.game}</td>` : ''}
      <td class="prize-amount">${r.prize}</td>
    `;
    tbody.appendChild(tr);
  });
}


// ============================================================
// RENDER: PRO USAGE RATES
// ============================================================
let currentUsageCategory = '';
let currentUsageGame = '';

function renderUsageCategoryTabs() {
  const container = document.getElementById('usage-category-tabs');
  if (!container) return;
  container.innerHTML = '';
  const keys = Object.keys(usageRates);
  if (keys.length === 0) return;
  if (!currentUsageCategory) currentUsageCategory = keys[0];

  keys.forEach(key => {
    const cat = usageRates[key];
    const btn = document.createElement('button');
    btn.className = `usage-tab-btn${key === currentUsageCategory ? ' active' : ''}`;
    btn.textContent = `${cat.icon} ${cat.label}`;
    btn.addEventListener('click', () => {
      currentUsageCategory = key;
      currentUsageGame = '';
      renderUsage();
    });
    container.appendChild(btn);
  });
}

function renderUsageGameTabs() {
  const container = document.getElementById('usage-game-tabs');
  if (!container) return;
  container.innerHTML = '';
  const cat = usageRates[currentUsageCategory];
  if (!cat || !cat.games) return;
  const games = Object.keys(cat.games);
  if (!currentUsageGame) currentUsageGame = games[0];

  games.forEach(game => {
    const btn = document.createElement('button');
    btn.className = `usage-game-btn${game === currentUsageGame ? ' active' : ''}`;
    btn.textContent = game;
    btn.addEventListener('click', () => {
      currentUsageGame = game;
      renderUsageGameTabs();
      renderUsageContent();
    });
    container.appendChild(btn);
  });
}

function renderUsageContent() {
  const container = document.getElementById('usage-content');
  if (!container) return;
  container.innerHTML = '';
  const cat = usageRates[currentUsageCategory];
  if (!cat || !cat.games || !cat.games[currentUsageGame]) return;
  const items = cat.games[currentUsageGame];

  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'usage-item';
    div.style.animationDelay = `${i * 0.1}s`;
    div.innerHTML = `
      <div>
        <div class="usage-item-name">${item.name}</div>
        <div class="usage-item-price">${item.price || ''}</div>
      </div>
      <div class="usage-bar-container">
        <div class="usage-bar-bg"><div class="usage-bar-fill" style="width: 0%"></div></div>
        <span class="usage-rate-text">${item.usageRate}%</span>
      </div>
      <div class="usage-links">
        <a href="${item.amazonUrl}" target="_blank" class="usage-link-btn amazon">Amazon</a>
        <a href="${item.rakutenUrl}" target="_blank" class="usage-link-btn rakuten">楽天</a>
      </div>
    `;
    container.appendChild(div);
    // Animate bar
    requestAnimationFrame(() => {
      setTimeout(() => {
        div.querySelector('.usage-bar-fill').style.width = `${item.usageRate}%`;
      }, 100 + i * 100);
    });
  });
}

function renderUsage() {
  renderUsageCategoryTabs();
  renderUsageGameTabs();
  renderUsageContent();
}

// ============================================================
// RENDER: BUYING GUIDES
// ============================================================
let currentGuideFilter = 'all';

function renderGuideFilterTabs() {
  const container = document.getElementById('guide-filter-tabs');
  if (!container) return;
  container.innerHTML = '';
  const categories = ['all', ...[...new Set(guides.map(g => g.category))]];
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `guide-filter-btn${cat === currentGuideFilter ? ' active' : ''}`;
    btn.textContent = cat === 'all' ? 'すべて' : cat;
    btn.addEventListener('click', () => {
      currentGuideFilter = cat;
      renderGuides();
    });
    container.appendChild(btn);
  });
}

function renderGuideCards() {
  const grid = document.getElementById('guides-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = currentGuideFilter === 'all' ? guides : guides.filter(g => g.category === currentGuideFilter);

  filtered.forEach((guide, gi) => {
    const card = document.createElement('div');
    card.className = 'guide-card';
    card.style.animationDelay = `${gi * 0.1}s`;

    const starsHtml = (rating) => {
      const full = Math.floor(rating);
      const half = rating % 1 >= 0.5 ? 1 : 0;
      return '★'.repeat(full) + (half ? '☆' : '') + ` ${rating}`;
    };

    const itemsHtml = guide.items.map(item => `
      <div class="guide-item">
        <div class="guide-item-info">
          <div class="guide-item-name">${item.name}</div>
          <div class="guide-item-point">${item.point}</div>
          <div class="guide-item-stars">${starsHtml(item.rating)}</div>
        </div>
        <div class="guide-item-bottom">
          <div class="guide-item-price">${item.price}</div>
          <div class="guide-item-links">
            <a href="${item.amazonUrl}" target="_blank" class="usage-link-btn amazon">Amazon</a>
            <a href="${item.rakutenUrl}" target="_blank" class="usage-link-btn rakuten">楽天</a>
            ${item.yahooUrl ? `<a href="${item.yahooUrl}" target="_blank" rel="nofollow noopener noreferrer" class="usage-link-btn yahoo">Yahoo!</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="guide-card-header">
        <div class="guide-card-icon">${guide.icon}</div>
        <span class="guide-card-category">${guide.category} / ${guide.tag}</span>
        <div class="guide-card-title">${guide.title}</div>
      </div>
      <div class="guide-card-body">
        <div class="guide-card-summary">${guide.summary}</div>
        ${itemsHtml}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderGuides() {
  renderGuideFilterTabs();
  renderGuideCards();
}

// ============================================================
// RENDER: SALE / POINT INFO
// ============================================================
function renderSales() {
  // Banner
  const bannerEl = document.getElementById('sale-banner');
  if (bannerEl) {
    if (salesData.activeSale) {
      bannerEl.innerHTML = `
        <div class="sale-banner" style="background: ${salesData.activeSale.bannerGradient}">
          <div class="sale-banner-content">
            <div class="sale-badge">${salesData.activeSale.badge}</div>
            <div class="sale-banner-title">${salesData.activeSale.name}</div>
            <div class="sale-banner-period">${salesData.activeSale.period}</div>
          </div>
        </div>
      `;
    } else {
      bannerEl.innerHTML = ''; // 開催中の特別セールがない場合はバナーを非表示
    }
  }

  // Sale Items
  const itemsGrid = document.getElementById('sale-items-grid');
  if (itemsGrid && salesData.saleItems) {
    itemsGrid.className = 'sale-items-grid';
    itemsGrid.innerHTML = '';
    salesData.saleItems.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'sale-item-card';
      card.style.animationDelay = `${i * 0.08}s`;
      const storeClass = item.store.toLowerCase() === 'amazon' ? 'amazon' : 'rakuten';
      card.innerHTML = `
        <div class="sale-discount-badge">${item.discount}</div>
        <span class="sale-item-tag">${item.tag}</span>
        <span class="sale-store-badge ${storeClass}">${item.store}</span>
        <div class="sale-item-name">${item.name}</div>
        <div class="sale-price-row">
          <span class="sale-original-price">${item.originalPrice}</span>
          <span class="sale-current-price">${item.salePrice}</span>
        </div>
        <a href="${item.url}" target="_blank" class="sale-buy-btn">今すぐチェック →</a>
      `;
      itemsGrid.appendChild(card);
    });
  }

  // Point Tips
  const tipsEl = document.getElementById('point-tips');
  if (tipsEl && salesData.pointTips) {
    tipsEl.className = 'point-tips';
    tipsEl.innerHTML = `
      <div class="point-tips-title">💰 ポイ活・お得情報 Tips</div>
      ${salesData.pointTips.map(tip => `<div class="point-tip">${tip}</div>`).join('')}
    `;
  }

  // Upcoming Sales
  const upcomingEl = document.getElementById('upcoming-sales');
  if (upcomingEl && salesData.upcomingSales) {
    upcomingEl.className = 'upcoming-sales';
    upcomingEl.innerHTML = salesData.upcomingSales.map(sale => `
      <div class="upcoming-sale-card">
        <div class="upcoming-sale-badge">${sale.badge}</div>
        <div class="upcoming-sale-name">${sale.name}</div>
        <div class="upcoming-sale-period">${sale.period}</div>
      </div>
    `).join('');
  }
}


// ============================================================
// HAMBURGER MENU TOGGLE
// ============================================================
const menuToggle = document.getElementById('menu-toggle');
const navLinksEl = document.getElementById('nav-links');

if (menuToggle && navLinksEl) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinksEl.contains(e.target)) {
      menuToggle.classList.remove('active');
      navLinksEl.classList.remove('open');
    }
  });
}

// ============================================================
// SECTION SWITCHING
// ============================================================
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.getAttribute('data-section');

    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`section-${section}`).classList.remove('hidden');

    // Close mobile menu after selection
    if (menuToggle && navLinksEl) {
      menuToggle.classList.remove('active');
      navLinksEl.classList.remove('open');
    }

    if (section === 'videos') renderVideos();
    if (section === 'gadgets') renderGadgets();
    if (section === 'rankings') renderRankings();
    if (section === 'guides') renderGuides();
    if (section === 'sales') renderSales();
  });
});


// ============================================================
// VIDEO FILTER BUTTONS
// ============================================================
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentVideoFilter = btn.getAttribute('data-filter');
    renderVideos();
  });
});

// Video Tag Filter Buttons
const tagButtons = document.querySelectorAll('.tag-btn');
tagButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tagButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentVideoTag = btn.getAttribute('data-tag');
    renderVideos();
  });
});


// ============================================================
// INITIALIZATION
// ============================================================
async function init() {
  try {
    const [videoRes, gadgetRes, rankingRes, usageRes, guidesRes, salesRes, streamerRes] = await Promise.all([
      fetch('./data/videos.json'),
      fetch('./data/gadgets.json'),
      fetch('./data/rankings.json'),
      fetch('./data/usage_rates.json'),
      fetch('./data/guides.json'),
      fetch('./data/sales.json'),
      fetch('./data/streamers.json')
    ]);

    if (videoRes.ok) {
      const data = await videoRes.json();
      videos = data.videos || [];
    }

    if (gadgetRes.ok) {
      gadgetCategories = await gadgetRes.json();
    }

    if (rankingRes.ok) {
      rankings = await rankingRes.json();
    }

    if (usageRes.ok) {
      usageRates = await usageRes.json();
    }

    if (guidesRes.ok) {
      guides = await guidesRes.json();
    }

    if (salesRes.ok) {
      salesData = await salesRes.json();
    }

    if (streamerRes.ok) {
      const sData = await streamerRes.json();
      streamersData = sData.streamers || [];
    }

  } catch (err) {
    console.error('Error fetching dynamic data:', err);
  }

  // Initial renders
  initVideoPlatformTabs();
  renderVideos();

  // バックグラウンドでLIVE配信チェック（タブにインジケーターを表示するため）
  backgroundLiveCheck();
}

init();
