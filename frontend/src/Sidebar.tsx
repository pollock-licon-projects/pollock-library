import React from 'react';
import { Search } from 'lucide-react';
import type { SidebarProps } from './types';

export const Sidebar: React.FC<SidebarProps> = ({
    isMobile,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    getCategoryCount
}) => {
    return (
        <aside style={{
            width: isMobile ? '100%' : '260px',
            backgroundImage: 'url("/sidebar_background.png")',
            backgroundColor: '#f7f1e3',
            borderBottom: isMobile ? '1px solid #e1d5c1' : 'none',
            borderRight: isMobile ? 'none' : '1px solid #e1d5c1',
            padding: isMobile ? '16px' : '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '16px' : '24px',
            boxSizing: 'border-box',
            overflowY: isMobile ? 'visible' : 'auto',
            flexShrink: 0
        }}>
            {/* 検索 */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold', color: '#5d4037', marginBottom: '8px' }}>
                    <Search size={16} />
                    <span>検索</span>
                </div>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="キーワードを入力..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #ccc6b6',
                            backgroundColor: '#fff',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* カテゴリー */}
            <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold', color: '#5d4037', borderBottom: '1px solid #e1d5c1', paddingBottom: '6px' }}>
                    カテゴリー
                </h3>
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    gap: '6px',
                    overflowX: isMobile ? 'auto' : 'visible',
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                    paddingBottom: isMobile ? '8px' : '0',
                    WebkitOverflowScrolling: 'touch'
                }}>
                    {categories.map(category => {
                        const isSelected = selectedCategory === category;
                        const count = getCategoryCount(category);

                        return (
                            <li key={category} style={{ display: 'inline-block' }}>
                                <button
                                    onClick={() => setSelectedCategory(category)}
                                    style={{
                                        width: isMobile ? 'auto' : '100%',
                                        textAlign: 'left',
                                        padding: isMobile ? '8px 14px' : '10px 12px',
                                        borderRadius: '20px',
                                        backgroundColor: isSelected ? '#8b5a2b' : '#fff',
                                        color: isSelected ? '#fff' : '#5d4037',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: isSelected ? 'bold' : 'normal',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        gap: '8px',
                                        alignItems: 'center',
                                        boxShadow: isMobile ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                                        border: isSelected ? 'none' : '1px solid #e1d5c1'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected && !isMobile) e.currentTarget.style.backgroundColor = 'rgba(139, 90, 43, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected && !isMobile) e.currentTarget.style.backgroundColor = '#fff';
                                    }}
                                >
                                    <span>{category}</span>
                                    <span style={{
                                        fontSize: '11px',
                                        backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                                        padding: '2px 6px',
                                        borderRadius: '10px',
                                        color: isSelected ? '#fff' : '#888'
                                    }}>
                                        {count}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
};