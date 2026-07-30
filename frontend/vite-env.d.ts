/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ADMIN_PASSWORD?: string;
    // 他に使用する環境変数があればここに追加
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}