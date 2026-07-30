import React from 'react';
import type { HeaderProps } from './types';

export const Header: React.FC<HeaderProps> = ({
    isMobile,
    isAdmin = false,
    onOpenAdminModal,
    onOpenUploadModal,
    onAdminLogout,
}) => {
    return (
        <header
            style={{
                backgroundImage: 'url("/header_background.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: isMobile ? '70px' : '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isMobile ? '0 16px' : '0 30px',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                flexShrink: 0,
            }}
        >
            {/* タイトル */}
            <h1
                style={{
                    margin: 0,
                    fontSize: isMobile ? '22px' : '32px',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                }}
            >
                ポロック図書館
            </h1>

            {/* 右側のアクションエリア */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* モバイルではない（PC・タブレット表示）時のみ管理者操作を表示 */}
                {!isMobile && (
                    isAdmin ? (
                        <>
                            {/* 管理者モード時のボタン */}
                            <button
                                onClick={onOpenUploadModal}
                                style={{ ...styles.button, backgroundColor: 'rgba(40, 167, 69, 0.85)' }}
                            >
                                ➕ PDFを追加
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
                                        const targetUrl = `${baseUrl}/api/books`;
                                        console.log('取得リクエスト送信:', targetUrl);

                                        const res = await fetch(targetUrl);
                                        console.log('レスポンス受信 Status:', res.status);

                                        if (!res.ok) {
                                            const errText = await res.text();
                                            alert(`サーバーエラー (Status: ${res.status}):\n${errText}`);
                                            return;
                                        }

                                        const data = await res.json();
                                        console.log("現在のmetadata.jsonの内容:", data);
                                        alert(`成功！ 合計 ${data.length} 件のデータがあります。（詳細はF12キーのコンソールを確認）`);
                                    } catch (err: any) {
                                        console.error('通信例外エラー:', err);
                                        alert(`通信エラーが発生しました:\n${err.message || err}`);
                                    }
                                }}
                                style={{ background: '#333', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #fff' }}
                            >
                                🔍 Blobデータ（metadata.json）を確認
                            </button>
                            <button
                                onClick={onAdminLogout}
                                style={{ ...styles.button, backgroundColor: 'rgba(220, 53, 69, 0.85)' }}
                            >
                                🚪 管理者ログアウト
                            </button>
                        </>
                    ) : (
                        /* 通常時の管理者ログイン呼び出しボタン */
                        <button
                            onClick={onOpenAdminModal}
                            style={{ ...styles.button, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                        >
                            🔒 管理者モード
                        </button>
                    )
                )}
            </div>
        </header>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    button: {
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '6px',
        padding: '6px 12px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
};