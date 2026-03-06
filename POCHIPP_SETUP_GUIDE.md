# ポチップ（Pochipp）アフィリエイトリンク設定ガイド

## 概要

このサイトのガジェットカードには、Amazon・楽天・Yahoo!ショッピングの3つの購入ボタンがあります。  
現在は各ストアの**検索URL**が設定されていますが、これをWordPressのポチップで生成した**アフィリエイトリンク**に差し替えることで、収益化が可能になります。

---

## 手順

### STEP 1: WordPressにポチップをインストール

1. WordPress管理画面 → **プラグイン** → **新規追加**
2. 「**Pochipp**」で検索
3. **Pochipp** をインストール → **有効化**
4. 同時に「**Pochipp Assist**」もインストールすると便利です

### STEP 2: アフィリエイトプログラムに登録

ポチップで使用するアフィリエイトサービスに登録してください：

| サービス | 登録URL | 備考 |
|----------|---------|------|
| **Amazonアソシエイト** | https://affiliate.amazon.co.jp/ | PA-APIなしでも利用可能 |
| **楽天アフィリエイト** | https://affiliate.rakuten.co.jp/ | 楽天会員なら即利用可能 |
| **バリューコマース** (Yahoo!) | https://www.valuecommerce.ne.jp/ | Yahoo!ショッピングのアフィリエイトはここから |

### STEP 3: ポチップにアフィリエイト情報を設定

1. WordPress管理画面 → **ポチップ管理** → **ポチップ設定**
2. 各タブでアフィリエイト情報を入力：
   - **Amazon** タブ: アソシエイトID（トラッキングID）を入力
   - **楽天** タブ: アフィリエイトID を入力
   - **Yahoo!** タブ: バリューコマースの `sid` と `pid` を入力

### STEP 4: 商品のアフィリエイトリンクを取得

1. WordPress管理画面 → **ポチップ管理** → **新規追加**
2. 商品名で検索（例: 「Logicool G PRO X SUPERLIGHT 2」）
3. 商品を選択して登録
4. 登録した商品の**各ストアリンク**をコピー

#### リンクの取得方法
ポチップの商品編集画面で、以下のURLをそれぞれコピーしてください：
- **Amazonリンク**: `https://www.amazon.co.jp/dp/XXXXXXXXXX?tag=あなたのID-22`
- **楽天リンク**: `https://hb.afl.rakuten.co.jp/hgc/XXXXXXXX/...`
- **Yahoo!リンク**: `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=XXXX&pid=XXXX&...`

### STEP 5: `gadgets.json` のURLを差し替え

`data/gadgets.json` を開いて、各製品の `amazonUrl`、`rakutenUrl`、`yahooUrl` をポチップで取得したアフィリエイトリンクに差し替えてください。

#### 変更例

**変更前（検索URL）:**
```json
{
  "name": "Logicool G PRO X SUPERLIGHT 2",
  "amazonUrl": "https://www.amazon.co.jp/s?k=Logicool+G+PRO+X+SUPERLIGHT+2",
  "rakutenUrl": "https://search.rakuten.co.jp/search/mall/Logicool+G+PRO+X+SUPERLIGHT+2/",
  "yahooUrl": "https://shopping.yahoo.co.jp/search?p=Logicool+G+PRO+X+SUPERLIGHT+2"
}
```

**変更後（アフィリエイトリンク）:**
```json
{
  "name": "Logicool G PRO X SUPERLIGHT 2",
  "amazonUrl": "https://www.amazon.co.jp/dp/B0CXQ3G8KJ?tag=あなたのID-22",
  "rakutenUrl": "https://hb.afl.rakuten.co.jp/hgc/あなたのID/...",
  "yahooUrl": "https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=XXXX&pid=XXXX&vc_url=https://shopping.yahoo.co.jp/..."
}
```

---

## 対象製品一覧（15製品）

| カテゴリ | 製品名 |
|----------|--------|
| 🖱️ マウス | Logicool G PRO X SUPERLIGHT 2 |
| 🖱️ マウス | Razer Viper V3 Pro |
| 🖱️ マウス | Finalmouse UltralightX |
| ⌨️ キーボード | Wooting 60HE |
| ⌨️ キーボード | Razer Huntsman V3 Pro |
| ⌨️ キーボード | DrunkDeer A75 |
| 🖥️ モニター | BenQ ZOWIE XL2546K |
| 🖥️ モニター | ASUS ROG Swift PG27AQN |
| 🖥️ モニター | BenQ ZOWIE XL2566K |
| 🎙️ マイク | Shure MV7+ |
| 🎙️ マイク | HyperX QuadCast S |
| 🎙️ マイク | Elgato Wave:3 |
| 🎧 ヘッドセット | HyperX Cloud III Wireless |
| 🎧 ヘッドセット | Logicool G PRO X 2 LIGHTSPEED |
| 🎧 ヘッドセット | SteelSeries Arctis Nova Pro |

---

## 価格の最新化について

ポチップ自体はWordPress上で自動的に最新価格を取得しますが、このサイトは静的サイトのため、`gadgets.json` の `price` フィールドは手動更新が必要です。

### 価格を定期的に更新する方法

1. **手動更新**: 各ストアで最新価格を確認し、`gadgets.json` の `price` を更新
2. **将来的なAPI連携**: Amazon PA-API や楽天APIを取得できた場合、自動更新スクリプトの作成も可能

---

## 注意事項

- アフィリエイトリンクには**必ずあなたのアフィリエイトID**が含まれるようにしてください
- リンクが正しく動作するか、実際にクリックして確認してください
- 各アフィリエイトプログラムの規約を必ず確認してください
