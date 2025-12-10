export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  department: string;
  phoneNumber: string;
  joinDate: string;
  lastLogin: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  users: UsersState;
}

export interface FieldConfig {
  fieldName: string;
  label: string;
  value?: any;
  type: 'text' | 'number' | 'select' | 'radio' | 'boolean' | 'date';
  multiple?: boolean;
  options?: { label: string; value: string | number }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
}

export interface FormSchema {
  title: string;
  fields: FieldConfig[];
}

export interface TableHeader {
  label: string;
  fieldName: string;
  sortable?: boolean;
}

export interface TableConfig {
  headers: TableHeader[];
  data: any[];
  onEditClick?: (item: any) => void;
  onDeleteClick?: (item: any) => void;
  showActions?: boolean;
}