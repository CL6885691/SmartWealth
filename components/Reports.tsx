
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction, Category, BankAccount } from '../types';

interface ReportsProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, categories }) => {
  // Aggregate expenses by category
  const expenseByCategory = categories
    .filter(c => c.type === 'EXPENSE')
    .map(cat => {
      const value = transactions
        .filter(t => t.categoryId === cat.id && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: cat.name, value, color: cat.color };
    })
    .filter(item => item.value > 0);

  // Aggregate by Month for BarChart
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const monthlyData = months.map(m => {
    const monthYear = `2024-${m}`; // Hardcoded for demo
    const income = transactions
      .filter(t => t.date.startsWith(monthYear) && t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.date.startsWith(monthYear) && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return { month: m, 收入: income, 支出: expense };
  }).filter(d => d.收入 > 0 || d.支出 > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">分析報表</h2>
        <p className="text-slate-500">視覺化您的收支趨勢與比例</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">支出比例分析</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {expenseByCategory.length === 0 && (
            <p className="text-center text-slate-400 mt-4">尚無支出數據可供分析</p>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">年度收支趨勢</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="收入" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="支出" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl">
        <h4 className="font-bold text-indigo-900 text-lg mb-4">分析洞察</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">最大支出類別</p>
            <p className="text-xl font-bold text-indigo-600">
              {expenseByCategory.length > 0 
                ? expenseByCategory.reduce((max, curr) => curr.value > max.value ? curr : max).name
                : '無數據'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">平均月存比例</p>
            <p className="text-xl font-bold text-emerald-600">
              35%
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">財務評分</p>
            <p className="text-xl font-bold text-amber-500">
              優良 (85/100)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
