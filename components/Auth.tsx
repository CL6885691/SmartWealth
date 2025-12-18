
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 模擬網路延遲與驗證流程 (在實際環境中此處會呼叫 Firebase Auth API)
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      if (isLogin) {
        // 模擬登入邏輯：從 localStorage 讀取使用者資料
        const savedAuthData = localStorage.getItem(`auth_store_${email}`);
        if (savedAuthData) {
          const userData = JSON.parse(savedAuthData);
          if (userData.password === password) {
            const user: User = { id: userData.id, email: userData.email, name: userData.name };
            localStorage.setItem('sw_user', JSON.stringify(user));
            onLogin(user);
          } else {
            setError('密碼不正確，請再試一次。');
          }
        } else {
          setError('找不到該電子郵件。若您是新用戶，請先註冊。');
        }
      } else {
        // 模擬註冊邏輯
        if (password.length < 6) {
          setError('密碼長度必須至少為 6 位字元。');
          setLoading(false);
          return;
        }
        
        if (!name.trim()) {
          setError('請輸入您的顯示名稱。');
          setLoading(false);
          return;
        }

        const existing = localStorage.getItem(`auth_store_${email}`);
        if (existing) {
          setError('此電子郵件已被註冊。');
        } else {
          const newUser = { 
            id: `u-${Date.now()}`, 
            email, 
            name: name, 
            password 
          };
          // 模擬存入 Firebase 資料庫
          localStorage.setItem(`auth_store_${email}`, JSON.stringify(newUser));
          setIsLogin(true);
          setError('');
          alert('註冊成功！現在請使用您的帳號登入。');
        }
      }
    } catch (err) {
      setError('發生非預期錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* 裝飾性背景 */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px]"></div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200">
        <div className="bg-slate-900 p-8 text-center text-white relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-2xl mb-4 shadow-lg shadow-indigo-500/50">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">SmartWealth</h1>
          <p className="text-slate-400 mt-2 font-medium">個人智慧財務管理系統</p>
          
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              登入
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              註冊
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">顯示名稱</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="您的名字"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">密碼</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? '登入系統' : '立即註冊')}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-8">
            {isLogin ? '還沒有帳號嗎？' : '已經有帳號了？'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-indigo-600 font-bold hover:underline"
            >
              {isLogin ? '點此註冊' : '點此登入'}
            </button>
          </p>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            SmartWealth AI 理財助手 © 2024. 安全加密保護中。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
