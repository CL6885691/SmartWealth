
import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface AccountsProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({ name: '', type: '活期存款', balance: 0 });

  const handleOpenModal = (acc?: BankAccount) => {
    if (acc) {
      setEditingAccount(acc);
      setFormData({ name: acc.name, type: acc.type, balance: acc.balance });
    } else {
      setEditingAccount(null);
      setFormData({ name: '', type: '活期存款', balance: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...formData } : a));
    } else {
      const newAcc: BankAccount = {
        id: `acc-${Date.now()}`,
        ...formData,
        currency: 'TWD'
      };
      setAccounts(prev => [...prev, newAcc]);
    }
    setIsModalOpen(false);
  };

  const deleteAccount = (id: string) => {
    if (confirm('確定要刪除此帳戶嗎？這將不會刪除該帳戶下的交易紀錄（紀錄將保留但連結可能失效）。')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">銀行帳戶管理</h2>
          <p className="text-slate-500">新增或調整您的資金帳戶</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
        >
          <Plus size={20} />
          新增帳戶
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-full">{acc.type}</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">{acc.name}</h3>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(acc)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteAccount(acc.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-slate-400 text-sm">可用餘額</span>
              <span className={`text-2xl font-bold ${acc.balance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                ${acc.balance.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">{editingAccount ? '編輯帳戶' : '新增帳戶'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="例如：台銀薪轉、零用錢..."
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶類型</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                >
                  <option value="活期存款">活期存款</option>
                  <option value="定額存款">定額存款</option>
                  <option value="信用卡">信用卡</option>
                  <option value="現金">現金</option>
                  <option value="投資帳戶">投資帳戶</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
                <input 
                  type="number" 
                  value={formData.balance}
                  onChange={e => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100"
                >
                  確認儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
