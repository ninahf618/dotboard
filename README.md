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

routes/items.ts → itemService を呼ぶだけ。HTTPの受け口
services/itemService.ts → 存在チェックと状態遷移のルール。itemRepository を呼ぶ
repositories/itemRepository.ts → Prisma Client を直接呼ぶ唯一の場所
errors.ts → NotFoundError/TransitionError の定義と、404/400に変換するヘルパー
db.ts → Prisma Client のインスタンスを1つだけ作る
app.ts → ミドルウェア登録・ルーティングの組み立て・app.onError
index.ts → app.ts のアプリを Node で起動するだけ
