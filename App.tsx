
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Lightbulb
} from 'lucide-react';
import { BankAccount, Transaction, Category, User } from './types';
import { DEFAULT_CATEGORIES, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Reports from './components/Reports';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulation of persistent state
  useEffect(() => {
    const savedUser = localStorage.getItem('sw_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      const savedAccounts = localStorage.getItem('sw_accounts');
      const savedTransactions = localStorage.getItem('sw_transactions');
      
      setAccounts(savedAccounts ? JSON.parse(savedAccounts) : MOCK_ACCOUNTS);
      setTransactions(savedTransactions ? JSON.parse(savedTransactions) : MOCK_TRANSACTIONS);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sw_accounts', JSON.stringify(accounts));
      localStorage.setItem('sw_transactions', JSON.stringify(transactions));
    }
  }, [accounts, transactions, user]);

  const handleLogout = () => {
    localStorage.removeItem('sw_user');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
              <TrendingUp size={28} />
              SmartWealth
            </h1>
          </div>
          
          <nav className="mt-6 px-4 space-y-2">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="控制面板" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/accounts" icon={<Wallet size={20} />} label="銀行帳戶" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/transactions" icon={<ArrowLeftRight size={20} />} label="財務紀錄" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/reports" icon={<PieChart size={20} />} label="分析報表" onClick={() => setIsSidebarOpen(false)} />
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              登出系統
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-slate-500 text-sm">歡迎回來, {user.name}</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  accounts={accounts} 
                  transactions={transactions} 
                  categories={categories} 
                />
              } />
              <Route path="/accounts" element={
                <Accounts 
                  accounts={accounts} 
                  setAccounts={setAccounts} 
                />
              } />
              <Route path="/transactions" element={
                <Transactions 
                  accounts={accounts} 
                  transactions={transactions} 
                  setTransactions={setTransactions}
                  categories={categories}
                />
              } />
              <Route path="/reports" element={
                <Reports 
                  accounts={accounts}
                  transactions={transactions} 
                  categories={categories} 
                />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export default App;
