
import React, { useState } from 'react';
import { Transaction, BankAccount, Category, TransactionType } from '../types';
import { Plus, Trash2, Filter, Search, ChevronRight } from 'lucide-react';

interface TransactionsProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  categories: Category[];
}

const Transactions: React.FC<TransactionsProps> = ({ accounts, transactions, setTransactions, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountId: accounts[0]?.id || '',
    categoryId: categories[0]?.id || '',
    amount: 0,
    type: 'EXPENSE' as TransactionType,
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrans: Transaction = {
      id: `t-${Date.now()}`,
      ...formData
    };
    setTransactions(prev => [...prev, newTrans]);
    setIsModalOpen(false);
    setFormData({ ...formData, amount: 0, note: '' });
  };

  const deleteTransaction = (id: string) => {
    if (confirm('確定要刪除這筆紀錄嗎？')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">財務紀錄</h2>
          <p className="text-slate-500">詳細管理每一筆收支細目</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          新增紀錄
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜尋備註..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Filter size={18} />
            篩選條件
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">日期</th>
                <th className="px-6 py-4">分類</th>
                <th className="px-6 py-4">帳戶</th>
                <th className="px-6 py-4">備註</th>
                <th className="px-6 py-4 text-right">金額</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice().reverse().map(t => {
                const category = categories.find(c => c.id === t.categoryId);
                const account = accounts.find(a => a.id === t.accountId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{t.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: category?.color }}
                        />
                        <span className="text-sm font-medium text-slate-800">{category?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{account?.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 max-w-[200px] truncate">{t.note}</td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    目前尚無紀錄，開始記錄您的第一筆開支吧！
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">新增財務紀錄</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${formData.type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    支出
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${formData.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    收入
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">日期</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">金額</label>
                    <input 
                      type="number" 
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">對應帳戶</label>
                    <select 
                      value={formData.accountId}
                      onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      required
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">分類</label>
                    <select 
                      value={formData.categoryId}
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      required
                    >
                      {categories.filter(c => c.type === formData.type).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">備註 / 說明</label>
                  <input 
                    type="text" 
                    value={formData.note}
                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="輸入消費內容..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100"
                  >
                    儲存紀錄
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
