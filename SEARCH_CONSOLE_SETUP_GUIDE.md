# Google Search Console 登録ガイド

## 📋 前提条件

- サイトURL: `https://fps-prohub.net/`
- ホスティング: GitHub Pages（カスタムドメイン）
- 以下のSEOファイルは作成済み:
  - ✅ `public/sitemap.xml`
  - ✅ `public/robots.txt`

---

## 🚀 登録手順

### ステップ 1: Google Search Console にアクセス

1. [Google Search Console](https://search.google.com/search-console/) にアクセス
2. Googleアカウントでログイン

### ステップ 2: プロパティを追加

1. 左上の「プロパティを追加」をクリック
2. **「URLプレフィックス」** を選択
3. `https://fps-prohub.net/` を入力
4. 「続行」をクリック

> 💡 **ヒント**: 「ドメイン」タイプを選ぶとDNS認証が必要になります。
> GitHub Pagesの場合は「URLプレフィックス」が簡単です。

### ステップ 3: 所有権の確認

以下のいずれかの方法で所有権を確認します。**HTMLファイル方式** が最も簡単です。

#### 方法A: HTMLファイル（推奨）

1. Googleから提供される `googleXXXXXXXXXXXX.html` ファイルをダウンロード
2. `public/` フォルダに配置
3. GitHub にプッシュしてデプロイ
4. Search Console に戻り「確認」をクリック

```
FPS/
├── public/
│   ├── CNAME
│   ├── sitemap.xml
│   ├── robots.txt
│   └── googleXXXXXXXXXXXX.html  ← ここに配置
```

#### 方法B: HTMLメタタグ

1. Googleから提供されるメタタグをコピー
2. `index.html` の `<head>` 内に追加:

```html
<head>
  <meta charset="UTF-8" />
  ...
  <!-- Google Search Console 所有権確認 -->
  <meta name="google-site-verification" content="ここにコードを貼る" />
  ...
</head>
```

3. GitHub にプッシュしてデプロイ
4. Search Console に戻り「確認」をクリック

### ステップ 4: サイトマップを送信

1. Search Console の左メニューから「サイトマップ」を選択
2. `sitemap.xml` と入力
3. 「送信」をクリック
4. ステータスが「成功しました」になれば完了！

---

## ✅ 登録後にチェックすること

| 項目 | 確認方法 |
|---|---|
| インデックス状況 | 「カバレッジ」→ 有効なページ数を確認 |
| 検索パフォーマンス | 「検索パフォーマンス」→ クリック数・表示回数 |
| モバイル対応 | 「モバイルユーザビリティ」→ エラーがないか |
| 構造化データ | 「拡張」→ JSON-LDが正しく認識されているか |
| サイトマップ | 「サイトマップ」→ ステータスが「成功」か |

---

## 📝 注意事項

- 登録後、データが表示されるまで **数日〜1週間** かかります
- `admin.html` は `robots.txt` でクロール除外済みです
- サイト構造やページを追加した場合は `sitemap.xml` も更新してください
- HTTPS設定が有効であることを確認してください（GitHub Pages設定画面の「Enforce HTTPS」）
