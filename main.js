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

    const gameLabel = video.game === 'fortnite' ? 'FORTNITE' : 'APEX';
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
    const gameLabel = video.game === 'fortnite' ? 'FORTNITE' : 'APEX';
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
  } else {
    renderSNSVideos();
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
      if (currentVideoPlatform === 'youtube') {
        ytView.style.display = 'block';
        snsView.style.display = 'none';
      } else {
        ytView.style.display = 'none';
        snsView.style.display = 'block';
      }
      renderVideos();
    });
  });
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
      ${g.price ? `<div class="gadget-price" style="margin-top:0.75rem; font-weight:800; color:var(--primary);">${g.price}</div>` : ''}
      <div class="gadget-buy-links">
        ${g.amazonUrl ? `<a href="${g.amazonUrl}" target="_blank" rel="noopener noreferrer" class="usage-link-btn amazon" onclick="event.stopPropagation()">Amazon</a>` : ''}
        ${g.rakutenUrl ? `<a href="${g.rakutenUrl}" target="_blank" rel="noopener noreferrer" class="usage-link-btn rakuten" onclick="event.stopPropagation()">楽天</a>` : ''}
        ${g.yahooUrl ? `<a href="${g.yahooUrl}" target="_blank" rel="noopener noreferrer" class="usage-link-btn yahoo" onclick="event.stopPropagation()">Yahoo!</a>` : ''}
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
function renderRankings() {
  const container = document.getElementById('ranking-container');
  if (!container) return;
  container.innerHTML = `
    <table class="ranking-table">
      <thead>
        <tr>
          <th>順位</th>
          <th>プレイヤー</th>
          <th>チーム</th>
          <th>メインタイトル</th>
          <th>概算獲得賞金</th>
        </tr>
      </thead>
      <tbody id="ranking-body"></tbody>
    </table>
  `;

  const tbody = document.getElementById('ranking-body');
  rankings.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${i * 0.05}s`;
    tr.className = 'ranking-row';

    let rankDisplay = r.rank;
    if (r.rank === 1) rankDisplay = '🥇';
    else if (r.rank === 2) rankDisplay = '🥈';
    else if (r.rank === 3) rankDisplay = '🥉';

    tr.innerHTML = `
      <td class="rank-num">${rankDisplay}</td>
      <td class="player-name">${r.name}</td>
      <td class="team-name">${r.team}</td>
      <td class="game-title">${r.game}</td>
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
        <div class="guide-item-price">${item.price}</div>
        <div class="guide-item-links">
          <a href="${item.amazonUrl}" target="_blank" class="usage-link-btn amazon">Amazon</a>
          <a href="${item.rakutenUrl}" target="_blank" class="usage-link-btn rakuten">楽天</a>
          ${item.yahooUrl ? `<a href="${item.yahooUrl}" target="_blank" class="usage-link-btn yahoo">Yahoo!</a>` : ''}
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
  if (!salesData.activeSale) return;

  // Banner
  const bannerEl = document.getElementById('sale-banner');
  if (bannerEl) {
    bannerEl.innerHTML = `
      <div class="sale-banner" style="background: ${salesData.activeSale.bannerGradient}">
        <div class="sale-banner-content">
          <div class="sale-badge">${salesData.activeSale.badge}</div>
          <div class="sale-banner-title">${salesData.activeSale.name}</div>
          <div class="sale-banner-period">${salesData.activeSale.period}</div>
        </div>
      </div>
    `;
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
    const [videoRes, gadgetRes, rankingRes, usageRes, guidesRes, salesRes] = await Promise.all([
      fetch('./data/videos.json'),
      fetch('./data/gadgets.json'),
      fetch('./data/rankings.json'),
      fetch('./data/usage_rates.json'),
      fetch('./data/guides.json'),
      fetch('./data/sales.json')
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

  } catch (err) {
    console.error('Error fetching dynamic data:', err);
  }

  // Initial renders
  initVideoPlatformTabs();
  renderVideos();
}

init();
