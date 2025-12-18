
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { auth, isFirebaseReady } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

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
    
    if (!isFirebaseReady()) {
      setError("Firebase 尚未配置。請設定環境變數以使用真實登入功能。");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        onLogin({
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || '使用者'
        });
      } else {
        if (password.length < 6) throw new Error("密碼至少需要 6 個字元");
        if (!name.trim()) throw new Error("請輸入顯示名稱");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        onLogin({
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: name
        });
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let msg = "認證失敗，請檢查輸入資訊。";
      if (err.code === 'auth/user-not-found') msg = "找不到此帳號，請先註冊。";
      if (err.code === 'auth/wrong-password') msg = "密碼錯誤。";
      if (err.code === 'auth/email-already-in-use') msg = "此電子郵件已被註冊。";
      setError(err.message || msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200">
        <div className="bg-slate-900 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-2xl mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold">SmartWealth</h1>
          <p className="text-slate-400 mt-2">個人智慧財務管理系統</p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl font-bold text-sm ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-50'}`}>登入</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-50'}`}>註冊</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 text-sm">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            )}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">姓名</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="輸入姓名" required={!isLogin} />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="email@example.com" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">密碼</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? '登入系統' : '完成註冊')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
