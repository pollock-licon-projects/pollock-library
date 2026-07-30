import React, { useState } from 'react';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [id, setId] = useState('');
    const [secondId, setSecondId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        // 環境変数等のID/パスワードと照合
        const validId = import.meta.env.VITE_USER_ID;
        const validSecondId = import.meta.env.VITE_USER_PASSWORD;

        if (id === validId && secondId === validSecondId) {
            sessionStorage.setItem('isAuthenticated', 'true');
            onLoginSuccess();
        } else {
            setError('IDまたはパスワードが正しくありません');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f4f1ea',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '36px 32px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e0dacb',
                textAlign: 'center'
            }}>
                {/* 📚 アイコン ＆ ポロック図書館の大きなタイトル */}
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📚</div>
                <h1 style={{
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    letterSpacing: '0.05em'
                }}>
                    ポロック図書館
                </h1>

                <p style={{
                    margin: '0 0 28px 0',
                    fontSize: '13px',
                    color: '#666',
                    lineHeight: '1.5'
                }}>
                    閲覧にはログインが必要です
                </p>

                {/* フォーム */}
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fde8e8',
                            color: '#9c1c1c',
                            padding: '10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            marginBottom: '16px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>
                            ID
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="IDを入力"
                            // スマホで半角英数字キーボードを優先させる設定
                            inputMode="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>
                            パスワード
                        </label>
                        {/* type="text" に変更し、ブラウザのパスワード機能を完全に回避 */}
                        <input
                            type="text"
                            value={secondId}
                            onChange={(e) => setSecondId(e.target.value)}
                            placeholder="パスワードを入力"
                            inputMode="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#2c3e50',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        ログインして入館する
                    </button>
                </form>
            </div>
        </div>
    );
};