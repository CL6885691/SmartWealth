
import React, { useState, useEffect } from 'react';
import { BankAccount, Transaction, Category } from '../types';
import { TrendingUp, TrendingDown, Lightbulb, RefreshCw } from 'lucide-react';
import { getFinancialAdvice } from '../geminiService';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, categories }) => {
  const [aiAdvice, setAiAdvice] = useState<{ summary: string; advice: string[] } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'INCOME' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === 'EXPENSE' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const fetchAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(accounts, transactions, categories);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">總覽</h2>
          <p className="text-slate-500">追蹤你的財務健康狀況</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 font-medium">總資產淨值</p>
          <p className="text-3xl font-bold text-indigo-600">${totalBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="本月收入" 
          amount={monthlyIncome} 
          icon={<TrendingUp className="text-emerald-500" />} 
          color="bg-emerald-50"
        />
        <StatCard 
          title="本月支出" 
          amount={monthlyExpense} 
          icon={<TrendingDown className="text-rose-500" />} 
          color="bg-rose-50"
        />
        <StatCard 
          title="儲蓄率" 
          amount={monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100) : 0} 
          icon={<div className="text-amber-500 font-bold">%</div>} 
          color="bg-amber-50"
          suffix="%"
          isPercentage
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">最近交易紀錄</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {transactions.slice(-5).reverse().map(t => {
              const category = categories.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: category?.color || '#cbd5e1' }}
                    >
                      {category?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{t.note}</p>
                      <p className="text-xs text-slate-500">{t.date} · {category?.name}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
            {transactions.length === 0 && (
              <div className="p-8 text-center text-slate-400">尚無交易紀錄</div>
            )}
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lightbulb size={120} />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-amber-400" />
              <h3 className="font-bold text-lg">AI 理財顧問</h3>
            </div>
            <button 
              onClick={fetchAdvice}
              disabled={isAiLoading}
              className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={isAiLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {isAiLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="pt-4 space-y-2">
                <div className="h-3 bg-white/10 rounded"></div>
                <div className="h-3 bg-white/10 rounded"></div>
                <div className="h-3 bg-white/10 rounded"></div>
              </div>
            </div>
          ) : aiAdvice ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-indigo-100">
                {aiAdvice.summary}
              </p>
              <div className="space-y-2">
                {aiAdvice.advice.map((item, idx) => (
                  <div key={idx} className="flex gap-2 text-sm bg-white/10 p-2 rounded-lg border border-white/5">
                    <span className="font-bold text-amber-400">{idx + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-indigo-200 text-sm">點擊重新整理按鈕以獲取 AI 建議。</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  amount: number; 
  icon: React.ReactNode; 
  color: string;
  suffix?: string;
  isPercentage?: boolean;
}> = ({ title, amount, icon, color, suffix = '', isPercentage = false }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-500 font-medium">{title}</span>
      <div className={`p-2 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <h4 className="text-2xl font-bold text-slate-800">
        {!isPercentage && '$'}{amount.toLocaleString()}{suffix}
      </h4>
    </div>
  </div>
);

export default Dashboard;
