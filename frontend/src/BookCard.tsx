import React from 'react';
import type { BookCardProps } from './types';

// 環境変数からAPIのベースURLを取得（Viteの場合）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 相対パス（/static/...）をバックエンドのフルURLに変換するヘルパー関数
const getFullUrl = (url: string | undefined): string => {
    if (!url) return '';
    // すでに http:// や https:// から始まる場合はそのまま返す（Vercel Blob用）
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // /static/... のような相対パスの場合はベースURLを付与
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const BookCard: React.FC<BookCardProps> = ({ pdf, isAdmin = false, onDeletePdf }) => {
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        // リンク遷移（PDFを開く動作）を防止
        e.preventDefault();
        e.stopPropagation();

        // pdf.idを渡し、削除
        if (onDeletePdf) {
            onDeletePdf(pdf.id);
        }
    };

    return (
        <a
            href={getFullUrl(pdf.pdfUrl)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #dcdcdc',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
                overflow: 'hidden',
                position: 'relative', // 削除ボタン配置用
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
        >
            {/* 管理者用 削除ボタン */}
            {isAdmin && (
                <button
                    type="button"
                    onClick={handleDelete}
                    title="このPDFを削除"
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 10,
                        backgroundColor: 'rgba(220, 53, 69, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        transition: 'transform 0.15s ease, background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.backgroundColor = 'rgba(200, 35, 51, 1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1.0)';
                        e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
                    }}
                >
                    🗑️
                </button>
            )}

            {/* サムネイル */}
            <div
                style={{
                    width: '100%',
                    height: '320px',
                    backgroundColor: '#fcfcfc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #eee',
                }}
            >
                <img
                    src={getFullUrl(pdf.thumbnailUrl)}
                    alt={pdf.title}
                    loading="lazy"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'cover',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                />
            </div>

            {/* 情報エリア */}
            <div
                style={{
                    padding: '12px',
                    backgroundColor: '#fcfaf2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <h4
                        style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#333',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {pdf.title}
                    </h4>
                </div>

                <div
                    style={{
                        marginTop: '12px',
                        fontSize: '10px',
                        color: '#888',
                        textAlign: 'right',
                    }}
                >
                    {pdf.uploadedAt}
                </div>
            </div>
        </a>
    );
};