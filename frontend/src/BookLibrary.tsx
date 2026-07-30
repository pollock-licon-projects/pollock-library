import { useState, useEffect } from 'react';
// import { MOCK_PDF_LIST } from './mockData';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { AdminAuthModal } from './AdminAuthModal';
import { UploadModal } from './UploadModal';
import type { PdfItem } from './types';

const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
        .replace(/[\u30a1-\u30f6]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60))
        .replace(/\s+/g, '');
};

export const BookLibrary = () => {
    const [pdfs, setPdfs] = useState<PdfItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('すべて');
    const [isMobile, setIsMobile] = useState(false);

    // 管理者モード・モーダル関連のステート
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // モバイルでの管理者モード無効
    const effectiveIsAdmin = isMobile ? false : isAdmin;

    // リサイズ制御と初期の管理者状態チェック
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        const handleResize = () => {
            const mobileActive = window.innerWidth <= 768;
            setIsMobile(mobileActive);
            document.body.style.overflow = mobileActive ? 'auto' : 'hidden';
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // sessionStorage から管理者ログイン状態を復元
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            setIsAdmin(true);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // データ取得フェッチ処理
    const fetchPdfs = async () => {
        setIsLoading(true);
        try {
            // FastAPI バックエンドから書籍一覧を取得する
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
            const response = await fetch(`${API_BASE_URL}/api/books`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPdfs(data);
        } catch (error) {
            console.error('データの取得に失敗しました', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPdfs();
    }, []);

    // 管理者ログアウト処理
    const handleAdminLogout = () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        setIsAdmin(false);
    };

    // PDF削除処理 (MainContent や Card 側に渡して使用)
    const handleDeletePdf = async (id: string) => {
        if (!window.confirm('このPDFを削除してもよろしいですか？')) return;

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
            const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-Admin-Password': import.meta.env.VITE_ADMIN_PASSWORD || '',
                },
            });

            if (response.ok) {
                // ローカルの画面表示を即時更新
                setPdfs((prev) => prev.filter((item) => item.id !== id));
            } else {
                alert('削除に失敗しました。');
            }
        } catch (error) {
            console.error('削除処理エラー:', error);
            alert('通信エラーが発生しました。');
        }
    };

    // カテゴリーリストの一覧作成
    const categories = ['すべて', ...Array.from(new Set(pdfs.map((item) => item.category)))];

    // 【修正】MOCK_PDF_LIST ではなく stateの pdfs を対象にフィルタリング
    const filteredPdfs = pdfs.filter((pdf) => {
        const normalizedTitle = normalizeText(pdf.title);
        const normalizedQuery = normalizeText(searchQuery);

        const matchesSearch = normalizedTitle.includes(normalizedQuery);
        const matchesCategory = selectedCategory === 'すべて' || pdf.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // 検索ワードだけで絞り込んだベースリスト
    const searchMatchedPdfs = pdfs.filter((pdf) => {
        const normalizedTitle = normalizeText(pdf.title);
        const normalizedQuery = normalizeText(searchQuery);
        return normalizedTitle.includes(normalizedQuery);
    });

    // カテゴリ別件数の集計
    const getCategoryCount = (category: string) => {
        return category === 'すべて'
            ? searchMatchedPdfs.length
            : searchMatchedPdfs.filter((p) => p.category === category).length;
    };

    return (
        <div
            style={{
                fontFamily: '"Zen Kaku Gothic Antique", "Helvetica Neue", Arial, sans-serif',
                height: isMobile ? 'auto' : '100vh',
                backgroundColor: '#fdfdfd',
                display: 'flex',
                flexDirection: 'column',
                overflow: isMobile ? 'auto' : 'hidden',
            }}
        >
            {/* 1. ヘッダー */}
            <Header
                isMobile={isMobile}
                isAdmin={isAdmin}
                onOpenAdminModal={() => setIsAdminModalOpen(true)}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                onAdminLogout={handleAdminLogout}
            />

            {/* メインレイアウト（サイドバー + グリッド） */}
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    overflow: isMobile ? 'visible' : 'hidden',
                }}
            >
                {/* 2. サイドバー */}
                <Sidebar
                    isMobile={isMobile}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    getCategoryCount={getCategoryCount}
                />

                {/* 3. 右側メインコンテンツ */}
                <main style={{ flex: 1, display: 'flex', width: '100%', overflow: 'hidden' }}>
                    <MainContent
                        isMobile={isMobile}
                        selectedCategory={selectedCategory}
                        filteredPdfs={filteredPdfs}
                        isLoading={isLoading}
                        isAdmin={effectiveIsAdmin}
                        onDeletePdf={handleDeletePdf}
                    />
                </main>
            </div>

            {/* 4. 管理者パスワード入力モーダル */}
            <AdminAuthModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                onSuccess={() => {
                    setIsAdmin(true);
                    setIsAdminModalOpen(false);
                }}
            />

            {/* 5. PDF追加モーダル */}
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                existingCategories={categories.filter((c) => c !== 'すべて')}
                onUploadSuccess={(newBook?: PdfItem) => {
                    setIsUploadModalOpen(false);
                    if (newBook) {
                        // 💡 サーバーからの再取得を待たず、即座に一覧ステートに追加して画面を更新する
                        setPdfs((prev) => [...prev, newBook]);
                    } else {
                        // 万が一データが取れなかった場合のフォールバック
                        fetchPdfs();
                    }
                }}
            />
        </div>
    );
}