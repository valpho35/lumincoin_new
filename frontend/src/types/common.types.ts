export interface Route {
  route: string;
  title?: string;
  filePathTemplate?: string;
  useLayout?: string | boolean;
  load?: () => void;
  authRequired?: boolean;
}

export interface Operation {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  comment: string;
  category?: string;
  category_income_id?: number;
  category_expense_id?: number;
}

export interface Category {
  id: string;
  title: string;
  type?: 'income' | 'expense';
}