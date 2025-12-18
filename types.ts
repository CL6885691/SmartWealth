
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: string; // e.g., 'Savings', 'Checking', 'Credit Card'
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: string;
  note: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AppData {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}
