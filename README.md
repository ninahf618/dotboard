# ウォッチログ

観たい映画やドラマを記録するアプリ。タイトルごとに評価（★1〜5）とジャンルを付け、未視聴 / 視聴中 / 視聴済み の視聴状況を管理できる。

## 開発環境の準備

- Node.js 20 以上

```bash
git clone <このリポジトリのURL>
cd dotboard
npm install
```

## 起動

```bash
npm run dev
```

起動後、別のターミナルで動作確認する:

```bash
curl http://localhost:3000/health
# => {"status":"ok"}
```

## その他のコマンド

| コマンド            | 説明                                         |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | 開発サーバを起動（ファイル保存で自動再起動） |
| `npm run build`     | `dist/` に JavaScript を出力                 |
| `npm run typecheck` | 型チェックのみ実行                           |

バックエンド：
routes/items.ts → itemService を呼ぶだけ。HTTPの受け口
services/itemService.ts → 存在チェックと状態遷移のルール。itemRepository を呼ぶ
repositories/itemRepository.ts → Prisma Client を直接呼ぶ唯一の場所
errors.ts → NotFoundError/TransitionError の定義と、404/400に変換するヘルパー
db.ts → Prisma Client のインスタンスを1つだけ作る
app.ts → ミドルウェア登録・ルーティングの組み立て・app.onError
index.ts → app.ts のアプリを Node で起動するだけ

フロントエンド：
web/src/api/items.ts → fetchの呼び出しだけを持つ。repositories に相当
web/src/components/\*.tsx → propsを受け取って表示するだけ。stateを持たない
web/src/App.tsx → 状態（state）の置き場所とつなぎ役。services に相当

## AI利用のルール

- **任せてよいこと**: 一括置換、既存のパターンを使用した定型コード、テストのテンプレート
- **任せないこと**: 意味のある設計判断、セキュリティ関係の最終判断
- **差分は全行読む**: コード全行（AIが書いたコード含む）を、自分で読む
- **説明できないコードはコミットしない**: 説明できないコードは書き直す
- **コミットメッセージとPRは手書き**: AIにはコミットメッセージとPRは書かせない

## デプロイと環境

| 環境               | 対応するブランチ | 更新のきっかけ                                          |
| ------------------ | ---------------- | ------------------------------------------------------- |
| 本番（Production） | `main`           | `main` の更新（Vercel の Git 連携が自動でデプロイする） |
| Preview            | feature ブランチ | PR の作成・更新（PR ごとに使い捨ての URL が作られる）   |

- デプロイは Vercel の Git 連携で行う。`vercel --prod` は手で打たない。
- 本番のデプロイ時に、ビルドの前で `prisma migrate deploy` が走り、未適用のマイグレーションを本番の DB に適用する（`vercel.json` の `buildCommand`）。適用に失敗するとデプロイも失敗し、前のバージョンが残る。
- Preview のビルドではマイグレーションを適用しない。Vercel の `DATABASE_URL` は Production にしか設定していないため。
- `.github/workflows/ci.yml` が push と PR のたびに、サーバ側の型チェック・テストと、`web` の lint・テスト・ビルドを実行する。
- Preview 環境は本番と同じ `DATABASE_URL` を使う。Preview で作ったデータは本番の DB に入る。

## リアルタイム更新について

本番ではポーリング（5秒間隔）で自動更新しています。ローカルではSSE実装も動作確認済みです（`src/routes/items.ts` の `/stream`、`web/src/api/items.ts` の `openItemsStream`）。

本番でSSEを採用しなかった理由:

- Vercel Functionsは1回の実行時間に上限があり、SSEの接続は上限に達すると強制的に切られる
- 接続を張りっぱなしにする方式は、同時に開いている人数ぶんだけ実行中の関数が積み上がる
- 再接続設計・同時接続数の見積もりまで含めると、このアプリの規模に対してポーリングより複雑さが見合わない
