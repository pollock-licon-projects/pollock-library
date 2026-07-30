import React, { useState } from 'react';
import type { UploadModalProps } from './types';

export const UploadModal: React.FC<UploadModalProps> = ({
    isOpen,
    onClose,
    existingCategories,
    onUploadSuccess,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !category) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
        const targetUrl = `${cleanBaseUrl}/api/upload`;

        console.log('送信先URL:', targetUrl);

        try {
            const res = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'X-Admin-Password': import.meta.env.VITE_ADMIN_PASSWORD || '',
                },
                body: formData,
            });

            if (res.ok) {
                setFile(null);
                setCategory('');
                onUploadSuccess();
            } else {
                const errText = await res.text();
                console.error('サーバーエラー詳細:', res.status, errText);
                alert(`アップロードに失敗しました。(Status: ${res.status})`);
            }
        } catch (err) {
            console.error('通信エラー詳細:', err);
            alert('通信エラーが発生しました。');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>➕ 新しいPDFを追加</h3>

                <form onSubmit={handleSubmit}>
                    {/* PDFファイル選択 */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            PDFファイル
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* カテゴリ（datalist付き） */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            カテゴリ
                        </label>
                        <input
                            type="text"
                            list="category-list"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="選択または新規入力"
                            required
                            style={styles.input}
                        />
                        <datalist id="category-list">
                            {existingCategories.map((cat) => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>

                    {/* ボタンエリア */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUploading}
                            style={styles.cancelBtn}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading || !file}
                            style={{
                                ...styles.submitBtn,
                                opacity: isUploading || !file ? 0.6 : 1,
                                cursor: isUploading || !file ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isUploading ? '処理中...' : 'アップロード'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
    },
    modal: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        width: '90%',
        maxWidth: '420px',
    },
    title: {
        margin: '0 0 1.25rem 0',
        fontSize: '1.25rem',
        color: '#333333',
    },
    input: {
        width: '100%',
        padding: '0.5rem 0.75rem',
        borderRadius: '4px',
        border: '1px solid #cccccc',
        fontSize: '0.9rem',
        boxSizing: 'border-box',
    },
    cancelBtn: {
        backgroundColor: '#6c757d',
        color: '#ffffff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    submitBtn: {
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontWeight: 'bold',
    },
};