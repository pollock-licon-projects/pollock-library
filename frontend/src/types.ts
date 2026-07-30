// アプリ全体で使う本（PDF）のコアデータ型
export interface PdfItem {
    id: string;
    title: string;
    pdfUrl: string;       // PDF本体のURL
    thumbnailUrl: string; // サムネイル画像のURL
    category: string;     // カテゴリ名
    uploadedAt: string;    // 作成日
}


// Header用の型定義
export interface HeaderProps {
    isMobile: boolean;
    isAdmin?: boolean;
    onOpenAdminModal?: () => void;
    onOpenUploadModal?: () => void;
    onAdminLogout?: () => void;
    onUserLogout?: () => void;
}


// Sidebar用の型定義
export interface SidebarProps {
    isMobile: boolean;
    isAdmin?: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    // 各カテゴリーの該当件数を計算するための関数
    getCategoryCount: (category: string) => number;
}


// MainContent用の型定義
export interface MainContentProps {
    isMobile: boolean;
    isAdmin?: boolean;
    selectedCategory: string;
    filteredPdfs: PdfItem[];
    isLoading: boolean;
    onDeletePdf?: (id: string) => void;
}

// カード部分の型定義
export interface BookCardProps {
    pdf: PdfItem;
    isAdmin?: boolean;
    onDeletePdf?: (id: string) => void;
}

// UploadModal用の型定義
export interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingCategories: string[];
    onUploadSuccess: () => void;
}

// LoginForm用の型定義
export interface LoginFormProps {
    onLoginSuccess: () => void;
}