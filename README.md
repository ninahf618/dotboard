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
