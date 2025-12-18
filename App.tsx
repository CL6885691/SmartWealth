
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, PieChart, LogOut, Menu, TrendingUp } from 'lucide-react';
import { BankAccount, Transaction, Category, User } from './types';
import { DEFAULT_CATEGORIES, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Reports from './components/Reports';
import Auth from './components/Auth';
import { db, auth as fbAuth, isFirebaseReady } from './firebase';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 初始化登入狀態
  useEffect(() => {
    if (!isFirebaseReady()) {
      const savedUser = localStorage.getItem('sw_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
      return;
    }

    const unsubscribe = fbAuth.onAuthStateChanged((fbUser: any) => {
      if (fbUser) {
        setUser({ id: fbUser.uid, email: fbUser.email || '', name: fbUser.displayName || '使用者' });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore 資料實時同步
  useEffect(() => {
    if (!user || !isFirebaseReady()) {
      if (!user) {
        setAccounts([]);
        setTransactions([]);
      }
      return;
    }

    // 監聽帳戶
    const qAccounts = query(collection(db, `users/${user.id}/accounts`));
    const unsubAccounts = onSnapshot(qAccounts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as BankAccount[];
      setAccounts(data.length > 0 ? data : MOCK_ACCOUNTS);
    });

    // 監聽交易
    const qTransactions = query(collection(db, `users/${user.id}/transactions`));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Transaction[];
      setTransactions(data.length > 0 ? data : MOCK_TRANSACTIONS);
    });

    return () => {
      unsubAccounts();
      unsubTransactions();
    };
  }, [user]);

  const handleLogout = async () => {
    if (isFirebaseReady()) await signOut(fbAuth);
    localStorage.removeItem('sw_user');
    setUser(null);
  };

  const syncAccounts = async (newAccounts: any) => {
    if (!user || !isFirebaseReady()) {
      setAccounts(newAccounts);
      return;
    }
    // 簡單的批次更新邏輯 (這僅處理單一帳戶變動，實際調用處需配合 API)
  };

  if (loading) return <div className="h-screen flex items-center justify-center">載入中...</div>;
  if (!user) return <Auth onLogin={(u) => setUser(u)} />;

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6"><h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-400"><TrendingUp />SmartWealth</h1></div>
          <nav className="mt-6 px-4 space-y-2">
            <SidebarLink to="/" icon={<LayoutDashboard />} label="控制面板" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/accounts" icon={<Wallet />} label="銀行帳戶" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/transactions" icon={<ArrowLeftRight />} label="財務紀錄" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/reports" icon={<PieChart />} label="分析報表" onClick={() => setIsSidebarOpen(false)} />
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
              <div className="overflow-hidden"><p className="text-sm font-medium truncate">{user.name}</p></div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"><LogOut size={18} />登出系統</button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
            <span className="text-slate-500 text-sm">歡迎回來, {user.name}</span>
          </header>
          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard accounts={accounts} transactions={transactions} categories={categories} />} />
              <Route path="/accounts" element={<Accounts accounts={accounts} setAccounts={setAccounts} />} />
              <Route path="/transactions" element={<Transactions accounts={accounts} transactions={transactions} setTransactions={setTransactions} categories={categories} />} />
              <Route path="/reports" element={<Reports accounts={accounts} transactions={transactions} categories={categories} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const SidebarLink = ({ to, icon, label, onClick }: any) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
    {icon} <span className="font-medium">{label}</span>
  </Link>
);

export default App;
