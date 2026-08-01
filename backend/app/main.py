from pathlib import Path
import csv
from typing import List
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


# FastAPIのインスタンス作成
app = FastAPI()

# URLの「/app/app/Data」を、実際のフォルダ「app/Data」に結び付ける設定
app.mount("/app/app/Data", StaticFiles(directory="app/Data"), name="data")


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

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "books.csv"
DATA_DIR = BASE_DIR / "Data"

app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")


class Book(BaseModel):
    id: str
    title: str
    pdfURL: str
    thumbnailURL: str
    category: str
    uploadedAt: str | None = None


@app.get("/api/books", response_model=List[Book])
def get_books(request: Request):  #  Request を受け取る
    #  ベースURLを取得 (例: "http://localhost:8000" や "https://api.yourdomain.com")
    base_url = str(request.base_url).rstrip("/")

    if not CSV_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=f"CSVファイルが見つかりません: {CSV_PATH.name}",
        )

    if not DATA_DIR.is_dir():
        raise HTTPException(
            status_code=404,
            detail={
                "error": "Data ディレクトリが見つかりません",
                "expected_path": str(DATA_DIR),
            },
        )

    try:
        with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            books = []

            # DATA_DIR のパス文字列から先頭のスラッシュを除去（または DATA_DIR.name 等を使用）
            dir_path = str(DATA_DIR).lstrip("/")

            for row in reader:
                raw_id = row.get("id", "0")
                book_id = str(int(raw_id)).zfill(3) if raw_id and raw_id.isdigit() else "000"
                pdf_url = f"{base_url}/{dir_path}/{book_id}.pdf"
                thumbnail_url = f"{base_url}/{dir_path}/{book_id}.jpg"

                books.append(
                    {
                        "id": book_id,
                        "title": row.get("title", ""),
                        "pdfURL": pdf_url,
                        "thumbnailURL": thumbnail_url,
                        "category": row.get("category", ""),
                        "uploadedAt": row.get("uploaded_at"),
                    }
                )

        return books

    except KeyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"CSVのカラム名が見つかりません: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"エラーが発生しました: {str(e)}",
        )



# --------------------------------------------

# リクエストボディを受け取るPOSTリクエスト　未実装
@app.post("/api/upload")
def create_item(item: Item):
    return {"message": "アイテムを作成しました", "item": item}


# 削除を受け取るPOSTリクエスト　未実装
@app.post("/api/delete")
def delete_item(item: Item):
    return {"message": "アイテムを削除しました", "item": item}
