
import { Category, BankAccount, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '薪資', type: 'INCOME', color: '#10B981' },
  { id: 'cat-2', name: '飲食', type: 'EXPENSE', color: '#EF4444' },
  { id: 'cat-3', name: '交通', type: 'EXPENSE', color: '#3B82F6' },
  { id: 'cat-4', name: '娛樂', type: 'EXPENSE', color: '#F59E0B' },
  { id: 'cat-5', name: '購物', type: 'EXPENSE', color: '#8B5CF6' },
  { id: 'cat-6', name: '住房', type: 'EXPENSE', color: '#6B7280' },
  { id: 'cat-7', name: '投資', type: 'INCOME', color: '#059669' },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'acc-1', name: '台銀主帳戶', type: '活期存款', balance: 50000, currency: 'TWD' },
  { id: 'acc-2', name: '國泰現金回饋', type: '信用卡', balance: -5000, currency: 'TWD' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-1', accountId: 'acc-1', categoryId: 'cat-1', amount: 60000, type: 'INCOME', date: '2024-05-01', note: '5月薪資' },
  { id: 't-2', accountId: 'acc-1', categoryId: 'cat-2', amount: 120, type: 'EXPENSE', date: '2024-05-02', note: '午餐' },
  { id: 't-3', accountId: 'acc-1', categoryId: 'cat-3', amount: 45, type: 'EXPENSE', date: '2024-05-02', note: '捷運' },
  { id: 't-4', accountId: 'acc-2', categoryId: 'cat-5', amount: 2500, type: 'EXPENSE', date: '2024-05-03', note: '新鞋子' },
];
