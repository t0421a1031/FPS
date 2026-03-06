## YouTube APIキーの安全な管理方法

### ⚠️ 重要: APIキーは「秘密情報」です
APIキーがインターネット上に公開されると、第三者に不正利用され、予期しない課金が発生する可能性があります。  
以下の手順に従って、**安全に管理**してください。

---

### ステップ 1: YouTube Data API v3 のキーを取得する

1. [Google Cloud Console](https://console.cloud.google.com/) にログインします。
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）します。
3. 左メニューから「**APIとサービス**」→「**ライブラリ**」を開きます。
4. 「**YouTube Data API v3**」を検索し、「**有効にする**」をクリックします。
5. 左メニューの「**認証情報**」→「**認証情報を作成**」→「**APIキー**」をクリックします。
6. 生成されたキー（`AIzaSy...` のような文字列）をコピーします。

> 💡 **Tips**: キーを作成したら「**キーを制限**」から、「YouTube Data API v3」のみに制限をかけると安全性が高まります。

---

### ステップ 2: `.env` ファイルにキーを設定する

プロジェクトのルートフォルダに `.env` ファイルが作成されています。  
テキストエディタで開き、以下の行を見つけて自分のキーに書き換えてください：

```
YOUTUBE_API_KEY=ここに取得したAPIキーを貼り付け
```

↓ 例：

```
YOUTUBE_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **キーの前後にスペースや引用符（""）は入れないでください。**

---

### ステップ 3: `.gitignore` で `.env` を保護する

`.gitignore` ファイルはすでに作成済みで、以下の設定が含まれています：

```
.env
.env.local
.env.production
```

これにより、`.env` ファイルが**GitHubにアップロードされることを防ぎます**。  
万が一 `.gitignore` が存在しない場合は、プロジェクトのルートに作成してください。

---

### ステップ 4: プログラム内での読み込み方法

本プロジェクトではNode.js（JavaScript）を使用しており、  
`dotenv` パッケージ不要の**組み込み簡易パーサー**で `.env` を読み込んでいます。

#### JavaScript（本プロジェクトの実装）
```javascript
// scripts/youtube_fetcher.js 内に実装済み
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
```

#### Python（参考: 別言語で実装する場合）
```python
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("YOUTUBE_API_KEY")
```

---

### ステップ 5: GitHub Actions での安全な設定

**ローカルの `.env` はGitHubには上がりません。**  
代わりに、GitHub の「**Secrets**」機能を使います。

1. GitHubのリポジトリページ →「**Settings**」→「**Secrets and variables**」→「**Actions**」
2. 「**New repository secret**」をクリック
3. 以下を登録：

| Name | Value |
|------|-------|
| `YOUTUBE_API_KEY` | `AIzaSyD-xxxxx...`（取得したキー） |
| `RAKUTEN_APP_ID` | `your_rakuten_id`（楽天APIのID） |

ワークフロー内（`.github/workflows/update_data.yml`）では、  
以下のように `secrets` 経由で安全に参照されます：

```yaml
- name: Run YouTube Fetcher
  env:
    YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
  run: node scripts/youtube_fetcher.js
```

---

### 🔐 セキュリティチェックリスト

- [x] `.env` ファイルにAPIキーを記載した
- [x] `.gitignore` に `.env` が含まれている
- [x] `.env.sample`（テンプレート）にはキーの実値を書いていない
- [ ] GitHub Secrets にキーを登録した（GitHub利用時）
- [ ] APIキーに利用制限をかけた（Google Cloud Console）

---

### ファイル構成

```
FPS/
├── .env              ← 🔒 APIキー（ローカル専用・Git除外）
├── .env.sample       ← 📄 テンプレート（Git共有OK）
├── .gitignore        ← 🛡️ .env をGit除外する設定
├── scripts/
│   ├── youtube_fetcher.js    ← .env を読み込んでYouTube APIを呼び出す
│   ├── gadget_fetcher.js     ← .env を読み込んで楽天APIを呼び出す
│   ├── ranking_updater.js    ← ランキングデータ更新
│   └── update_all.js         ← 全スクリプト一括実行
└── .github/
    └── workflows/
        └── update_data.yml   ← GitHub Secrets 経由でキーを参照
```
