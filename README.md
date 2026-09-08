# dotboard

dotstart 実践課程 Stage 2 のハンズオンで作る、チームのタスクを貼り出して進めるボード。

## 開発環境

| 道具    | バージョン       |
| ------- | ---------------- |
| Node.js | v24.19.0         |
| npm     | 11.4.2           |
| Git     | 2.47.1.windows.2 |
| Docker  | 28.2.2           |

## 起動方法

未実装（Step 1 で書く）

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
