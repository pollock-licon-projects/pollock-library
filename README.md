# ポロック図書館

# 環境構築手順（Docker）

## 前提条件

- Docker Desktop がインストール済みであること
- `docker --version` / `docker compose version` が実行できること

## 起動方法

1. リポジトリのルート(`docker-compose.yml`があるディレクトリ)に移動する

   \`\`\`bash
   cd pollock-libraly
   \`\`\`

2. イメージをビルドしてコンテナを起動する

   \`\`\`bash
   docker compose up --build
   \`\`\`

   - 初回や依存関係(package.json / requirements.txt)を変更した際は `--build` を付ける
   - 2回目以降で変更がなければ `docker compose up` だけでOK

3. バックグラウンドで起動したい場合

   \`\`\`bash
   docker compose up -d
   \`\`\`

4. 動作確認

   - フロントエンド: http://localhost:5173
   - バックエンド(ヘルスチェック): http://localhost:8000/health
   - バックエンド(APIドキュメント): http://localhost:8000/docs

5. 停止する場合

   \`\`\`bash
   docker compose down
   \`\`\`