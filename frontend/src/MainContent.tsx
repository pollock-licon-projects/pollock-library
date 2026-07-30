import React from 'react';
import { BookCard } from './BookCard';
import type { MainContentProps } from './types';
import { LazyLoadWrapper } from './LazyLoadWrapper';


export const MainContent: React.FC<MainContentProps> = ({
    isMobile,
    selectedCategory,
    filteredPdfs,
    isLoading,
    isAdmin = false,
    onDeletePdf,
}) => {
    const cardHeight = isMobile ? '200px' : '300px';
    return (
        <main style={{
            flex: 1,
            padding: isMobile ? '20px 16px' : '30px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: isMobile ? 'auto' : '100%',
            overflowY: isMobile ? 'visible' : 'auto'
        }}>
            <h2 style={{
                margin: '0 0 16px 0',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'left',
                width: '100%'
            }}>
                {selectedCategory === 'すべて' ? 'すべて' : selectedCategory}
            </h2>

            {/* 読み込み中の表示 */}
            {isLoading ? (
                <div style={{ textAlign: 'center', color: '#8b5a2b', marginTop: '60px', fontSize: '16px', width: '100%', fontWeight: 'bold' }}>
                    データを読み込んでいます...
                </div>
            ) : filteredPdfs.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile
                        ? 'repeat(auto-fill, minmax(240px, 1fr))'
                        : 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: isMobile ? '12px' : '24px',
                    width: '100%'
                }}>
                    {filteredPdfs.map(pdf => (
                        <LazyLoadWrapper key={pdf.id} height={cardHeight}>
                            <BookCard
                                key={pdf.id}
                                pdf={pdf}
                                isAdmin={isAdmin}
                                onDeletePdf={onDeletePdf}
                            />
                        </LazyLoadWrapper>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', color: '#999', marginTop: '60px', fontSize: '16px', width: '100%' }}>
                    該当するファイルが見つかりませんでした。
                </div>
            )}
        </main>
    );
};