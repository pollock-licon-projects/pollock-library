import React, { useState } from 'react';

interface AdminAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleAdminLogin = (e: React.SubmitEvent) => {
        e.preventDefault();

        const envAdminPass = import.meta.env.VITE_ADMIN_PASSWORD;

        // パスワードの一致チェック
        if (adminPassword === envAdminPass) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setError('');
            setAdminPassword(''); // 入力値をリセット
            onSuccess();
        } else {
            setError('パスワードが正しくありません');
        }
    };

    const handleClose = () => {
        setError('');
        setAdminPassword('');
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={{ marginTop: 0 }}>🔒 管理者認証</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    PDFの追加・編集を行うには管理者パスワードを入力してください。
                </p>

                <form onSubmit={handleAdminLogin}>
                    {error && <p style={styles.error}>{error}</p>}

                    <div style={{ marginBottom: '1.2rem' }}>
                        <input
                            type="password"
                            placeholder="管理者パスワード"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            style={styles.input}
                            autoFocus
                            required
                        />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="button" onClick={handleClose} style={styles.cancelBtn}>
                            キャンセル
                        </button>
                        <button type="submit" style={styles.submitBtn}>
                            認証する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// インラインスタイル例（CSS / Tailwind 等に置換可能）
const styles: { [key: string]: React.CSSProperties } = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', width: '320px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    input: { width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
    error: { color: '#e53e3e', fontSize: '0.85rem', marginBottom: '0.5rem' },
    buttonGroup: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
    cancelBtn: { padding: '0.5rem 1rem', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    submitBtn: { padding: '0.5rem 1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};