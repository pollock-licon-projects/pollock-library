import React from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyLoadWrapperProps {
    children: React.ReactNode;
    height?: string; // プレースホルダー（領域確保用）の高さ
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
    children,
    height = '280px' // BookCardの高さに調整
}) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // 一度表示されたら、スクロールで画面外に出ても消さない（ちらつき防止）
        rootMargin: '200px 0px', // 画面に入る200px手前で読み込みを開始する
    });

    return (
        <div ref={ref} style={{ minHeight: inView ? 'auto' : height }}>
            {inView ? children : null}
        </div>
    );
};