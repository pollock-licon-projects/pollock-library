import csv
from pydantic import BaseModel
from pathlib import Path
from fastapi import FastAPI, HTTPException


# FastAPIのインスタンス作成
app = FastAPI()

# データの型定義 (Pydanticモデル)
class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None

# ルートパス (GETリクエスト)
@app.get("/")
def read_root():
    return {"Hello": "World"}

# ---- 追加：ヘルスチェック用エンドポイント ----
@app.get("/health")
def health_check():
    return {"status": "ok"}
# --------------------------------------------

# スクリプトと同じフォルダにある "books.csv" を参照
CSV_PATH = Path(__file__).resolve().parent / "books.csv"

@app.get("/api/books")
def get_books():
    # 1. ファイルが存在するかチェック
    if not CSV_PATH.exists():
        raise HTTPException(
            status_code=444,
            detail=f"CSVファイルが見つかりません: {CSV_PATH.name}",
        )

    books = []
    try:
        # ExcelのBOM付きUTF-8にも対応できる 'utf-8-sig' を使用
        with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                books.append(
                    {
                        "id": row.get("id", ""),
                        "title": row.get("title", ""),
                        "pdfURL": row.get("pdf_url") or row.get("pdfURL", ""),
                        "thumnailURL": row.get("thumbnail_url")
                        or row.get("thumnailURL", ""),
                        "category": row.get("category", ""),
                        "uploadedAt": row.get("uploaded_at")
                        or row.get("uploadedAt", ""),
                    }
                )
        return books

    except KeyError as e:
        # ヘッダー名が不一致の場合
        raise HTTPException(
            status_code=500, detail=f"CSVのカラム名が見つかりません: {e}"
        )
    except Exception as e:
        # その他のエラーをキャッチしてメッセージを返す
        raise HTTPException(
            status_code=500, detail=f"エラーが発生しました: {str(e)}"
        )



# パラメータを受け取るGETリクエスト
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# リクエストボディを受け取るPOSTリクエスト
@app.post("/api/upload")
def create_item(item: Item):
    return {"message": "アイテムを作成しました", "item": item}
