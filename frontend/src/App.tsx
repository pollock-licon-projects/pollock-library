import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { BookLibrary } from './BookLibrary'; // メインのPDFライブラリ画面

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 初期化時にログイン状態をチェック
  useEffect(() => {
    const authFlag = sessionStorage.getItem('isAuthenticated');
    if (authFlag === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 未ログインならログイン画面を表示
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // ログイン済みならアプリメイン画面を表示
  return (
    <div>
      <BookLibrary />
    </div>
  );
};
